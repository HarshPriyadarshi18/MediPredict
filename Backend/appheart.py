from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import numpy as np
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Initialize Flask
app = Flask(__name__)
# Configure CORS explicitly to allow frontend origin and preflight requests
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Basic logging for incoming requests and errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Ensure every response includes the necessary CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

# ===========================
# 📊 Load Dataset
# ===========================
dataset_path = os.path.join(os.path.dirname(__file__), "framingham.csv")

if not os.path.exists(dataset_path):
    raise FileNotFoundError("❌ framingham.csv not found in Backend folder!")

dataset = pd.read_csv(dataset_path)

# Drop missing values
dataset = dataset.dropna()

# Independent & dependent features
X = dataset.drop("TenYearCHD", axis=1)
y = dataset["TenYearCHD"]

# ===========================
# ⚙️ Data Scaling
# ===========================
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ===========================
# 🔀 Train-Test Split
# ===========================
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# ===========================
# 🧠 Train Models
# ===========================
logreg = LogisticRegression(max_iter=300)
knn = KNeighborsClassifier(n_neighbors=23)
svc = SVC(probability=True)
nb = GaussianNB()
dectree = DecisionTreeClassifier(random_state=42)
ranfor = RandomForestClassifier(random_state=42)

models = [
    ("Logistic Regression", logreg),
    ("KNN", knn),
    ("SVC", svc),
    ("Naive Bayes", nb),
    ("Decision Tree", dectree),
    ("Random Forest", ranfor),
]

for _, model in models:
    model.fit(X_train, y_train)

# ===========================
# ❤️ Helper Function
# ===========================
def classify_risk(avg_risk):
    if avg_risk < 20:
        return "🟢 Healthy"
    elif avg_risk < 40:
        return "🟡 Mild Risk"
    elif avg_risk < 70:
        return "🟠 Unhealthy"
    else:
        return "🔴 High Heart Disease Risk"

# ===========================
# 🚀 API Routes
# ===========================
@app.route("/")
def home():
    return jsonify({"message": "Heart Disease Predictor API is running ✅"})

@app.route("/predict_heart", methods=["POST", "OPTIONS"])
def predict_heart():
    # Handle preflight OPTIONS requests explicitly
    if request.method == "OPTIONS":
        return jsonify({}), 200

    # parse JSON body; if missing/invalid, fall back to empty dict so we can impute
    data = request.get_json(force=True, silent=True)
    if not isinstance(data, dict):
        data = {}
    logger.info("/predict_heart called with data: %s", data)
    try:
        # Expected feature order (must match training data)
        feature_keys = [
            "male",
            "age",
            "education",
            "currentSmoker",
            "cigsPerDay",
            "BPMeds",
            "prevalentStroke",
            "prevalentHyp",
            "diabetes",
            "totChol",
            "sysBP",
            "diaBP",
            "BMI",
            "heartRate",
            "glucose",
        ]
        
        # Compute column means to use as simple imputation for missing/NA inputs
        column_means = X.mean().to_dict()

        values = []
        for key in feature_keys:
            raw = data.get(key, None)
            if raw is None or (isinstance(raw, str) and raw.strip().lower() in ["", "na", "nan", "null"]):
                # use mean from dataset if user didn't supply value
                imputed = column_means.get(key)
                values.append(float(imputed))
            else:
                try:
                    values.append(float(raw))
                except Exception:
                    # fallback to mean if conversion fails
                    values.append(float(column_means.get(key)))

        input_values = np.array(values, dtype=float).reshape(1, -1)
        scaled_input = scaler.transform(input_values)

        # Get probabilities from each model; if predict_proba not available, use predict()
        risks = {}
        for name, model in models:
            try:
                if hasattr(model, "predict_proba"):
                    prob = model.predict_proba(scaled_input)[0][1] * 100
                else:
                    # binary predict fallback (0/1) -> convert to 0% or 100%
                    pred = model.predict(scaled_input)[0]
                    prob = float(pred) * 100.0
            except Exception as m_err:
                # if a model errors, record as 0 and continue
                logger.exception("Model %s raised an error during prediction", name)
                prob = 0.0
            risks[name] = round(float(prob), 2)

        avg_risk = float(np.mean(list(risks.values())))
        final_status = classify_risk(avg_risk)

        return jsonify({
            "risks": risks,
            "averageRisk": round(avg_risk, 2),
            "finalStatus": final_status
        })

    except Exception as e:
        logger.exception("Error in /predict_heart")
        return jsonify({"error": str(e)}), 400

# ===========================
# ▶️ Run Server
# ===========================
if __name__ == "__main__":
    # Bind to all interfaces so localhost requests succeed and to make debugging easier
    app.run(host="0.0.0.0", port=5000, debug=True)


