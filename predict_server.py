import json
import os
import pickle
import warnings
import numpy as np
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

warnings.filterwarnings('ignore')

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rainfall_model.pkl')
ENCODER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'label_encoder.pkl')
REG_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rainfall_model_reg.pkl')

print("Loading ML models for continuous serving...", flush=True)

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        le = pickle.load(f)
    reg_model = None
    if os.path.exists(REG_MODEL_PATH):
        with open(REG_MODEL_PATH, 'rb') as f:
            reg_model = pickle.load(f)
    print("Models loaded successfully.", flush=True)
except Exception as e:
    print(f"Error loading models: {e}", flush=True)
    exit(1)

def predict(temperature, humidity, month):
    features = np.array([[temperature, humidity, month]])
    prediction = model.predict(features)
    probabilities = model.predict_proba(features)[0]

    level = le.inverse_transform(prediction)[0]
    confidence = round(float(max(probabilities)) * 100, 1)
    probs = {cls: f"{p*100:.1f}%" for cls, p in zip(le.classes_, probabilities)}

    return {"level": level, "confidence": confidence, "probabilities": probs}


def predict_mm(temperature, humidity, month):
    if reg_model is None:
        raise FileNotFoundError("Regression model not found. Run train_regression.py.")
    features = np.array([[temperature, humidity, month]])
    value = float(reg_model.predict(features)[0])
    return max(0.0, value)


class PredictHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Suppress logging to keep stdout clean
        pass

    def do_POST(self):
        if self.path == '/predict' or self.path == '/predict-mm':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Safely extract and convert to float/int, handling strings like "NaN"
                def safe_float(val, default=0.0):
                    try:
                        f = float(val)
                        return default if np.isnan(f) else f
                    except (ValueError, TypeError):
                        return default
                
                def safe_int(val, default=1):
                    try:
                        i = int(float(val))
                        return default if np.isnan(float(val)) else i
                    except (ValueError, TypeError):
                        return default

                temp = safe_float(data.get('temperature'), 0.0)
                hum = safe_float(data.get('humidity'), 0.0)
                mon = safe_int(data.get('month'), 1)

                if self.path == '/predict-mm':
                    result = {"rainfall_mm": round(predict_mm(temp, hum, mon), 1)}
                else:
                    result = predict(temp, hum, mon)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                error_response = {"error": str(e)}
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()


class PredictServer(ThreadingHTTPServer):
    request_queue_size = 100

def run_server(port=5001):
    server_address = ('127.0.0.1', port)
    httpd = PredictServer(server_address, PredictHandler)
    print(f"ML Predict Server running on port {port}...", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped.")

if __name__ == '__main__':
    run_server()
