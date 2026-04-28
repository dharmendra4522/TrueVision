
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

MODEL_PATH = "best_fusion_model.h5"

def test_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model file {MODEL_PATH} not found.")
        return

    print("Loading model...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    print(f"Input shape: {model.input_shape}")
    
    # Create a dummy image
    input_size = (model.input_shape[1], model.input_shape[2])
    dummy_img = np.random.rand(1, *input_size, 3).astype(np.float32)
    
    print("Running dummy prediction...")
    try:
        prediction = model.predict(dummy_img)
        print(f"Prediction result: {prediction}")
        print("Model is working correctly!")
    except Exception as e:
        print(f"Prediction failed: {e}")

if __name__ == "__main__":
    test_model()
