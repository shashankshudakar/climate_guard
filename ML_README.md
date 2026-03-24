# ClimateGuard Backend ML Integration

## Quick Start

```bash
# 1. Setup ML environment (interactive setup)
node ml_quickstart.js

# 2. Start the backend server
npm start

# 3. Test ML predictions (in another terminal)
node test_ml_integration.js
```

## What's New

### 1. **ML Prediction Endpoint** (`POST /api/rainfall-predict`)
Predict rainfall levels using a trained RandomForest model.

```bash
curl -X POST http://localhost:5000/api/rainfall-predict \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 28.5,
    "humidity": 85,
    "month": 7
  }'
```

**Response:**
```json
{
  "status": "success",
  "prediction": "Heavy",
  "confidence": 82.2,
  "probabilities": {
    "Heavy": "82.2%",
    "Medium": "16.9%",
    "Low": "0.8%"
  },
  "input": {
    "temperature": 28.5,
    "humidity": 85,
    "month": 7,
    "month_name": "July"
  }
}
```

### 2. **Model Status Endpoint** (`GET /api/ml/status`)
Check if the ML model is trained and ready.

```bash
curl http://localhost:5000/api/ml/status
```

**Response (Ready):**
```json
{
  "status": "ready",
  "message": "ML model is trained and ready for predictions",
  "details": {
    "model_trained": true,
    "encoder_exists": true,
    "predict_script_exists": true,
    "ready": true
  }
}
```

## Files

### Backend Files
- **server.js** - Enhanced with ML integration (improved errors, validation, logging)
- **test_ml_integration.js** - Comprehensive ML integration test suite
- **ml_quickstart.js** - Interactive setup wizard

### ML Model Files
- **ml_model/predict.py** - Prediction script (calls trained model)
- **ml_model/train_model.py** - Model training script
- **ml_model/setup.py** - Automated setup for ML environment
- **ml_model/rainfall_model.pkl** - Trained RandomForest model
- **ml_model/label_encoder.pkl** - Label encoder for predictions

### Documentation
- **ML_INTEGRATION_GUIDE.md** - Comprehensive integration guide
- **README.md** (this file)

## How It Works

```
Request: POST /api/rainfall-predict
  ↓
Node.js validates parameters (temperature, humidity, month)
  ↓
Spawns Python child process
  ↓
Python loads model files (rainfall_model.pkl, label_encoder.pkl)
  ↓
Makes prediction using RandomForest classifier
  ↓
Returns JSON with prediction and probabilities
  ↓
Response sent to client
```

## Setup Requirements

### 1. Python 3.8+
```bash
# Verify installation
python --version
```

### 2. ML Dependencies
Automatically installed via setup scripts:
- pandas 2.1.4
- scikit-learn 1.3.2
- numpy 1.26.2

### 3. Trained Model
Create by running:
```bash
python ml_model/train_model.py
```

## Testing

### Run All Tests
```bash
# Interactive setup (recommended first time)
node ml_quickstart.js

# Run complete test suite
node test_ml_integration.js

# Run API tests (need server running)
npm start  # Terminal 1
node test_api_routes.js  # Terminal 2
```

### Manual Testing
```bash
# Test Python directly
python ml_model/predict.py 28.5 85 7

# Test API with curl
curl -X POST http://localhost:5000/api/rainfall-predict \
  -H "Content-Type: application/json" \
  -d '{"temperature": 28, "humidity": 80, "month": 5}'

# Check model status
curl http://localhost:5000/api/ml/status

# Health check
curl http://localhost:5000/api/health
```

## API Parameters

### POST /api/rainfall-predict

| Parameter | Type | Range | Required | Description |
|-----------|------|-------|----------|-------------|
| temperature | number | 0-50 | Yes | Temperature in °C |
| humidity | number | 0-100 | Yes | Humidity percentage |
| month | integer | 1-12 | Yes | Calendar month |

### Predictions

