import React, { useState } from "react";
import axios from "axios";

const DiabetesPage = () => {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigree: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/predict/diabetes", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error while predicting diabetes risk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🩸 Diabetes Prediction</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg grid grid-cols-2 gap-4"
      >
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-semibold capitalize mb-1">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="number"
              step="any"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Predicting..." : "Predict Diabetes Risk"}
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Prediction Results</h2>

          {result.model_predictions &&
            Object.entries(result.model_predictions).map(([model, prob]) => (
              <p key={model} className="text-gray-700">
                <strong>{model}</strong>: {(prob * 100).toFixed(2)}% diabetic risk
              </p>
            ))}

          <div className="mt-4 p-3 rounded-lg bg-gray-50 border-t-2 border-blue-500">
            <p className="text-lg font-semibold">
              {result.finalDiagnosis === "High Risk"
                ? "🩸 High Diabetes Risk"
                : result.finalDiagnosis === "Moderate Risk"
                ? "⚠️ Moderate Diabetes Risk"
                : "✅ Low Diabetes Risk"}
            </p>
            <p className="text-sm text-gray-600">
              Average Risk: {(result.averageRisk * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiabetesPage;
