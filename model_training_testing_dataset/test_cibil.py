import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify, render_template
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor


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

predict()
