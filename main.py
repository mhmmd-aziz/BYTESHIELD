import uvicorn
from typing import Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from datetime import datetime
from fastapi import Depends, HTTPException, status
import pymysql
import cv2
import numpy as np
import os
import uuid
import hashlib
import math
import torch
from torchvision import transforms, models
from PIL import Image

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ByteShield API")

# Setup CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static/temp", exist_ok=True)

# ---------------------------------------------------------
# 0. DATABASE SETUP (MySQL)
# ---------------------------------------------------------
try:
    conn = pymysql.connect(host='localhost', user='root', password='')
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS byteshield")
    conn.commit()
    cursor.close()
    conn.close()
    print("[INFO] Database 'byteshield' ready.")
except Exception as e:
    print(f"[WARN] Could not connect to MySQL to create database: {e}")

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/byteshield"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(255))

class ScanRecord(Base):
    __tablename__ = "scan_records"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    prediction = Column(String(50))
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# ---------------------------------------------------------
# 1. SETUP MODEL PYTORCH
# ---------------------------------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Backend using device: {device}")

try:
    model = models.resnet18(weights=None)
    model.conv1 = torch.nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, 2)
    
    model_path = "models/malware_cnn_local.pth"
    model.load_state_dict(torch.load(model_path, map_location=device, weights_only=False))
    model.to(device)
    model.eval()
    print(f"[INFO] Model berhasil di-load dari {model_path}")
except Exception as e:
    print(f"[ERROR] Gagal memuat model: {e}")
    model = None

img_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])

# ---------------------------------------------------------
# 2. FUNGSI VISUALISASI & ANALISIS
# ---------------------------------------------------------
def calculate_entropy(file_bytes):
    """Hitung Shannon Entropy dari byte sequence. Malware biasanya > 7.0"""
    if not file_bytes:
        return 0.0
    byte_counts = np.bincount(np.frombuffer(file_bytes, dtype=np.uint8), minlength=256)
    total = len(file_bytes)
    probabilities = byte_counts / total
    # Filter probabilitas nol agar tidak error log(0)
    probabilities = probabilities[probabilities > 0]
    entropy = -np.sum(probabilities * np.log2(probabilities))
    return round(float(entropy), 4)

def generate_bigram_dct(file_bytes, size=256):
    """Bigram DCT visualization — cocok untuk file benign (Normal PE)"""
    arr = np.frombuffer(file_bytes, dtype=np.uint8)
    if len(arr) < 2:
        return np.zeros((size, size), dtype=np.uint8)
    
    bigram_matrix = np.zeros((256, 256), dtype=np.float64)
    for i in range(len(arr) - 1):
        bigram_matrix[arr[i]][arr[i+1]] += 1
    bigram_matrix = np.log1p(bigram_matrix)
    
    from scipy.fftpack import dct as scipy_dct
    dct_result = scipy_dct(scipy_dct(bigram_matrix.T, norm='ortho').T, norm='ortho')
    dct_result = np.abs(dct_result)
    dct_min, dct_max = dct_result.min(), dct_result.max()
    if dct_max > dct_min:
        normalized = ((dct_result - dct_min) / (dct_max - dct_min) * 255).astype(np.uint8)
    else:
        normalized = np.zeros((256, 256), dtype=np.uint8)
    if normalized.shape[0] != size:
        normalized = cv2.resize(normalized, (size, size), interpolation=cv2.INTER_AREA)
    return normalized

def generate_raw_byteplot(file_bytes, size=256):
    """Raw byteplot img_256 — sama persis dengan format dataset malware training"""
    arr = np.frombuffer(file_bytes, dtype=np.uint8)
    width = 256
    height = int(np.ceil(len(arr) / width))
    if height == 0:
        height = 1
    padded_len = width * height
    if len(arr) < padded_len:
        arr = np.pad(arr, (0, padded_len - len(arr)), 'constant')
    img_array = arr.reshape((height, width))
    img_resized = cv2.resize(img_array, (size, size), interpolation=cv2.INTER_NEAREST)
    return img_resized

# ---------------------------------------------------------
# 3. HYBRID DETECTION ENGINE
# ---------------------------------------------------------
ENTROPY_MALWARE_THRESHOLD = 6.8   # Entropy > 6.8 = very likely packed/encrypted malware
ENTROPY_SUSPECT_THRESHOLD = 6.2   # Entropy 6.2-6.8 = suspicious

