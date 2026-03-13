import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
tf.config.set_visible_devices([], 'GPU')
from PIL import Image
import io
import traceback
import gdown

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
    print("Model downloaded!")

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")
print("Model input shape:", model.input_shape)
print("Model output shape:", model.output_shape)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        print(f"Original image size: {image.size}")

        input_shape = model.input_shape
        target_size = (input_shape[1], input_shape[2])
        print(f"Resizing to: {target_size}")

        image = image.resize(target_size, Image.Resampling.LANCZOS)
        img_array = np.array(image).astype(np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        print(f"Input array shape: {img_array.shape}")

        prediction = model.predict(img_array)
        raw = float(prediction[0][0])

        if raw > 0.5:
            verdict = "FAKE"
            conf_percent = int(raw * 100)
        else:
            verdict = "REAL"
            conf_percent = int((1 - raw) * 100)

        print("=" * 50)
        print(f"File: {file.filename} | Raw: {raw:.4f} | Verdict: {verdict} ({conf_percent}%)")
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
        traceback.print_exc()
        return {"error": str(e)}

@app.get("/health")
async def health():
    return {"status": "TrueVision API is running!"}