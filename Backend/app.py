from flask import Flask, request, jsonify
from flask_cors import CORS
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
CORS(app)  # allow React frontend to connect

# Load dataset (Backend folder)
dataset_path = os.path.join(os.path.dirname(__file__), "diabetes.csv")
dataset = pd.read_csv(dataset_path)
X = dataset.drop("Outcome", axis=1)
y = dataset["Outcome"]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# Train models
logreg = LogisticRegression(max_iter=200)
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

# Helper: classify average risk
def classify_risk(avg_risk):
    if avg_risk < 30:
        return "🟢 Healthy"
    elif avg_risk < 50:
        return "🟡 Mild Risk"
    elif avg_risk < 70:
        return "🟠 Unhealthy"
    else:
        return "🔴 Diabetic"

# API endpoint
@app.route("/predict_diabetes", methods=["POST"])
def predict_diabetes():
    data = request.json
    try:
        input_values = np.array([
            data["pregnancies"],
            data["glucose"],
            data["bloodPressure"],
            data["skinThickness"],
            data["insulin"],
            data["bmi"],
            data["dpf"],
            data["age"],
        ], dtype=float).reshape(1, -1)

        scaled_input = scaler.transform(input_values)

        risks = {}
        for name, model in models:
            prob = model.predict_proba(scaled_input)[0][1] * 100
            risks[name] = round(prob, 2)

        avg_risk = np.mean(list(risks.values()))
        final_status = classify_risk(avg_risk)

        return jsonify({
            "risks": risks,
            "averageRisk": round(avg_risk, 2),
            "finalStatus": final_status
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run server
if __name__ == "__main__":
    app.run(debug=True)
