import gdown
import os

MODEL_PATH = "best_fusion_model.h5"

if not os.path.exists(MODEL_PATH):
    print("Downloading model from Google Drive...")
    gdown.download(
        "https://drive.google.com/uc?id=1xm8FY-jj0kiCI403VP9uPDsAiQxS1FEV",
        MODEL_PATH,
        quiet=False
    )
    print("Model downloaded successfully!")
else:
    print("Model already exists, skipping download.")