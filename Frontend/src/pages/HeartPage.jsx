import React, { useState } from 'react'

const HeartPage = () => {
  const [data, setData] = useState({
    male: '',
    age: '',
    education: '',
    currentSmoker: '',
    cigsPerDay: '',
    BPMeds: '',
    prevalentStroke: '',
    prevalentHyp: '',
    diabetes: '',
    totChol: '',
    sysBP: '',
    diaBP: '',
    BMI: '',
    heartRate: '',
    glucose: '',
  })

  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const res = await response.json()
    setResult(res.prediction)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-red-600">❤️ Heart Disease Predictor</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-96 space-y-3">
        {Object.keys(data).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 font-medium capitalize">{key}</label>
            <input
              type="number"
              name={key}
              value={data[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className="border p-2 w-full rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full mt-3 font-semibold"
        >
          Predict
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">
            Result:{' '}
            <span className={result === 'No Heart Disease' ? 'text-green-600' : 'text-red-600'}>
              {result}
            </span>
          </h2>
        </div>
      )}
    </div>
  )
}

export default HeartPage
