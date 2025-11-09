import React, { useState } from "react";

const LungPage = () => {
  const [data, setData] = useState({
    age: "",
    gender: "",
    smoking: "",
    yellowFingers: "",
    anxiety: "",
    peerPressure: "",
    chronicDisease: "",
    fatigue: "",
    allergy: "",
    wheezing: "",
    alcohol: "",
    coughing: "",
    shortnessOfBreath: "",
    swallowingDifficulty: "",
    chestPain: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 💡 Simple fake ML logic (no backend)
    setTimeout(() => {
      const riskScore =
        Number(data.age) * 0.2 +
        Number(data.smoking) * 1.5 +
        Number(data.chronicDisease) * 1.2 +
        Number(data.wheezing) * 1.3 +
        Number(data.chestPain) * 1.4 +
        Number(data.coughing) * 1.1;

      const result =
        riskScore > 10
          ? "🚬 High Risk of Lung Cancer"
          : "✅ Low Risk of Lung Cancer";

      setResult(result);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-100 flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl px-10 py-12 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-orange-700 mb-3 tracking-tight">
            🫁 Lung Cancer Risk Predictor
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Fill out your health information below to estimate your lung cancer
            risk using predictive indicators.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6"
        >
          {Object.keys(data).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2 capitalize tracking-wide">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="number"
                name={key}
                value={data[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
                required
              />
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg tracking-wide"
            >
              {loading ? "⏳ Analyzing..." : "🔍 Predict Lung Cancer Risk"}
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div
            className={`mt-10 text-center p-6 rounded-2xl font-semibold text-xl border transition-all duration-300 ${
              result.includes("High")
                ? "bg-red-50 border-red-300 text-red-700"
                : "bg-green-50 border-green-300 text-green-700"
            }`}
          >
            <h2 className="text-2xl font-bold mb-2">Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LungPage;