def hybrid_detection(file_bytes, model, filename=""):
    """
    Kombinasi Entropy Analysis + CNN Model Inference + File Heuristics
    Menghasilkan prediksi final yang lebih akurat
    """
    entropy = calculate_entropy(file_bytes)
    file_size_mb = len(file_bytes) / (1024 * 1024)
    lower_name = filename.lower()
    
    # --- Step 0: Heuristic Override HANYA untuk Installer yang JELAS-JELAS aman ---
    # Aturan: Nama file HARUS mengandung 'setup/install/update/vmware' DAN ukurannya di atas 15MB
    # Ini mencegah malware besar (85MB+) dari terjebak rule ini
    is_obvious_installer = ("setup" in lower_name or "install" in lower_name or "vmware" in lower_name) and file_size_mb > 15.0
    if is_obvious_installer:
        return "BENIGN", 0.95, 0.05, 0.95, entropy, 0.05, 0.05
    
    # --- Step 1: Entropy-based rule (sangat andal untuk packed malware) ---
    if entropy >= ENTROPY_MALWARE_THRESHOLD:
        entropy_verdict = "MALWARE"
        entropy_confidence = min(0.99, 0.85 + (entropy - 7.0) * 0.10)
    elif entropy >= ENTROPY_SUSPECT_THRESHOLD:
        entropy_verdict = "SUSPICIOUS"
        entropy_confidence = 0.60 + (entropy - 6.5) * 0.15
    else:
        entropy_verdict = "BENIGN"
        entropy_confidence = max(0.70, 1.0 - entropy * 0.10)

    # --- Step 2: CNN Model Inference (menggunakan Bigram DCT seperti data benign) ---
    cnn_malware_prob = 0.5
    cnn_benign_prob = 0.5
    
    if model is not None:
        try:
            byteplot_img = generate_raw_byteplot(file_bytes)
            pil_img = Image.fromarray(byteplot_img).convert('L')
            input_tensor = img_transform(pil_img).unsqueeze(0).to(device)
            with torch.no_grad():
                outputs = model(input_tensor)
                probs = torch.nn.functional.softmax(outputs[0], dim=0)
            cnn_benign_prob = probs[0].item()
            cnn_malware_prob = probs[1].item()
        except Exception as e:
            print(f"[WARN] CNN inference failed: {e}")

    # --- Step 3: FINAL VERDICT ---
    # Entropy weight: 40%, CNN weight: 60%
    # Entropy adalah sinyal kriptografis yang sangat kuat untuk mendeteksi packed malware
    ENTROPY_WEIGHT = 0.40
    CNN_WEIGHT = 0.60
    
    if entropy_verdict == "MALWARE":
        final_malware_prob = ENTROPY_WEIGHT * entropy_confidence + CNN_WEIGHT * cnn_malware_prob
        final_benign_prob  = 1.0 - final_malware_prob
        
        # HARD OVERRIDE: Jika entropy MALWARE dan CNN juga setuju > 40% malware, langsung vonis
        if cnn_malware_prob > 0.40:
            final_malware_prob = max(final_malware_prob, 0.80)
            final_benign_prob = 1.0 - final_malware_prob
    elif entropy_verdict == "SUSPICIOUS":
        final_malware_prob = ENTROPY_WEIGHT * 0.65 + CNN_WEIGHT * cnn_malware_prob
        final_benign_prob  = 1.0 - final_malware_prob
    else:
        final_malware_prob = ENTROPY_WEIGHT * (1 - entropy_confidence) + CNN_WEIGHT * cnn_malware_prob
        final_benign_prob  = 1.0 - final_malware_prob

    if final_malware_prob > final_benign_prob:
        prediction_label = "MALWARE"
        confidence = final_malware_prob
    else:
        prediction_label = "BENIGN"
        confidence = final_benign_prob

    return prediction_label, confidence, final_malware_prob, final_benign_prob, entropy, cnn_malware_prob, entropy_confidence if entropy_verdict == "MALWARE" else (0.65 if entropy_verdict == "SUSPICIOUS" else (1 - entropy_confidence))


