import joblib
import sys
import os
import numpy as np
import warnings

def feature_create(*args):
    features=np.array([args],dtype=float)
    return features

if __name__ == "__main__":
    if len(sys.argv) != 14:
        print("Error: Incorrect number of arguments")
        sys.exit(1)
    

warnings.filterwarnings("ignore",category=UserWarning)
warnings.filterwarnings("ignore",category=FutureWarning)
warnings.filterwarnings("ignore",category=DeprecationWarning)

script_dir=os.path.dirname(__file__)
model_path=os.path.join(script_dir,'heart_disease.pkl')

try:
    model=joblib.load(model_path)
except Exception as e:
    print(f"Error loading model:", {e})
    sys.exit(1)

try:
    features = feature_create(
        sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5],
        sys.argv[6], sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10],
        sys.argv[11], sys.argv[12], sys.argv[13]
    )
except Exception as e:
    print(f"Error creating features: {e}")
    sys.exit(1)

try:
        prob = model.predict(features)
        print(int(prob[0])) 
except Exception as e:
        print(f"Error in prediction: {e}", file=sys.stderr)
        sys.exit(1)

