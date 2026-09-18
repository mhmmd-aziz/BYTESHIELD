# ByteShield 🛡️

**Analisis Statis Tingkat Lanjut untuk Windows Executable Berbasis Deep Learning (CNN)**

**ByteShield** adalah platform deteksi *malware* mutakhir bertenaga *Artificial Intelligence* (Kecerdasan Buatan). Sistem ini dirancang untuk melakukan **analisis statis** pada file *executable* Windows (`.exe`) guna membedakan secara instan apakah suatu *file* berbahaya (*Malware*) atau aman (*Benign/Bersih*).

Berbeda dengan antivirus tradisional yang mengandalkan basis data *signature* atau analisis dinamis yang berisiko, ByteShield menggunakan pendekatan visualisasi *byteplot* yang digabungkan dengan **Convolutional Neural Network (CNN)**.

---

## 🌟 Fitur Utama

- **Zero Execution Risk (Deteksi Tanpa Risiko):** Menggunakan teknik Analisis Statis. File yang dicurigai tidak akan pernah dieksekusi atau dijalankan di lingkungan *server*, sehingga menghilangkan risiko infeksi saat proses pemindaian.
- **Teknologi Deep Learning CNN:** Mengonversi struktur *binary/hex* dari file `.exe` menjadi representasi gambar dua dimensi (grayscale *byteplot* resolusi 256x256). Gambar ini kemudian dianalisis pola visualnya oleh algoritma CNN layaknya pengenalan wajah.
- **Dataset Skala Besar (MaleX 200K):** Model AI kami dilatih menggunakan dataset **MaleX 200K** yang terdiri dari 200.000 file *executable* terverifikasi (100.000 *Malware* dan 100.000 *Benign*), menjamin akurasi dan ketahanan model yang tinggi.
- **UI/UX Premium (Vibe Coding):** Dibangun dengan antarmuka pengguna berbasis React.js yang modern, menampilkan elemen *glassmorphism*, tipografi berkelas, dan transisi *micro-animation* halus dengan standar aplikasi skala *Enterprise*.
- **Admin Dashboard Terpusat:** Dilengkapi dasbor admin yang memungkinkan monitoring riwayat pemindaian secara *real-time*, penyaringan data, serta ekspor laporan otomatis ke dalam format PDF dan Excel.

---

## 🚀 Teknologi yang Digunakan (Tech Stack)

Aplikasi ini mengusung arsitektur modern (*decoupled architecture*) dengan pemisahan antara sistem *frontend* dan *backend*:

### **Frontend (Antarmuka Pengguna)**
- **React.js & Vite:** Eksekusi rendering super cepat.
- **Tailwind CSS:** Sistem *styling* utilitas untuk merakit *UI/UX* yang rapi.
- **Framer Motion:** Animasi transisi yang *fluid* dan mulus.
- **Recharts & jsPDF:** Visualisasi data grafik dan generator laporan dokumen.

### **Backend & AI (Inti Server)**
- **Python (FastAPI):** Kerangka kerja API berkinerja tinggi.
- **TensorFlow / Keras:** *Framework* utama untuk pembangunan dan prediksi model CNN.
- **OpenCV & Numpy:** Ekstraksi gambar *byteplot* (pemrosesan matriks dan komputasi piksel).

---

## 💻 Cara Menjalankan Aplikasi di Komputer Lokal

### Prasyarat:
- Node.js (Minimal v16+)
- Python (Minimal v3.9+)

### 1. Kloning Repositori
```bash
git clone https://github.com/mhmmd-aziz/BYTESHIELD.git
cd BYTESHIELD
```

### 2. Menjalankan Backend & AI Server (Python)
Buka *Terminal/Command Prompt* baru:
```bash
# Instal semua modul pendukung
pip install -r requirements.txt

# Jalankan server
python main.py
```
*Backend API akan menyala di `http://localhost:8000`*

### 3. Menjalankan Frontend (React Web)
Buka *Terminal/Command Prompt* baru:
```bash
cd frontend

# Instal dependensi node_modules
npm install

# Jalankan web versi development
npm run dev
```
*Frontend Web akan menyala di `http://localhost:5173`. Silakan buka tautan tersebut di peramban web (browser).*

---

## 📂 Struktur Proyek
- `/ai` : Berisi konfigurasi dan alur pipa prediksi model CNN.
- `/models` : Direktori penyimpanan beban otak AI (file `.pth` atau `.keras`).
- `/frontend` : Seluruh berkas pembangun antarmuka pengguna UI/UX React.
- `main.py` : Berkas inti penghubung rute *Backend* (API endpoints).
- `generate_benign_dataset.py` : Skrip pra-pemrosesan dataset mentah.

---

## 📜 Disclaimer & Legal
Perangkat lunak ini dikembangkan sebagai purwarupa (*prototype*) sekaligus entri kompetisi dalam **Kompetisi Politeknik Nasional (Lomba Vibe Coding)**. Penggunaan sistem ini murni untuk tujuan penelitian, deteksi dini, dan edukasi keamanan siber.

---
*Dikembangkan dengan penuh dedikasi oleh Muhammad Aziz & Tim Developer ByteShield*
