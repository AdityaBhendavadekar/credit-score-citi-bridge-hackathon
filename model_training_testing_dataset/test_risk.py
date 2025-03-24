import pandas as pd
import joblib

def predict_default(sample_data):
    # Load trained model and preprocessing objects
    model = joblib.load("loan_default_model.pkl")
    scaler = joblib.load("scaler.pkl")
    label_encoders = joblib.load("label_encoders.pkl")
    
    # Encode categorical variables
    categorical_features = ["Bank_Transactions", "Market_Trend"]
    for col in categorical_features:
        sample_data[col] = label_encoders[col].transform(sample_data[col])
    
    # Scale numerical values
    numerical_features = ["Annual_Revenue", "Loan_Amount", "Credit_Score", "GST_Compliance (%)"]
    sample_data[numerical_features] = scaler.transform(sample_data[numerical_features])
    
    # Predict risk level
    prediction = model.predict(sample_data)[0]
    risk_label = "May Default Loan" if prediction == 1 else "May Not Default Loan"
    
    return risk_label

if __name__ == "__main__":
    # Sample test case
    sample = pd.DataFrame({
        "Annual_Revenue": [5000],
        "Loan_Amount": [2000000],
        "Credit_Score": [600],
        "GST_Compliance (%)": [85],
        "Bank_Transactions": ["Stable"],
        "Market_Trend": ["Growth"]
    })
    
    result = predict_default(sample)
    print(f"Predicted Risk Level: {result}")