| Level | Range | Description |
|-------|-------|-------------|
| Low | < 30mm | Dry conditions |
| Medium | 30-100mm | Moderate rainfall |
| Heavy | > 100mm | Heavy rainfall |

## Integration Examples

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:5000/api/rainfall-predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    temperature: 28.5,
    humidity: 85,
    month: 7
  })
});

const data = await response.json();
console.log(`Rainfall: ${data.prediction} (${data.confidence}% confident)`);
```

### Python
```python
import requests

response = requests.post('http://localhost:5000/api/rainfall-predict', json={
    'temperature': 28.5,
    'humidity': 85,
    'month': 7
})

data = response.json()
print(f"Rainfall: {data['prediction']} ({data['confidence']}% confident)")
```

### cURL
```bash
curl -X POST http://localhost:5000/api/rainfall-predict \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 28.5,
    "humidity": 85,
    "month": 7
  }' | jq .
```

## Troubleshooting

### Python Not Found
```bash
# Check Python installation
python --version

# Add to PATH (Windows)
# Or reinstall Python with "Add Python to PATH" checked
```

### Model Not Trained
```bash
# Train the model
python ml_model/train_model.py

# Verify model files exist
ls ml_model/rainfall_model.pkl
ls ml_model/label_encoder.pkl
```

### Dependencies Missing
```bash
# Reinstall all dependencies
pip install -r ml_model/requirements.txt --force-reinstall
```

### Prediction Timeout
Increase timeout in server.js if your system is slow:
```javascript
execFile(pythonCmd, [...], {
    timeout: 30000,  // 30 seconds instead of 15
    ...
})
```

## Performance

Typical response times:
- **Python startup**: 0.2-0.5s
- **Model loading**: 0.1-0.2s  
- **Prediction**: 0.01-0.05s
- **Total**: 0.3-0.8s per request

Cache predictions or batch requests for better performance.

## Model Information

**Algorithm:** RandomForest Classifier
- **Trees:** 100
- **Max Depth:** 10
- **Training Data:** rainfall_dataset.csv (historical rainfall data)
- **Accuracy:** ~80-85% (varies with data)

**Features Used:**
1. Temperature (°C)
2. Humidity (%)
3. Month (1-12)

**Output Classes:**
- Low (< 30mm)
- Medium (30-100mm)
- Heavy (> 100mm)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│         ClimateGuard Frontend (React)               │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP POST
                           ↓
┌─────────────────────────────────────────────────────┐
│  Node.js Express Backend (server.js)                │
│ ┌──────────────────────────────────────────────┐   │
│ │ /api/rainfall-predict                        │   │
│ │ - Validate input (temperature, humidity, ...) │   │
│ │ - Check model files                          │   │
│ │ - Spawn Python process                       │   │
│ └──────────────┬───────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                           │ child_process.execFile()
                           ↓
┌─────────────────────────────────────────────────────┐
│  Python ML Model (predict.py)                       │
│ ┌──────────────────────────────────────────────┐   │
│ │ - Load rainfall_model.pkl (RandomForest)     │   │
│ │ - Load label_encoder.pkl                     │   │
│ │ - Make prediction                            │   │
│ │ - Return JSON with confidences               │   │
│ └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Next Steps

1. ✓ Run `node ml_quickstart.js` to setup
2. ✓ Start server with `npm start`
3. ✓ Test predictions with `node test_ml_integration.js`
4. ✓ Integrate with frontend React components
5. ✓ Monitor predictions and retrain model as needed

## Support & Documentation

- **Integration Guide**: See [ML_INTEGRATION_GUIDE.md](../ML_INTEGRATION_GUIDE.md)
- **Test Results**: Run `node test_ml_integration.js` for details
- **API Docs**: All endpoints documented in server.js comments
- **Model Info**: See `ml_model/train_model.py` for model details

---

**Last Updated:** March 8, 2026  
**Version:** 2.0.0  
**Status:** ✓ Production Ready
