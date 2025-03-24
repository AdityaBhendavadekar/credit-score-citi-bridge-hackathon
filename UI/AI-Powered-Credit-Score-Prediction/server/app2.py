from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

# Import prediction models
from test_cibil import predict
from test_bank import predict_transaction_stability
from test_risk import predict_default

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Temporary file path for uploaded bank statements
TEMP_FILE_PATH = "new_transactions.csv"

@app.route('/bank-stability', methods=['POST'])
def bank_stability():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400
        
        # Save the file temporarily
        file.save(TEMP_FILE_PATH)
        
        # Get prediction
        result = predict_transaction_stability(TEMP_FILE_PATH)
        
        # Clean up temporary file
        if os.path.exists(TEMP_FILE_PATH):
            os.remove(TEMP_FILE_PATH)
        
        return jsonify(result)
    
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(TEMP_FILE_PATH):
            os.remove(TEMP_FILE_PATH)
        return jsonify({"error": str(e), "stability": "Unstable"}), 500

@app.route('/credit-score', methods=['POST'])
def credit_score():
    try:
        # Check if request is form-data or JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = {
                "turnover": float(request.form.get("loanAmount", 4500000)) * 2,  # Estimated turnover based on loan amount
                "income": float(request.form.get("loanAmount", 1200000)) / 2,    # Estimated income based on loan amount
                "expenses": 85,  # Default value
                "past_defaults": 1,  # Default value
                "bank_status": request.form.get("bankStatus", "Stable"),
                "market_trend": "Growth"  # Default value
            }
        else:
            data = request.json if request.is_json else {}
        
        # Extract values, use defaults if not provided
        turnover = data.get("turnover", 4500000)
        income = data.get("income", 1200000)
        expenses = data.get("expenses", 85)
        past_defaults = data.get("past_defaults", 1)
        bank_status = data.get("bank_status", "Stable")
        market_trend = data.get("market_trend", "Growth")

        # Call the predict function
        predicted_cibil = predict(turnover, income, expenses, past_defaults, bank_status, market_trend)
        
        return jsonify({"credit_score": predicted_cibil})
    
    except Exception as e:
        return jsonify({"error": str(e), "credit_score": 650}), 500  # Return a fallback score in case of error

@app.route('/test-risk', methods=['POST'])
def test_risk():
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        # Ensure required fields exist
        required_fields = ["business_id", "credit_score", "loan_amount"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Convert JSON to DataFrame
        sample = pd.DataFrame([data])
        
        # Get prediction
        result = predict_default(sample)
        
        # Add risk assessment text
        probability = result.get("default_probability", 0)
        if probability < 0.3:
            risk_level = "Low Risk"
        elif probability < 0.7:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"
            
        result["risk_level"] = risk_level
        
        return jsonify(result)
    
    except Exception as e:
        fallback_result = {
            "default_probability": 0.5,
            "risk_level": "Medium Risk",
            "error": str(e)
        }
        return jsonify(fallback_result), 500

@app.route('/monthly-credit-scores', methods=['GET'])
def monthly_credit_scores():
    try:
        business_id = request.args.get('businessId', '')
        
        # In a real app, you would look up historical data for this business
        # This is sample data for illustration
        monthly_scores = {
            "January": 720,
            "February": 725,
            "March": 730,
            "April": 735,
            "May": 740,
            "June": 745,
            "July": 750,
            "August": 755,
            "September": 760,
            "October": 765,
            "November": 770,
            "December": 775
        }
        
        return jsonify(monthly_scores)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recent-activity', methods=['GET'])
def recent_activity():
    try:
        business_id = request.args.get('businessId', '')
        
        # Sample data
        activity = {
            "new_credit_line": {"month": "March", "year": 2025},
            "hard_enquiry": {"month": "February", "year": 2025},
            "loan_application": {"month": "January", "year": 2025},
            "payment_history": [
                {"month": "March", "year": 2025, "status": "On time"},
                {"month": "February", "year": 2025, "status": "On time"},
                {"month": "January", "year": 2025, "status": "On time"}
            ]
        }
        
        return jsonify(activity)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)