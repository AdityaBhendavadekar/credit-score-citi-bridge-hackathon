import numpy as np
import pickle

# Load the model and encoders
def load_model():
    with open("models/model_main/cibil_model.pkl", "rb") as file:
        return pickle.load(file)

model, bank_encoder, market_encoder = load_model()

def predict(turnover=4500000, income=1200000, expenses=85, past_defaults=1, bank_status="Stable", market_trend="Growth"):
    user_input = np.array([[  
        turnover,  
        income,  
        expenses,  
        past_defaults,  
        bank_encoder.transform([bank_status])[0],  
        market_encoder.transform([market_trend])[0]   
    ]], dtype=np.float32)

    # Predict CIBIL score
    predicted_cibil = model.predict(user_input)[0]
    
    return round(predicted_cibil, 2)