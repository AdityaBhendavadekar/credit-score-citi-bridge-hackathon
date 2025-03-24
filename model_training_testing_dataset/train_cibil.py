import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify, render_template
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor

def train_model():
    df = pd.read_csv("highly_correlated_business_data_v2.csv")  # Load dataset
    
    # Drop unnecessary columns
    df = df.drop(columns=['Business_ID'])
    
    # Encoding categorical variables
    bank_encoder = LabelEncoder()
    market_encoder = LabelEncoder()
    df['Bank_Transactions'] = bank_encoder.fit_transform(df['Bank_Transactions'])
    df['Market_Trend'] = market_encoder.fit_transform(df['Market_Trend'])
    
    # Define features and target
    X = df.drop(columns=['Credit_Score'])
    y = df['Credit_Score']
    
    # # **Increase weights for high-importance features**
    # weight_factors = {
    #     'Annual_Revenue': 2.0,  # Increased weight
    #     'Past_Defaults': 3.0,   # Higher impact on credit risk
    #     'Bank_Transactions': 1.8,  
    #     'Market_Trend': 1.2,  # Lower influence
    # }

    # for feature, weight in weight_factors.items():
    #     if feature in X.columns:
    #         X[feature] *= weight
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model using Random Forest
    model = RandomForestRegressor(n_estimators=150, random_state=42)  # Increased estimators for better accuracy
    model.fit(X_train, y_train)
    
    # Save the trained model
    with open("cibil_model.pkl", "wb") as file:
        pickle.dump((model, bank_encoder, market_encoder), file)
    
    print("Model trained and saved successfully!")
    
    return model, X_test, y_test

train_model()

def load_model():
    with open("cibil_model.pkl", "rb") as file:
        return pickle.load(file)

model, bank_encoder, market_encoder = load_model()

def predict():
    user_input = np.array([[  
        4500000 ,  # Apply increased weight  
        1200000,  
        85,  
        1 ,  # Adjust for Past_Defaults  
        bank_encoder.transform(["Stable"])[0] ,  
        market_encoder.transform(["Growth"])[0]   
    ]], dtype=np.float32)  # Ensure correct dtype

    # Predict CIBIL score
    predicted_cibil = model.predict(user_input)[0]
    print("Predicted CIBIL Score:", round(predicted_cibil, 2))
    
    return round(predicted_cibil, 2)

def test_model_accuracy():
    _, X_test, y_test = train_model()
    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    accuracy_percentage = r2 * 100  # Convert R² score to percentage
    
    print(f"Model Accuracy: {accuracy_percentage:.2f}%")
    print(f"Mean Absolute Error: {mae:.2f}")
    return accuracy_percentage, mae

test_model_accuracy()
predict()
