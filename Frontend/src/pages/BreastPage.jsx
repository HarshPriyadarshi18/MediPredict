import React, { useState } from "react";
import axios from "axios";

const BreastPage = () => {
  const [formData, setFormData] = useState({
    radius_mean: "",
    texture_mean: "",
    perimeter_mean: "",
    area_mean: "",
    smoothness_mean: "",
    compactness_mean: "",
    concavity_mean: "",
    concave_points_mean: "",
    symmetry_mean: "",
    fractal_dimension_mean: ""
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      radius_mean: "",
      texture_mean: "",
      perimeter_mean: "",
      area_mean: "",
      smoothness_mean: "",
      compactness_mean: "",
      concavity_mean: "",
      concave_points_mean: "",
      symmetry_mean: "",
      fractal_dimension_mean: ""
    });
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    try {
      setError("");
      const res = await axios.post("http://127.0.0.1:5000/predict/breast", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Server Error: Please check input values or backend logs.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">🩺 Breast Cancer Prediction</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-[400px]">
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              {key.replaceAll("_", " ")}
            </label>
            <input
              type="number"
              step="any"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            onClick={handlePredict}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Predict
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Reset
          </button>
        </div>

        {result && (
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-green-700">
              {result.finalStatus}
            </p>
            <p className="text-gray-600">Average Risk: {result.averageRisk}%</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-center text-red-500 font-semibold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreastPage;
