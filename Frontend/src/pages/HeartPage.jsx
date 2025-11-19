import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const HeartPage = () => {
  const [formData, setFormData] = useState({
    male: "",
    age: "",
    education: "",
    currentSmoker: "",
    cigsPerDay: "",
    BPMeds: "",
    prevalentStroke: "",
    prevalentHyp: "",
    diabetes: "",
    totChol: "",
    sysBP: "",
    diaBP: "",
    BMI: "",
    heartRate: "",
    glucose: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);


    try {
      const response = await axios.post("http://localhost:5000/predict_heart", formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({ error: "Prediction failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  const prettyLabel = (key) => {
    const map = {
      male: "Male (1 = yes, 0 = no)",
      age: "Age",
      education: "Education",
      currentSmoker: "Current Smoker (1/0)",
      cigsPerDay: "Cigs Per Day",
      BPMeds: "On BP Meds (1/0)",
      prevalentStroke: "Prev. Stroke (1/0)",
      prevalentHyp: "Prev. Hypertension (1/0)",
      diabetes: "Diabetes (1/0)",
      totChol: "Total Cholesterol",
      sysBP: "Systolic BP",
      diaBP: "Diastolic BP",
      BMI: "BMI",
      heartRate: "Heart Rate",
      glucose: "Glucose",
    };
    return map[key] || key;
  };

  const statusClass = (status) => {
    if (!status) return "heart-status-high";
    if (status.includes("Healthy")) return "heart-status-healthy";
    if (status.includes("Mild")) return "heart-status-mild";
    if (status.includes("Unhealthy")) return "heart-status-unhealthy";
    return "heart-status-high";
  };

  return (
    <div className="heart-page-container">
      <div className="heart-card">
        <header className="heart-card-header">
          <h1 className="heart-page-header">❤️ Heart Disease Risk Predictor</h1>
          <p className="small-note">Provide the values below and click Predict.</p>
        </header>

        <form onSubmit={handleSubmit} className="heart-page-form">
          <div className="heart-page-input-container heart-form-grid">
            {Object.keys(formData).map((key) => (
              <div key={key} className="heart-input-wrap">
                <label htmlFor={key} className="heart-label">
                  {prettyLabel(key)}
                </label>
                <input
                  id={key}
                  type="number"
                  step="any"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className="heart-page-input"
                />
              </div>
            ))}
          </div>

          <div className="heart-page-actions">
            <button
              type="submit"
              disabled={loading}
              className="heart-page-button"
            >
              {loading ? "Predicting..." : "Predict Heart Risk"}
            </button>
          </div>
        </form>

        {result && (
          <div className="heart-page-result-container">
            {result.error ? (
              <p className="text-red-600 font-semibold">{result.error}</p>
            ) : (
              <>
                <h2 className="result-header">🧠 Model Risk Predictions</h2>
                <div className="risk-list">
                  {Object.entries(result.risks).map(([model, value]) => (
                    <div className="risk-item" key={model}>
                      <div className="risk-row">
                        <div className="risk-name">{model}</div>
                        <div className="risk-value">{value}%</div>
                      </div>
                      <div className="risk-bar">
                        <div className="risk-fill heart-fill" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="result-summary">
                  <p>
                    <strong>Average Risk:</strong> <span className="text-red-600">{result.averageRisk}%</span>
                  </p>
                  <p>
                    <strong>Final Status:</strong>{" "}
                    <span className={statusClass(result.finalStatus)}>{result.finalStatus}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartPage;
