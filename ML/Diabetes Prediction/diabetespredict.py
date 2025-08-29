import sys
import pickle
import numpy as np
import os
import warnings

from sklearn.exceptions import ConvergenceWarning

warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')
warnings.filterwarnings("ignore", category=FutureWarning, module='sklearn')
warnings.filterwarnings("ignore", category=DeprecationWarning, module='sklearn')

script_dir = os.path.dirname(os.path.realpath(__file__))

model_file = os.path.join(script_dir, 'diabetes_model (1).pkl')
scaler_file = os.path.join(script_dir, 'scaler.pkl')

with open(model_file, 'rb') as file:
    classifier = pickle.load(file)

with open(scaler_file, 'rb') as file:
    scaler = pickle.load(file)

input_data = list(map(float, sys.argv[1:]))
input_data_as_numpy_array = np.asarray(input_data)
input_data_reshaped = input_data_as_numpy_array.reshape(1, -1)
std_data = scaler.transform(input_data_reshaped)

#print("Scaled input:", std_data)
prediction = classifier.predict(std_data)
#print("Prediction:", "Diabetic" if prediction[0] == 1 else "Not Diabetic")

print(prediction[0])

