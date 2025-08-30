import pickle

with open("heart_disease.pkl", "rb") as file:
    model = pickle.load(file)

# Example input
prediction = model.predict([[58,0,0,100,248,0,0,122,0,1,1,0,2]])

print("Raw prediction:", prediction[0])   

if prediction[0] == 0:
    print("✅ The person is NOT suffering from Heart Disease")
else:
    print("⚠️ The person IS suffering from Heart Disease")
