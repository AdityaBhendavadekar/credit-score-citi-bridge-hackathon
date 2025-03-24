from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
from test_bank import predict_transaction_stability
from test_cibil import predict

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/bank-stability', methods=['POST'])
def bank_stability():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        print("File received and saved:", file_path)
        
        result = predict_transaction_stability(file_path)
        print("Prediction Result:", result)
        
        return jsonify({"stability": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/cibil-score', methods=['GET'])
def cibil_score():
    try:
        data = request.args
        predicted_cibil = predict(
            turnover=4500000,
            income=1200000,
            expenses=85,
            past_defaults=1,
            bank_status=data.get("bankStability", "Stable"),
            market_trend="Growth"
        )
        print("CIBIL Score Prediction:", predicted_cibil)
        return jsonify({"credit_score": predicted_cibil})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)