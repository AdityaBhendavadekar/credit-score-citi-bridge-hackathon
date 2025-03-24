import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler

# Load saved models
scaler = joblib.load("models/models_bank/scaler.pkl")
kmeans = joblib.load("models/models_bank/kmeans_model.pkl")
rf_model = joblib.load("models/models_bank/rf_model.pkl")

# Function to extract features from raw transaction data
def extract_features(transaction_data):
    required_cols = ["Credit", "Debit", "Remaining_Balance"]
    if not all(col in transaction_data.columns for col in required_cols):
        raise ValueError("Missing required columns in input data")

    features = {}
    features["Mean_Credit"] = transaction_data["Credit"].mean()
    features["Std_Credit"] = transaction_data["Credit"].std()
    features["Mean_Debit"] = transaction_data["Debit"].mean()
    features["Std_Debit"] = transaction_data["Debit"].std()
    features["Mean_Balance"] = transaction_data["Remaining_Balance"].mean()
    features["Std_Balance"] = transaction_data["Remaining_Balance"].std()
    features["Total_Monthly_Credits"] = transaction_data.groupby(transaction_data.index // 30)["Credit"].sum().mean()
    features["Total_Monthly_Debits"] = transaction_data.groupby(transaction_data.index // 30)["Debit"].sum().mean()
    features["Transactions_Per_Month"] = len(transaction_data) / 12

    # Compute Rolling Averages
    transaction_data["Rolling_Avg_3M"] = transaction_data["Credit"].rolling(window=90, min_periods=1).mean()
    transaction_data["Rolling_Avg_6M"] = transaction_data["Credit"].rolling(window=180, min_periods=1).mean()
    features["Rolling_Avg_3M"] = transaction_data["Rolling_Avg_3M"].iloc[-1]
    features["Rolling_Avg_6M"] = transaction_data["Rolling_Avg_6M"].iloc[-1]

    # Compute Percentile Rank
    features["Percentile_Rank"] = (transaction_data["Credit"].rank(pct=True)).mean()

    return pd.DataFrame([features])


# Function to predict transaction stability
def predict_transaction_stability(new_data_csv):
    new_data = pd.read_csv(new_data_csv)
    new_features = extract_features(new_data)
    new_scaled = scaler.transform(new_features)
    
    # K-Means Prediction
    cluster_label = kmeans.predict(new_scaled)[0]
    
    # Random Forest Prediction
    rf_prediction = rf_model.predict(new_scaled)[0]
    
    return {"RF_Prediction": rf_prediction}