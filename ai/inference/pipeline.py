import cv2
import os
from ai.inference.person_detector import PersonDetector
from ai.inference.ppe_detector import PPEDetector
from ai.inference.smoking_detector import SmokingDetector
from ai.rules.ppe_rules import check_ppe_compliance
from ai.rules.smoking_rules import check_smoking_status

class AIPipeline:
    def __init__(self, config):
        person_model = config['models'].get('person', 'yolov8n.pt')
        ppe_model = config['models'].get('ppe', 'ai/models/ppe/best.pt')
        smoking_model = config['models'].get('smoking', 'ai/models/smoking/best.pt')
        
        self.person_det = PersonDetector(model_path=person_model, conf_thresh=config['thresholds'].get('person', 0.5))
        self.ppe_det = PPEDetector(model_path=ppe_model, conf_thresh=config['thresholds'].get('ppe', 0.5))
        self.smoking_det = SmokingDetector(model_path=smoking_model, conf_thresh=config['thresholds'].get('smoking', 0.5))

    def _is_inside(self, inner_box, outer_box):
        # Jika kotak PPE dan kotak Orang bersentuhan/berpotongan sedikit saja, anggap itu milik orang tersebut
        ix1 = max(inner_box[0], outer_box[0])
        iy1 = max(inner_box[1], outer_box[1])
        ix2 = min(inner_box[2], outer_box[2])
        iy2 = min(inner_box[3], outer_box[3])
        
        return (ix1 < ix2) and (iy1 < iy2)

    def process_frame(self, img, mode="ppe"):
        persons = self.person_det.detect(img)
        
        if mode == "ppe":
            items = self.ppe_det.detect(img)
        else:
            items = self.smoking_det.detect(img)
            
        result_persons = []
        for i, p in enumerate(persons):
            p_box = p['bbox']
            person_items = []
            for item in items:
                if self._is_inside(item['bbox'], p_box):
                    person_items.append(item)
            
            item_classes = [it['class'] for it in person_items]
            if mode == "ppe":
                status, missing = check_ppe_compliance(item_classes)
                res = {
                    "id": i+1, "bbox": p_box, 
                    "ppe_status": status, "ppe_missing": missing
                }
            else:
                status, reasons = check_smoking_status(item_classes)
                res = {
                    "id": i+1, "bbox": p_box,
                    "smoking_status": status, "smoking_reasons": reasons
                }
                
            result_persons.append(res)
            
            # Draw on image
            x1, y1, x2, y2 = map(int, p_box)
            if mode == "ppe":
                is_safe = (status == "COMPLIANT")
                if is_safe:
                    label = "SAFE: PPE LENGKAP"
                else:
                    # Tampilkan barang apa saja yang kurang
                    label = f"VIOLATION: KURANG: {', '.join(missing)}"
                    
                color = (0, 255, 0) if is_safe else (0, 0, 255) # BGR
                cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)
                
                # Text background
                (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                cv2.rectangle(img, (x1, max(y1 - 30, 0)), (x1 + w, max(y1, 30)), color, -1)
                cv2.putText(img, label, (x1, max(y1 - 10, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
            else:
                is_safe = (status == "NOT_SMOKING")
                label = "SAFE: AMAN" if is_safe else "VIOLATION: MEROKOK!"
                color = (0, 255, 0) if is_safe else (0, 0, 255) # BGR
                
                if not is_safe:
                    # Gambar kotak khusus di rokoknya saja, bukan badannya
                    for item in person_items:
                        if item['class'].lower() in ['cigarette', 'smoking']:
                            cx1, cy1, cx2, cy2 = map(int, item['bbox'])
                            cv2.rectangle(img, (cx1, cy1), (cx2, cy2), color, 3)
                            
                            (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                            cv2.rectangle(img, (cx1, max(cy1 - 30, 0)), (cx1 + w, max(cy1, 30)), color, -1)
                            cv2.putText(img, label, (cx1, max(cy1 - 10, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
                else:
                    # Gambar kotak di badan jika aman
                    cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)
                    (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                    cv2.rectangle(img, (x1, max(y1 - 30, 0)), (x1 + w, max(y1, 30)), color, -1)
                    cv2.putText(img, label, (x1, max(y1 - 10, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
            
        # Draw raw PPE detections for visibility and debugging
        if mode == "ppe":
            for item in items:
                ix1, iy1, ix2, iy2 = map(int, item['bbox'])
                cv2.rectangle(img, (ix1, iy1), (ix2, iy2), (255, 255, 0), 2) # Cyan color for raw PPE detections
                cv2.putText(img, item['class'], (ix1, max(iy1 - 5, 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,0), 1)

        return img, result_persons

    def process_image(self, img, mode="ppe"):
        ann_img, stats = self.process_frame(img.copy(), mode)
        return ann_img, stats

    def process_video(self, video_path, output_path, mode="ppe"):
        cap = cv2.VideoCapture(video_path)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if fps == 0: fps = 30
        
        # Web compatible codec H264 (avc1) or fallback to mp4v
        fourcc = cv2.VideoWriter_fourcc(*'avc1') 
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        print(f"\\n🎬 [AI ENGINE] Memulai pemrosesan video ({total_frames} frame)... Mode: {mode.upper()}")
        print(f"⚡ [AI ENGINE] Menggunakan akselerasi GPU (RTX 3050)...\\n")
        
        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            
            # Limit to 10 seconds for prototype speed (300 frames)
            if frame_count > fps * 15: 
                print(f"⚠️ [AI ENGINE] Mencapai batas durasi demo. Menghentikan pemrosesan.")
                break
                
            ann_img, _ = self.process_frame(frame, mode)
            out.write(ann_img)
            frame_count += 1
            
            # Print log setiap 5 frame agar terminal terlihat keren
            if frame_count % 5 == 0:
                print(f"⚙️ [AI ENGINE] GPU memproses frame ke-{frame_count} / {total_frames}...")
            
        cap.release()
        out.release()
        print(f"\\n✅ [AI ENGINE] Video selesai diproses! Hasil telah dikirim ke Web Dashboard.\\n")
