#!/usr/bin/env python3
"""
ClimateGuard ML Model Setup & Validation
Installs dependencies and trains the model if needed.
"""

import os
import sys
import subprocess
import json

def install_dependencies():
    """Install required Python packages."""
    print("\n" + "="*60)
    print("  📦 Installing ML Dependencies")
    print("="*60)
    
    requirements_file = os.path.join(os.path.dirname(__file__), 'requirements.txt')
    
    if not os.path.exists(requirements_file):
        print("✗ requirements.txt not found!")
        sys.exit(1)
    
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', '-r', requirements_file])
        print("✓ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install dependencies: {e}")
        return False

def train_model():
    """Train the rainfall prediction model."""
    print("\n" + "="*60)
    print("  🌲 Training ML Model")
    print("="*60)
    
    train_script = os.path.join(os.path.dirname(__file__), 'train_model.py')
    
    if not os.path.exists(train_script):
        print("✗ train_model.py not found!")
        return False
    
    try:
        result = subprocess.run([sys.executable, train_script], 
                              capture_output=False, text=True)
        return result.returncode == 0
    except Exception as e:
        print(f"✗ Failed to train model: {e}")
        return False

def test_prediction():
    """Test the prediction script."""
    print("\n" + "="*60)
    print("  🧪 Testing Prediction Script")
    print("="*60)
    
    predict_script = os.path.join(os.path.dirname(__file__), 'predict.py')
    
    if not os.path.exists(predict_script):
        print("✗ predict.py not found!")
        return False
    
    test_cases = [
        (28.5, 85, 7, "Monsoon July"),
        (32.0, 55, 1, "Dry January"),
        (30.0, 70, 5, "Summer May"),
    ]
    
    all_passed = True
    for temp, humidity, month, description in test_cases:
        try:
            result = subprocess.run(
                [sys.executable, predict_script, str(temp), str(humidity), str(month)],
                capture_output=True, text=True, timeout=10
            )
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                print(f"  ✓ {description} (Temp: {temp}°C, Humidity: {humidity}%)")
                print(f"    Level: {data.get('level', 'N/A')}, Confidence: {data.get('confidence', 'N/A')}%")
            else:
                print(f"  ✗ {description} failed")
                print(f"    Error: {result.stderr}")
                all_passed = False
        except Exception as e:
            print(f"  ✗ {description} - Exception: {e}")
            all_passed = False
    
    return all_passed

def main():
    print("\n" + "="*60)
    print("  🌿 ClimateGuard ML Setup & Validation")
    print("="*60)
    
    # Check if model files exist
    model_path = os.path.join(os.path.dirname(__file__), 'rainfall_model.pkl')
    encoder_path = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')
    
    model_exists = os.path.exists(model_path) and os.path.exists(encoder_path)
    
    if model_exists:
        print("\n✓ Model files found")
    else:
        print("\n⚠ Model files not found - will need to train")
    
    # Step 1: Install dependencies
    if not install_dependencies():
        print("\n✗ Setup failed at dependency installation")
        sys.exit(1)
    
    # Step 2: Train model if needed
    if not model_exists:
        if not train_model():
            print("\n✗ Setup failed at model training")
            sys.exit(1)
    else:
        print("\n✓ Using existing model")
    
    # Step 3: Test predictions
    if not test_prediction():
        print("\n⚠ Some prediction tests failed")
    
    print("\n" + "="*60)
    print("  ✓ ML Setup Complete!")
    print("="*60)
    print("\nNext steps:")
    print("  1. Start the backend: npm start")
    print("  2. Test the API: node test_ml_integration.js")
    print("\n")

if __name__ == '__main__':
    main()
