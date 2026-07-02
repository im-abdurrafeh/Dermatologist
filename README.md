# Dermatologist 🩺

A full-stack skin disease diagnostic system designed to identify and classify various skin conditions. This project utilizes a highly accurate EfficientNetB3 model trained on the Dermnet dataset, served via a lightning-fast FastAPI backend, and presented through a custom, responsive scanner web interface.

## 🚀 Features

*   **Robust Classification:** Identifies up to 23 distinct skin conditions.
*   **Modern AI Architecture:** Powered by a fine-tuned EfficientNetB3 model using Keras/TensorFlow.
*   **High-Performance Backend:** Engineered with FastAPI for rapid and efficient API routing and inference serving.
*   **Intuitive User Interface:** Features a professional two-page frontend design, including a welcoming landing page and an easy-to-use custom scanner tool.

## 🛠️ Tech Stack

*   **Machine Learning:** Python, TensorFlow / Keras (EfficientNetB3)
*   **Backend:** FastAPI, Uvicorn
*   **Frontend:** HTML, CSS, JavaScript (Custom Web Interface)
*   **Dataset:** Dermnet

## 📁 Repository Structure

```text
├── Backend/                 # FastAPI server, ML pipeline, and API routing
├── Frontend/                # Landing page and custom scanner web interface
├── .gitignore               # Ignored files and virtual environments
├── LICENSE                  # Apache-2.0 License
├── README.md                # Project documentation
├── favicon.png              # Web interface icon
└── requirements.txt         # Python dependencies