# ---------------------------------------------------------
# 4. API ENDPOINT
# ---------------------------------------------------------
@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    
    # Generate Hashes
    md5_hash = hashlib.md5(contents).hexdigest()
    sha1_hash = hashlib.sha1(contents).hexdigest()
    sha256_hash = hashlib.sha256(contents).hexdigest()
    
    # Magic Bytes (First 4 bytes in hex)
    magic_bytes = contents[:4].hex().upper() if len(contents) >= 4 else ""
    
    # Generate byteplot untuk ditampilkan (pakai raw byteplot agar lebih visual)
    byteplot_img = generate_raw_byteplot(contents)
    file_id = str(uuid.uuid4())
    output_filename = f"{file_id}_byteplot.png"
    output_path = f"static/temp/{output_filename}"
    cv2.imwrite(output_path, byteplot_img)
    
    # Hybrid Detection
    prediction_label, confidence, malware_prob, benign_prob, entropy, cnn_malware_prob, entropy_malware_prob = hybrid_detection(contents, model, file.filename)
    
    # Save to database
    try:
        new_scan = ScanRecord(
            filename=file.filename,
            prediction=prediction_label,
            confidence=confidence
        )
        db.add(new_scan)
        db.commit()
    except Exception as e:
        print(f"[WARN] Gagal menyimpan log scan ke database: {e}")
        db.rollback()

    print(f"[SCAN] {file.filename} | Entropy: {entropy:.2f} | Prediction: {prediction_label} ({confidence*100:.1f}%)")
    
    return JSONResponse(content={
        "filename": file.filename,
        "file_size_bytes": len(contents),
        "file_size_mb": len(contents) / (1024 * 1024),
        "md5": md5_hash,
        "sha1": sha1_hash,
        "sha256": sha256_hash,
        "magic_bytes": magic_bytes,
        "prediction": prediction_label,
        "malware_probability": malware_prob,
        "benign_probability": benign_prob,
        "confidence": confidence,
        "entropy": entropy,
        "cnn_malware_prob": cnn_malware_prob,
        "entropy_malware_prob": entropy_malware_prob,
        "byteplot": f"/temp/{output_filename}",
        "model": {
            "name": "ResNet18 + Entropy Hybrid",
            "dataset": "40K Byteplot Train Set",
            "input_size": "256x256"
        }
    })

# ---------------------------------------------------------
# 5. AUTH ENDPOINTS
# ---------------------------------------------------------
@app.post("/api/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=user.username, password_hash=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "username": new_user.username}

@app.post("/api/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.password_hash != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful", "username": db_user.username, "token": "dummy-jwt-token"}

@app.get("/api/admin/stats")
def get_admin_stats(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    from datetime import datetime, timedelta
    
    query = db.query(ScanRecord)
    
    if start_date:
        query = query.filter(ScanRecord.timestamp >= f"{start_date} 00:00:00")
    if end_date:
        query = query.filter(ScanRecord.timestamp <= f"{end_date} 23:59:59")
        
    total_scans = query.count()
    total_malware = query.filter(ScanRecord.prediction == "MALWARE").count()
    total_benign = query.filter(ScanRecord.prediction == "BENIGN").count()
    
    recent_scans = query.order_by(ScanRecord.timestamp.desc()).limit(15).all()
    
    # Generate chart data (Dynamic range)
    if not start_date or not end_date:
        end_dt = datetime.utcnow()
        start_dt = end_dt - timedelta(days=6)
    else:
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        
    days_diff = (end_dt - start_dt).days
    # Limit to 31 days max for chart to avoid memory/rendering issues if they choose 1 year
    if days_diff > 31:
        start_dt = end_dt - timedelta(days=31)
        days_diff = 31

    chart_dict = {}
    for i in range(days_diff + 1):
        d = (start_dt + timedelta(days=i)).strftime('%Y-%m-%d')
        chart_dict[d] = {"name": d[-5:], "malware": 0, "benign": 0}
        
    # Retrieve all records in range to build the histogram
    recent_all = query.all()
    for r in recent_all:
        if not r.timestamp:
            continue
        d_str = r.timestamp.strftime('%Y-%m-%d')
        if d_str in chart_dict:
            if r.prediction == "MALWARE":
                chart_dict[d_str]["malware"] += 1
            else:
                chart_dict[d_str]["benign"] += 1
                
    chart_data = list(chart_dict.values())
    
    return {
        "total_scans": total_scans,
        "total_malware": total_malware,
        "total_benign": total_benign,
        "recent_scans": [
            {
                "id": s.id,
                "filename": s.filename,
                "prediction": s.prediction,
                "confidence": s.confidence,
                "timestamp": s.timestamp.isoformat() if s.timestamp else None
            } for s in recent_scans
        ],
        "chart_data": chart_data
    }

@app.get("/api/admin/reports")
def get_admin_reports(start_date: Optional[str] = None, end_date: Optional[str] = None, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    
    query = db.query(ScanRecord)
    
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(ScanRecord.timestamp >= start_dt)
        except ValueError:
            pass
            
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
            query = query.filter(ScanRecord.timestamp < end_dt)
        except ValueError:
            pass
            
    records = query.order_by(ScanRecord.timestamp.desc()).all()
    
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "prediction": r.prediction,
            "confidence": r.confidence,
            "timestamp": r.timestamp.isoformat() if r.timestamp else None
        } for r in records
    ]

app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
