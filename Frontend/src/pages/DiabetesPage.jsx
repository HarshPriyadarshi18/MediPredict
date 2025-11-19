import React, { useState } from "react";
import { FaStethoscope } from "react-icons/fa";
import "../App.css";

const DiabetesPage = () => {
  const initialFormData = {
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    dpf: "",
    age: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict_diabetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to fetch prediction");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
    setError(null);
  };
  const prettyLabel = (key) => {
    const map = {
      pregnancies: "Pregnancies",
      glucose: "Glucose",
      bloodPressure: "Blood Pressure",
      skinThickness: "Skin Thickness",
      insulin: "Insulin",
      bmi: "BMI",
      dpf: "Diabetes Pedigree Func.",
      age: "Age",
    };
    return map[key] || key;
  };

  return (
    <div className="diabetes-page-container">
      <div className="diabetes-card">
        <div className="diabetes-card-header">
          <FaStethoscope className="diabetes-icon" />
          <div>
            <h1 className="diabetes-page-header">Diabetes Risk Prediction</h1>
            <p className="small-note">Enter health parameters to estimate diabetes risk.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="diabetes-page-form">
          <div className="diabetes-page-input-container diabetes-form-grid">
            {Object.keys(formData).map((key) => (
              <div key={key} className="diabetes-input-wrap">
                <label htmlFor={key} className="diabetes-label">
                  {prettyLabel(key)}
                </label>
                <input
                  id={key}
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${prettyLabel(key)}`}
                  className="diabetes-page-input"
                  required
                />
              </div>
            ))}
          </div>

          <div className="diabetes-page-actions">
            <button type="submit" className="diabetes-page-button">
              {loading ? "Predicting..." : "🔍 Predict"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="diabetes-page-button diabetes-page-reset"
            >
              ♻️ Reset
            </button>
          </div>
        </form>

        {error && <div className="error-message">Error: {error}</div>}

        {result && (
          <div className="diabetes-page-result-container">
            <h2 className="result-header">Prediction Results</h2>

            <div className="risk-list" aria-live="polite">
              {Object.entries(result.risks).map(([model, prob]) => (
                <div className="risk-item" key={model}>
                  <div className="risk-row">
                    <div className="risk-name">{model}</div>
                    <div className="risk-value">{prob}%</div>
                  </div>
                  <div className="risk-bar" aria-hidden>
                    <div
                      className={`risk-fill`}
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="result-summary">
              <p>
                <strong>Average Risk:</strong> {result.averageRisk}%
              </p>
              <p>
                <strong>Final Status:</strong> {result.finalStatus}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiabetesPage;