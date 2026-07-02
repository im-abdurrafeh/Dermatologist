import io
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Skin Disease AI (Dermnet)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. LOAD EFFICIENTNET MODEL
# ==========================================
try:
    model = tf.keras.models.load_model("dermnet_efficientnet_model.keras")
    print("✅ Dermnet EfficientNetB3 Model Loaded Successfully!")
except Exception as e:
    print(f"⚠️ ERROR LOADING MODEL: {e}")
    model = None

# ==========================================
# 2. CLASS DEFINITIONS (23 Classes)
# ==========================================
DERMNET_CLASSES = [
    "Acne and Rosacea",
    "Actinic Keratosis",
    "Atopic Dermatitis",
    "Bullous Disease",
    "Cellulitis Impetigo",
    "Eczema",
    "Exanthems and Drug Eruptions",
    "Hair Loss",
    "Herpes HPV",
    "Light Diseases",
    "Lupus",
    "Melanoma Skin Cancer",
    "Nail Fungus",
    "Poison Ivy",
    "Psoriasis",
    "Scabies Lyme Disease",
    "Seborrheic Keratoses",
    "Systemic Disease",
    "Tinea Ringworm",
    "Urticaria Hives",
    "Vascular Tumors",
    "Vasculitis",
    "Warts Molluscum"
]

def preprocess_image(image_bytes: bytes, target_size=(300, 300)):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    # Note: EfficientNet handles its own scaling, so we DO NOT divide by 255.0
    img_array = np.array(img, dtype=np.float32)
    return np.expand_dims(img_array, axis=0)

# ==========================================
# 3. PREDICTION LOGIC
# ==========================================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Model is missing or not loaded.")
    
    try:
        contents = await file.read()
        processed_image = preprocess_image(contents, target_size=(300, 300))
        
        preds = model.predict(processed_image)[0]
        best_idx = int(np.argmax(preds))
        winner_class = DERMNET_CLASSES[best_idx]
        best_conf = float(preds[best_idx])

        # Create probability dictionary
        winner_probs = {DERMNET_CLASSES[i]: round(float(prob)*100, 2) for i, prob in enumerate(preds)}

        return {
            "success": True,
            "prediction": winner_class,
            "confidence": round(best_conf * 100, 2),
            "model_used": "EfficientNetB3 (Macroscopic)",
            "all_probabilities": winner_probs
        }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))