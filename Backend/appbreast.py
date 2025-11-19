from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os
import numpy as np

app = Flask(__name__)
CORS(app)

# ===============================
# Load Model and Dataset
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "data_clean_id.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "breast_model.pkl")

# Check if data file exists
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"❌ data_clean_id.csv not found in Backend/data folder!\nExpected path: {DATA_PATH}")

# Load dataset
data = pd.read_csv(DATA_PATH)

# Dummy model loader (replace with your trained model)
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
else:
    model = None
    print("⚠️ No trained model found. Using random predictions for demo.")

# ===============================
# Helper Function
# ===============================
def classify_risk(prob):
    if prob < 0.3:
        return "Low Risk"
    elif prob < 0.7:
        return "Medium Risk"
    else:
        return "High Risk"

# ===============================
# Predict Breast Cancer Endpoint
# ===============================
@app.route("/predict/breast", methods=["POST"])
def predict_breast():
    try:
        data_input = request.get_json()
        print("Received Data:", data_input)

        # Expected keys
        expected_fields = [
            "radius_mean", "texture_mean", "perimeter_mean",
            "area_mean", "smoothness_mean", "compactness_mean",
            "concavity_mean", "concave_points_mean", "symmetry_mean",
            "fractal_dimension_mean"
        ]

        # Check all fields present
        for field in expected_fields:
            if field not in data_input:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Convert to DataFrame
        features = np.array([[float(data_input[field]) for field in expected_fields]])

        # Predict
        if model:
            pred_prob = model.predict_proba(features)[0][1]  # Probability of cancer
        else:
            pred_prob = np.random.random()  # demo mode

        avg_risk = round(pred_prob * 100, 2)
        risk_level = classify_risk(pred_prob)

        result = {
            "averageRisk": avg_risk,
            "finalStatus": f"{risk_level} ({avg_risk}%)"
        }
        return jsonify(result), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400


# ===============================
# Run Flask App
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
