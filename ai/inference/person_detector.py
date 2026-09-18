import os
from ultralytics import YOLO

class PersonDetector:
    def __init__(self, model_path="yolov8n.pt", conf_thresh=0.5):
        self.model = YOLO(model_path)
        self.conf_thresh = conf_thresh

    def detect(self, img):
        # Run YOLO inference, class 0 is person in COCO
        results = self.model.predict(img, classes=[0], conf=self.conf_thresh, verbose=False, device=0)
        persons = []
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                persons.append({
                    "bbox": [x1, y1, x2, y2],
                    "conf": conf
                })
        return persons
