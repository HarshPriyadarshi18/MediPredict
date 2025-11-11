import React, { useState } from "react";
import { FaStethoscope } from "react-icons/fa";
import "../App.css";

const DiabetesPage = () => {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    dpf: "",
    age: "",
  });

  const [result, setResult] = useState(null); // store API response
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
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
        <div className="flex items-center mb-6">
          <FaStethoscope className="text-3xl text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Diabetes Risk Prediction
          </h1>
        </div>
        <p className="text-gray-600 mb-8">
          Enter your health parameters below to estimate your risk of diabetes.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1 capitalize">
                {key}
              </label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="col-span-1 sm:col-span-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all mt-4"
          >
            {loading ? "Predicting..." : "🔍 Predict Diabetes Risk"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 font-medium">Error: {error}</p>}

        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Prediction Results:</h2>
            <ul className="mb-2">
              {Object.entries(result.risks).map(([model, prob]) => (
                <li key={model}>
                  <strong>{model}:</strong> {prob}%
                </li>
              ))}
            </ul>
            <p className="font-medium">
              <strong>Average Risk:</strong> {result.averageRisk}%
            </p>
            <p className="font-medium">
              <strong>Final Status:</strong> {result.finalStatus}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiabetesPage;
