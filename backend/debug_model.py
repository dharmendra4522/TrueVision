import os
import sys

# Try to find where we are
print(f"Current Dir: {os.getcwd()}")
print(f"Python Path: {sys.executable}")
print(f"Python Version: {sys.version}")

try:
    import tensorflow as tf
    print(f"TensorFlow Version: {tf.__version__}")
    
    MODEL_PATH = os.path.join("backend", "best_fusion_model.h5")
    if not os.path.exists(MODEL_PATH):
        MODEL_PATH = "best_fusion_model.h5"
        
    print(f"Loading model from: {MODEL_PATH}")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded.")
    
    # Check last layer
    last_layer = model.layers[-1]
    print(f"Last layer name: {last_layer.name}")
    print(f"Last layer config: {last_layer.get_config()}")
    
    # Test normalization hypotheses
    img_shape = (1, 260, 260, 3)
    
    # Range [0, 1]
    p1 = model.predict(np.ones(img_shape) * 0.5)
    print(f"Pred on 0.5 (Gray): {p1}")
    
    # Range [0, 255]
    p2 = model.predict(np.ones(img_shape) * 128)
    print(f"Pred on 128 (Gray): {p2}")

except Exception as e:
    import traceback
    traceback.print_exc()
