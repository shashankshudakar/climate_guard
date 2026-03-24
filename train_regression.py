"""
ClimateGuard — Rainfall Regression Model
========================================
Train a RandomForest regressor to predict rainfall_mm directly
based on temperature, humidity, and month.
"""

import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'rainfall_dataset.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'rainfall_model_reg.pkl')


def load_and_preprocess():
    df = pd.read_csv(DATASET_PATH)
    features = ['temperature', 'humidity', 'month']
    X = df[features].values
    y = df['rainfall_mm'].values
    return X, y


def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"MAE: {mae:.2f} mm")
    print(f"R2: {r2:.3f}")
    return model


def save_model(model):
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to: {MODEL_PATH}")


if __name__ == '__main__':
    X, y = load_and_preprocess()
    model = train_model(X, y)
    save_model(model)
