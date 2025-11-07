import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, classification_report

# Load the dataset
df = pd.read_csv('framingham.csv')

# Display first few rows
print(df.head())

# Display shape
print(df.shape)

# Display columns
print(df.keys())

# Display info
print(df.info())

# Display describe
print(df.describe())

# Check for missing values
print(df.isna().sum())

# Drop missing values
df.dropna(axis=0, inplace=True)

print(df.shape)

# Value counts for target
print(df['TenYearCHD'].value_counts())

# Correlation heatmap
plt.figure(figsize=(14, 10))
sns.heatmap(df.corr(), cmap='Purples', annot=True, linecolor='Green', linewidths=1.0)
# plt.show()

# Pairplot
sns.pairplot(df)
# plt.show()

# Catplot for male and currentSmoker
sns.catplot(data=df, kind='count', x='male', hue='currentSmoker')
# plt.show()

# Catplot for TenYearCHD with facets
sns.catplot(data=df, kind='count', x='TenYearCHD', col='male', row='currentSmoker', palette='Blues')
# plt.show()

# Prepare features and target
X = df.iloc[:, 0:15]
y = df.iloc[:, 15:16]

print(X.head())
print(y.head())

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=21)

# Scale the data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Logistic Regression model
logreg = LogisticRegression(max_iter=1000, solver='liblinear')
logreg.fit(X_train_scaled, y_train)

# Predictions
y_pred = logreg.predict(X_test_scaled)
score = logreg.score(X_test_scaled, y_test)
print("Prediction score is:", score)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix is:\n", cm)

# Classification Report
print("Classification Report is:\n\n", classification_report(y_test, y_pred))

# Confusion Matrix heatmap
conf_matrix = pd.DataFrame(data=cm,
                           columns=['Predicted:0', 'Predicted:1'],
                           index=['Actual:0', 'Actual:1'])

plt.figure(figsize=(10, 6))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap="Greens", linecolor="Blue", linewidths=1.5)
plt.show()

# Example predictions for 10 samples
samples = [
    [63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1, 0, 0],
    [50, 0, 2, 120, 200, 0, 0, 130, 0, 1.5, 0, 0, 0, 0, 0],
    [70, 1, 1, 160, 250, 1, 1, 180, 1, 3.0, 1, 1, 1, 1, 1],
    [45, 0, 4, 110, 180, 0, 0, 120, 0, 1.0, 0, 0, 0, 0, 0],
    [55, 1, 2, 140, 220, 1, 0, 160, 0, 2.5, 0, 0, 1, 0, 0],
    [60, 0, 3, 130, 210, 0, 0, 140, 0, 2.0, 0, 0, 0, 0, 0],
    [65, 1, 1, 150, 240, 1, 1, 170, 1, 2.8, 1, 0, 1, 1, 0],
    [40, 0, 4, 100, 170, 0, 0, 110, 0, 0.8, 0, 0, 0, 0, 0],
    [75, 1, 2, 170, 260, 1, 1, 190, 1, 3.5, 1, 1, 1, 1, 1],
    [48, 0, 3, 125, 190, 0, 0, 135, 0, 1.8, 0, 0, 0, 0, 0]
]

for i, sample in enumerate(samples, 1):
    prediction = logreg.predict([sample])
    if prediction[0] == 1:
        result = "Heart disease detected ⚠️"
    else:
        result = "No heart disease ✅"
    print(f"Sample {i}: {result}")
