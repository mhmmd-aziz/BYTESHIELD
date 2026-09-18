import os
import glob
import cv2
import numpy as np
import uuid
import shutil
import random
from tqdm import tqdm

def generate_raw_byteplot(file_bytes, size=256):
    """Raw byteplot img_256 — sama persis dengan format dataset malware training"""
    arr = np.frombuffer(file_bytes, dtype=np.uint8)
    if len(arr) == 0:
        return np.zeros((size, size), dtype=np.uint8)
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

def clear_directory(directory):
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory, exist_ok=True)

def gather_benign_files(target_count=5000):
    directories_to_scan = [
        r"C:\Windows\System32",
        r"C:\Windows\SysWOW64",
        r"C:\Program Files",
    ]
    extensions = ['.exe', '.dll']
    found_files = []
    
    print("[INFO] Mencari file .exe dan .dll di sistem...")
    for directory in directories_to_scan:
        for ext in extensions:
            try:
                # Use recursive globbing but limit depth to avoid freezing
                search_pattern = os.path.join(directory, f"*{ext}")
                for file_path in glob.iglob(search_pattern):
                    found_files.append(file_path)
            except Exception as e:
                pass
                
    # Also get one level deep
    for directory in directories_to_scan:
        for ext in extensions:
            try:
                search_pattern = os.path.join(directory, "*", f"*{ext}")
                for file_path in glob.iglob(search_pattern):
                    found_files.append(file_path)
            except Exception as e:
                pass

    print(f"[INFO] Ditemukan {len(found_files)} file benign. Mengambil {target_count} file secara acak...")
    
    # Remove duplicates
    found_files = list(set(found_files))
    
    # Shuffle and select
    random.shuffle(found_files)
    return found_files[:target_count]

def generate_dataset():
    target_count = 5000
    dataset_benign_dir = r"dataset\benign"
    
    print(f"[INFO] Membersihkan folder {dataset_benign_dir} (menghapus dataset lama)...")
    clear_directory(dataset_benign_dir)
    
    files_to_process = gather_benign_files(target_count)
    
    print("[INFO] Memulai pembuatan gambar Raw Byteplot...")
    success_count = 0
    
    for file_path in tqdm(files_to_process, desc="Generating Benign Dataset"):
        try:
            with open(file_path, "rb") as f:
                file_bytes = f.read()
            
            # Skip very small files or very large files to save memory
            if len(file_bytes) < 1024 or len(file_bytes) > 50_000_000:
                continue
                
            img = generate_raw_byteplot(file_bytes)
            
            # Save the image
            file_hash = uuid.uuid4().hex
            img_filename = f"benign_{file_hash}_img_256.png"
            img_path = os.path.join(dataset_benign_dir, img_filename)
            
            cv2.imwrite(img_path, img)
            success_count += 1
            
            if success_count >= target_count:
                break
                
        except Exception as e:
            # Skip file if access is denied or read error
            continue

    print(f"\n[SUKSES] Berhasil men-generate {success_count} gambar Benign (Raw Byteplot) di folder {dataset_benign_dir}!")

if __name__ == "__main__":
    generate_dataset()
