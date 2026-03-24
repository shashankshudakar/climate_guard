"""
ClimateGuard — Rainfall Prediction Model
==========================================
Train a RandomForest classifier to predict rainfall levels
(Low, Medium, Heavy) based on temperature, humidity, and month.

Usage:
    python train_model.py
"""

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder


# ─── Config ──────────────────────────────────────────────────────────────────
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'rainfall_dataset.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'rainfall_model.pkl')
ENCODER_PATH = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')


def classify_rainfall(rainfall_mm):
    """Classify rainfall amount into Low / Medium / Heavy."""
    if rainfall_mm < 30:
        return 'Low'
    elif rainfall_mm < 100:
        return 'Medium'
    else:
        return 'Heavy'


def load_and_preprocess():
    """Load dataset and create features + target."""
    print("\n📂 Loading dataset...")
    df = pd.read_csv(DATASET_PATH)
    print(f"   Loaded {len(df)} records from {os.path.basename(DATASET_PATH)}")
    print(f"   Columns: {list(df.columns)}")

    # Create rainfall level classification from rainfall_mm
    df['rainfall_level'] = df['rainfall_mm'].apply(classify_rainfall)

    # Show class distribution
    print("\n📊 Rainfall Level Distribution:")
    for level, count in df['rainfall_level'].value_counts().items():
        print(f"   {level:8s}: {count:4d} records ({count/len(df)*100:.1f}%)")

    # Features and Target
    features = ['temperature', 'humidity', 'month']
    X = df[features].values
    y = df['rainfall_level'].values

    print(f"\n🔢 Features: {features}")
    print(f"   Shape: {X.shape}")

    return X, y, df


def train_model(X, y):
    """Train RandomForest classifier."""
    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    print(f"\n🏷️  Label Encoding: {dict(zip(le.classes_, le.transform(le.classes_)))}")

    # Train-test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"\n📐 Train/Test Split:")
    print(f"   Training samples: {len(X_train)}")
    print(f"   Testing samples:  {len(X_test)}")

    # Train RandomForest
    print("\n🌲 Training RandomForestClassifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    print("   ✅ Training complete!")

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n📈 Model Evaluation:")
    print(f"   Accuracy: {accuracy * 100:.2f}%")
    print(f"\n   Classification Report:")
    report = classification_report(y_test, y_pred, target_names=le.classes_, zero_division=0)
    for line in report.split('\n'):
        print(f"   {line}")

    print(f"\n   Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(f"   {le.classes_}")
    for i, row in enumerate(cm):
        print(f"   {le.classes_[i]:8s}: {row}")

    # Feature importance
    importances = model.feature_importances_
    feature_names = ['temperature', 'humidity', 'month']
    print(f"\n🎯 Feature Importance:")
    for name, imp in sorted(zip(feature_names, importances), key=lambda x: -x[1]):
        bar = '█' * int(imp * 40)
        print(f"   {name:12s}: {imp:.4f} {bar}")

    return model, le, accuracy


def save_model(model, le):
    """Save trained model and label encoder to disk."""
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    print(f"\n💾 Model saved to: {MODEL_PATH}")

    with open(ENCODER_PATH, 'wb') as f:
        pickle.dump(le, f)
    print(f"💾 Encoder saved to: {ENCODER_PATH}")


def predict_rainfall(temperature, humidity, month):
    """
    Predict rainfall level given weather parameters.

    Args:
        temperature (float): Temperature in °C (e.g., 28.5)
        humidity (float): Humidity percentage (e.g., 75)
        month (int): Month number 1-12

    Returns:
        str: Predicted rainfall level ('Low', 'Medium', or 'Heavy')
    """
    # Load model and encoder
    if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
        raise FileNotFoundError(
            "Model not found! Run 'python train_model.py' first to train the model."
        )

    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        le = pickle.load(f)

    # Predict
    features = np.array([[temperature, humidity, month]])
    prediction = model.predict(features)
    probabilities = model.predict_proba(features)[0]

    rainfall_level = le.inverse_transform(prediction)[0]
    confidence = max(probabilities) * 100

    return rainfall_level, confidence, dict(zip(le.classes_, [f"{p*100:.1f}%" for p in probabilities]))


# ═════════════════════════════════════════════════════════════════════════════
#  MAIN
# ═════════════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    print("=" * 55)
    print("  🌧️  ClimateGuard — Rainfall Prediction Model")
    print("=" * 55)

    # Step 1: Load & Preprocess
    X, y, df = load_and_preprocess()

    # Step 2-4: Train & Evaluate
    model, le, accuracy = train_model(X, y)

    # Step 5: Save model
    save_model(model, le)

    # Demo predictions
    print("\n" + "=" * 55)
    print("  🔮 Sample Predictions")
    print("=" * 55)

    test_cases = [
        (28.5, 85, 7),   # Monsoon July — likely Heavy
        (32.0, 55, 1),   # Hot dry January — likely Low
        (30.0, 70, 5),   # Pre-monsoon May — likely Medium
        (25.0, 92, 8),   # Peak monsoon August — likely Heavy
        (35.0, 40, 3),   # Hot March — likely Low
        (27.0, 78, 9),   # September — likely Medium/Heavy
    ]

    for temp, hum, month in test_cases:
        level, conf, probs = predict_rainfall(temp, hum, month)
        month_name = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'][month-1]
        print(f"\n   Temp={temp}°C, Humidity={hum}%, Month={month_name}")
        print(f"   → Prediction: {level} (Confidence: {conf:.1f}%)")
        print(f"     Probabilities: {probs}")

    print(f"\n✅ Model training complete! Accuracy: {accuracy*100:.2f}%")
    print(f"   Model file: {MODEL_PATH}")
    print()
