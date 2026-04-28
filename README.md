<div align="center">
  <h1>👁️ TrueVision</h1>
  <p><strong>AI-Powered Deepfake Detection System</strong></p>
  <p><i>Unveiling the truth behind pixels using spatial and frequency neural analysis.</i></p>
</div>

<br />

## 🌟 Overview

**TrueVision** is an advanced, full-stack application designed to combat visual misinformation. By leveraging deep learning (TensorFlow/Keras), TrueVision analyzes uploaded images to determine their authenticity, accurately differentiating between genuine photographs and AI-generated deepfakes or GAN manipulations. 

Coupled with a highly interactive, futuristic cyberpunk-themed frontend, the application provides an immersive experience while delivering high-confidence neural analysis.

---

## ✨ Key Features

- **🧠 Deepfake Detection Engine**: Powered by a custom trained deep learning model (`best_fusion_model.h5`) capable of detecting synthetic facial probabilities and unnatural texture patterns.
- **⚡ Real-time Neural Analysis**: Fast inference using FastAPI backend with optimized image preprocessing (LANCZOS resampling).
- **🎨 Premium Cyberpunk UI**: Features interactive glassmorphism components, floating particle simulations, and 3D hologram effects.
- **👾 Dynamic UI Effects**: Includes CSS-based "Cyber Glitch" animations for security alerts, automatic smooth scrolling, and dynamic Typewriter effects for AI reasoning.
- **📱 Responsive Layout**: Fully responsive and mobile-friendly design built with Tailwind CSS.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js + Vite
- **Styling:** Tailwind CSS, Custom CSS Keyframes
- **Animation:** HTML5 Canvas (Interactive Particles), CSS Glitch & Typewriter Effects

### **Backend**
- **Framework:** FastAPI (Python)
- **Machine Learning:** TensorFlow, Keras
- **Image Processing:** Pillow (PIL), NumPy
- **Server:** Uvicorn

---

## 🚀 Getting Started

Follow these steps to run TrueVision locally on your machine.

### Prerequisites
- Node.js (v16+)
- Python (3.9+)

### 1. Backend Setup (FastAPI & TensorFlow)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn app:app --reload
   ```
   *The backend API will run on `http://127.0.0.1:8000`.*

### 2. Frontend Setup (React & Vite)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 📂 Project Structure

```text
TrueVision/
│
├── backend/
│   ├── app.py                     # Main FastAPI server and prediction logic
│   ├── best_fusion_model.h5       # Pre-trained deep learning model
│   ├── requirements.txt           # Python dependencies
│   └── test_model.py              # Script for testing model loading
│
└── frontend/
    ├── public/                    # Static assets
    ├── src/
    │   ├── components/            # Reusable React components (e.g., Hologram)
    │   ├── App.jsx                # Main application component & layout
    │   ├── index.css              # Global styles, animations & Tailwind configs
    │   └── main.jsx               # React DOM entry point
    ├── package.json               # Frontend dependencies
    └── tailwind.config.js         # Tailwind styling configuration
```

---

## 🌐 API Reference

### `POST /predict`
Evaluates an uploaded image and returns a deepfake detection verdict.

- **Payload:** `multipart/form-data` containing the `file` (Image).
- **Response Example:**
```json
{
  "verdict": "FAKE",
  "confidence": 92,
  "reasoning": "Model analyzed facial patterns with 92% confidence.",
  "indicators": [
    "Synthetic facial probability: 92%",
    "Unnatural texture patterns detected in skin regions",
    "Facial boundary inconsistencies found",
    "AI generation artifacts present near edges",
    "GAN-typical eye symmetry anomaly detected"
  ]
}
```

---

## 👨‍💻 Project Team

**ID:** 22-26/IT/G23 | AKGEC, Ghaziabad

- Anchal Chauhan (2200270130018)
- Anshika Goel (2100270130020)
- Atul Shukla (2200270130040)
- Dharmendra Vishvkarma (2300270139006)

**Under the Guidance of:**
Dr. Sarvachan Verma *(Assistant Professor, Dept. of Information Technology)*

---
<div align="center">
  <p><i>TrueVision v2.0 • Deep Space Neural Lab • 2026</i></p>
</div>
