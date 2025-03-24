import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def train_and_save_model(file_path="highly_correlated_business_data_v2.csv"):
    # Load dataset
    df = pd.read_csv(file_path)
    
    # Feature selection
    features = ["Annual_Revenue", "Loan_Amount", "Credit_Score", "GST_Compliance (%)"]
    categorical_features = ["Bank_Transactions", "Market_Trend"]
    
    # Encoding categorical variables
    label_encoders = {}
    for col in categorical_features:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    features.extend(categorical_features)
    X = df[features]
    y = df["Past_Defaults"]
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scaling numerical features
    scaler = StandardScaler()
    numerical_features = ["Annual_Revenue", "Loan_Amount", "Credit_Score", "GST_Compliance (%)"]
    X_train[numerical_features] = scaler.fit_transform(X_train[numerical_features])
    X_test[numerical_features] = scaler.transform(X_test[numerical_features])
    
    # Model training
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Model evaluation
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))
    
    # Save the model, scaler, and encoders
    joblib.dump(model, "risk_loan_default_model.pkl")
    joblib.dump(scaler, "risk_scaler.pkl")
    joblib.dump(label_encoders, "risk_label_encoders.pkl")
    print("Model and preprocessing objects saved successfully!")

if __name__ == "__main__":
    train_and_save_model()