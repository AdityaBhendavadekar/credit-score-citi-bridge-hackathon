import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Load dataset
data = pd.read_csv("bank_transactions_labeled_users.csv")  # Your engineered dataset

# Define features and target
X = data.drop(columns=["User_ID", "Label"])
y = data["Label"]

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train K-Means Clustering Model
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
data["Cluster_Label"] = kmeans.fit_predict(X_scaled)

# Train a Supervised Learning Model (Random Forest)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save models
joblib.dump(scaler, "scaler.pkl")
joblib.dump(kmeans, "kmeans_model.pkl")
joblib.dump(rf_model, "rf_model.pkl")

# Predictions and Evaluation
y_pred = rf_model.predict(X_test)
print(classification_report(y_test, y_pred))

# Predict for new transaction dataset
def predict_transaction_stability(new_data_csv):
    new_data = pd.read_csv(new_data_csv)
    # Perform necessary feature engineering similar to training set
    new_features = extract_features(new_data)  # Define this function based on feature engineering logic
    new_scaled = scaler.transform(new_features)
    return rf_model.predict(new_scaled)

# Example usage:
predicted_labels = predict_transaction_stability("bank_transactions.csv")
print(predicted_labels)
