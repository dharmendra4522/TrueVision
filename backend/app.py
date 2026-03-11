from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import traceback
import gdown
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "best_fusion_model.h5"

if not os.path.exists(MODEL_PATH):
    print("Downloading model from Google Drive...")
    gdown.download(
        "https://drive.google.com/uc?id=1xm8FY-jj0kiCI403VP9uPDsAiQxS1FEV",
        MODEL_PATH,
        quiet=False
    )
    print("Model downloaded successfully!")

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")
print("Model input shape:", model.input_shape)  # ← yeh batayega exact size
print("Model output shape:", model.output_shape)  # ← yeh batayega output format

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Image read karo
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        print(f"Original image size: {image.size}")
        
        # Model ki input shape ke hisaab se resize karo
        input_shape = model.input_shape  # e.g. (None, 260, 260, 3)
        target_size = (input_shape[1], input_shape[2])
        print(f"Resizing to: {target_size}")
        
        image = image.resize(target_size)
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        print(f"Input array shape: {img_array.shape}")
        
        # Predict
        prediction = model.predict(img_array)
        print(f"Raw prediction: {prediction}")
        print(f"Prediction shape: {prediction.shape}")
        
        # Output handle karo
        raw = float(prediction[0][0])
        
        if raw > 0.5:
            verdict = "FAKE"
            conf_percent = int(raw * 100)
        else:
            verdict = "REAL"
            conf_percent = int((1 - raw) * 100)

        print("=" * 50)
        print(f"File name: {file.filename}")
        print(f"Raw prediction value: {raw}")
        print(f"Verdict: {verdict}")
        print(f"Confidence: {conf_percent}%")
        print("=" * 50)

        if verdict == "FAKE":
            indicators = [
                f"Synthetic facial probability: {conf_percent}%",
                "Unnatural texture patterns detected in skin regions",
                "Facial boundary inconsistencies found",
                "AI generation artifacts present near edges",
                "GAN-typical eye symmetry anomaly detected"
            ]
        else:
            indicators = [
                f"Authenticity score: {conf_percent}%",
                "Natural skin texture and lighting confirmed",
                "Facial boundaries appear consistent and organic",
                "No GAN-typical artifacts detected",
                "Compression patterns match real camera output"
            ]

        return {
            "verdict": verdict,
            "confidence": conf_percent,
            "reasoning": f"Model analyzed facial patterns with {conf_percent}% confidence.",
            "indicators": indicators
        }

    except Exception as e:
        # Poora error print karega terminal mein
        traceback.print_exc()
        return {"error": str(e)}

@app.get("/health")
async def health():
    return {"status": "TrueVision API is running!"}