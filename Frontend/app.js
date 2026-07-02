const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const dropZoneContent = document.getElementById('dropZoneContent');
const predictBtn = document.getElementById('predictBtn');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('resultContainer');
const mainPrediction = document.getElementById('mainPrediction');
const mainConfidence = document.getElementById('mainConfidence');
const breakdownList = document.getElementById('breakdownList');

let selectedFile = null;

// Only run these event listeners if we are on the detector page
if(dropZone) {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0d9488';
        dropZone.style.backgroundColor = '#f0fdfa';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#cbd5e1';
        dropZone.style.backgroundColor = '#f8fafc';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#cbd5e1';
        dropZone.style.backgroundColor = '#f8fafc';
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    dropZone.addEventListener('click', () => imageInput.click());
}

if(imageInput) {
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

function handleFile(file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.hidden = false;
        dropZoneContent.hidden = true;
        
        resultContainer.classList.add('hidden');
        predictBtn.disabled = false;
        predictBtn.innerHTML = '<i class="fa-solid fa-microscope"></i> Analyze Image';
    };
    reader.readAsDataURL(file);
}

function getProgressBarColor(probability) {
    if (probability >= 50) return '#0ea5e9'; // Blue
    if (probability >= 20) return '#f59e0b'; // Yellow
    if (probability >= 5) return '#94a3b8';  // Gray
    return '#cbd5e1';
}

if(predictBtn) {
    predictBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        loading.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        predictBtn.disabled = true;

        try {
            // Note: Update this URL when you deploy to Sevalla
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            loading.classList.add('hidden');

            if (data.success) {
                mainPrediction.textContent = data.prediction;
                mainConfidence.textContent = `${data.confidence}% Confidence`;
                
                breakdownList.innerHTML = '';
                const sortedProbs = Object.entries(data.all_probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5);

                for (const [className, prob] of sortedProbs) {
                    const barColor = getProgressBarColor(prob);
                    
                    breakdownList.innerHTML += `
                        <div class="bar-container">
                            <div class="bar-label">
                                <span>${className}</span>
                                <span>${prob}%</span>
                            </div>
                            <div class="bar-background">
                                <div class="bar-fill" style="width: ${prob}%; background-color: ${barColor};"></div>
                            </div>
                        </div>
                    `;
                }
                resultContainer.classList.remove('hidden');
            } else {
                alert("Error processing image: " + data.detail);
                predictBtn.disabled = false;
            }
        } catch (err) {
            loading.classList.add('hidden');
            predictBtn.disabled = false;
            alert("Failed to communicate with the FastAPI server.");
        }
    });
}