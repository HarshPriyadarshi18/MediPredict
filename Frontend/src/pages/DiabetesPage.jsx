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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add your prediction API call here
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
            🔍 Predict Diabetes Risk
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiabetesPage;
