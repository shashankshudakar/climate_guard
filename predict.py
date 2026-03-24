"""
ClimateGuard — CLI Rainfall Prediction
Called by Express backend via child_process.

Usage:
    python predict.py <temperature> <humidity> <month>
    python predict.py 28.5 85 7

Output (JSON):
    {"level":"Heavy","confidence":82.2,"probabilities":{"Heavy":"82.2%","Low":"0.8%","Medium":"16.9%"}}
"""

import sys
import json
import os
import pickle
import warnings
import numpy as np

warnings.filterwarnings('ignore')

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rainfall_model.pkl')
ENCODER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'label_encoder.pkl')


def predict(temperature, humidity, month):
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        le = pickle.load(f)

    features = np.array([[temperature, humidity, month]])
    prediction = model.predict(features)
    probabilities = model.predict_proba(features)[0]

    level = le.inverse_transform(prediction)[0]
    confidence = round(float(max(probabilities)) * 100, 1)
    probs = {cls: f"{p*100:.1f}%" for cls, p in zip(le.classes_, probabilities)}

    return {"level": level, "confidence": confidence, "probabilities": probs}


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python predict.py <temperature> <humidity> <month>"}))
        sys.exit(1)

    try:
        temp = float(sys.argv[1])
        hum = float(sys.argv[2])
        mon = int(sys.argv[3])
        result = predict(temp, hum, mon)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
