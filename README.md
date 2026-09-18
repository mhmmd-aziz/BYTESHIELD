# ByteShield 🛡️
**Advanced Static Analysis for Windows Executables using Deep Learning (CNN)**

ByteShield is a state-of-the-art AI-powered platform designed to perform static analysis on Windows executable files (`.exe`). It leverages Deep Learning, specifically Convolutional Neural Networks (CNN), to detect whether a given file is a Malware or Benign.

## 🌟 Key Features
- **Zero Execution Risk:** Uses Static Analysis to inspect file bytes without ever executing the file.
- **Deep Learning Core:** Converts binary files into high-resolution Byteplots (256x256 grayscale images) and feeds them into a highly trained CNN model.
- **Trained on MaleX 200K:** Our model is trained on a massive, balanced dataset consisting of 200,000 `.exe` files (100,000 Malware & 100,000 Benign).
- **Fast & Aesthetic UI/UX:** Built with a modern React frontend featuring glassmorphism and beautiful micro-animations for an enterprise-grade experience.
- **Comprehensive Admin Dashboard:** Real-time monitoring, PDF/Excel report generation, and data visualization tools for security analysts.

## 🚀 Technology Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Python, FastAPI, Uvicorn
- **AI/Machine Learning:** TensorFlow/Keras, OpenCV, Numpy

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mhmmd-aziz/BYTESHIELD.git
   cd BYTESHIELD
   ```

2. **Run the AI Backend (Python):**
   Make sure you have Python 3.9+ installed.
   ```bash
   pip install -r requirements.txt
   python main.py
   ```
   *The backend will run on `http://localhost:8000`*

3. **Run the Frontend (React):**
   Open a new terminal window.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`*

## 📜 Legal & Disclaimer
This software is developed as a prototype and competition entry for the National Politeknik Competition. Do not upload classified, confidential, or sensitive files without proper clearance. 

---
*Created by Muhammad Aziz - ByteShield Developer Team*
