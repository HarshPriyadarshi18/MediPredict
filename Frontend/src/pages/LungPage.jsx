import React, { useState, useMemo } from "react";

const booleanFields = [
  "smoking",
  "yellowFingers",
  "anxiety",
  "peerPressure",
  "chronicDisease",
  "fatigue",
  "allergy",
  "wheezing",
  "alcohol",
  "coughing",
  "shortnessOfBreath",
  "swallowingDifficulty",
  "chestPain",
];

const LungPage = () => {
  const [data, setData] = useState({
    age: "",
    gender: "",
    smoking: "0",
    yellowFingers: "0",
    anxiety: "0",
    peerPressure: "0",
    chronicDisease: "0",
    fatigue: "0",
    allergy: "0",
    wheezing: "0",
    alcohol: "0",
    coughing: "0",
    shortnessOfBreath: "0",
    swallowingDifficulty: "0",
    chestPain: "0",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const riskScore = useMemo(() => {
    const ageScore = Number(data.age || 0) * 0.15;
    const genderScore = data.gender === "male" ? 0.5 : 0;
    const booleanScore = booleanFields.reduce((acc, key) => acc + Number(data[key] || 0), 0);
    return +(ageScore + genderScore + booleanScore).toFixed(2);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const level = riskScore >= 12 ? "high" : riskScore >= 6 ? "moderate" : "low";
      const emoji = level === "high" ? "🚬" : level === "moderate" ? "⚠️" : "✅";
      setResult({ level, emoji, score: riskScore });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white via-orange-50 to-white rounded-3xl shadow-2xl p-6 md:p-10 transform transition-all duration-500 hover:scale-[1.003]">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-orange-700 flex items-center gap-3"> 
                <span className="text-3xl">🫁</span>
                <span> Lung Cancer Risk Predictor</span>
              </h1>
              <p className="text-gray-500 mt-1 max-w-xl">A quick, client-side estimate — use it as a guide, not a diagnosis.</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Current score</div>
                <div className="text-lg font-semibold">{riskScore}</div>
              </div>
              <div className="w-20 h-10 bg-gradient-to-r from-orange-200 to-orange-400 rounded-xl flex items-center justify-center text-sm font-semibold text-white shadow">Live</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border">
                    <label className="text-sm text-gray-600 font-medium">Age</label>
                    <div className="mt-2">
                      <input
                        type="range"
                        name="age"
                        min="0"
                        max="100"
                        value={data.age || 30}
                        onChange={handleChange}
                        className="w-full"
                      />
                      <div className="mt-2 text-sm text-gray-700">{data.age || 30} years</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border">
                    <label className="text-sm text-gray-600 font-medium">Gender</label>
                    <select
                      name="gender"
                      value={data.gender}
                      onChange={handleChange}
                      className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-300 outline-none transition"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Habits & Lifestyle</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['smoking','alcohol','yellowFingers','peerPressure'].map((k)=> (
                        <div key={k} className="flex flex-col">
                          <label className="text-sm text-gray-600 capitalize">{k.replace(/([A-Z])/g, ' $1')}</label>
                          <select name={k} value={data[k]} onChange={handleChange} className="mt-2 border border-gray-200 rounded-xl px-3 py-2">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Symptoms</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['wheezing','coughing','chestPain','shortnessOfBreath','fatigue','swallowingDifficulty'].map((k)=> (
                        <div key={k} className="flex flex-col">
                          <label className="text-sm text-gray-600 capitalize">{k.replace(/([A-Z])/g, ' $1')}</label>
                          <select name={k} value={data[k]} onChange={handleChange} className="mt-2 border border-gray-200 rounded-xl px-3 py-2">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border">
                    <label className="text-sm text-gray-600">Other Conditions</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['chronicDisease','allergy','anxiety'].map((k)=> (
                        <select key={k} name={k} value={data[k]} onChange={handleChange} className="border border-gray-200 rounded-xl px-3 py-2">
                          <option value="0">No {k === 'chronicDisease' ? '' : ''}</option>
                          <option value="1">Yes</option>
                        </select>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="text-sm text-gray-600">Peer Pressure</label>
                      <select name="peerPressure" value={data.peerPressure} onChange={handleChange} className="mt-2 border border-gray-200 rounded-xl px-3 py-2">
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5">
                        {loading ? '⏳ Analyzing...' : '🔍 Predict Risk'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Summary and Result */}
            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Estimated risk</div>
                    <div className="text-2xl font-bold text-gray-800">{result ? result.score : riskScore}</div>
                  </div>
                  <div className="text-3xl">{result ? result.emoji : '🔎'}</div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-700 ${result ? (result.level === 'high' ? 'bg-gradient-to-r from-red-400 to-red-600' : result.level === 'moderate' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' : 'bg-gradient-to-r from-green-400 to-green-600') : 'bg-gradient-to-r from-orange-300 to-orange-400'}`}
                      style={{ width: `${Math.min(100, (riskScore / 15) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 text-right">{Math.round(Math.min(100, (riskScore / 15) * 100))}%</div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl ${result ? (result.level === 'high' ? 'bg-red-50 border-red-100' : result.level === 'moderate' ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100') : 'bg-white border'} shadow-md border` }>
                <div className={`transform transition-all duration-400 ${result ? 'scale-100' : 'scale-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{result ? result.emoji : 'ℹ️'}</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{result ? `${result.level.toUpperCase()} RISK` : 'No result yet'}</div>
                      <div className="text-xs text-gray-600">{result ? `Score: ${result.score}` : 'Provide details and press Predict'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">Tip: this is a simple heuristic — contact a professional for medical advice.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LungPage;
