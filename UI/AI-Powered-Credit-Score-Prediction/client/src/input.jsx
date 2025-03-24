import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBriefcase, FiCreditCard, FiFileText, FiUpload, FiDollarSign } from "react-icons/fi";

export default function InputPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessId: "",
    panNumber: "",
    gstNumber: "",
    loanAmount: "",
    bankStatement: null,
  });

  const [errors, setErrors] = useState({
    businessId: "",
    panNumber: "",
    gstNumber: "",
    loanAmount: "",
    bankStatement: "",
  });

  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "businessId":
        if (!/^\d+$/.test(value)) error = "Business ID must be a number";
        break;
      case "panNumber":
        if (!/^[A-Za-z0-9]{10}$/.test(value)) error = "Invalid PAN format";
        break;
      case "gstNumber":
        if (!/^\d+$/.test(value)) error = "GST must be a number";
        break;
      case "loanAmount":
        if (parseFloat(value) <= 0) error = "Loan amount must be greater than 0";
        break;
      case "bankStatement":
        if (!value) error = "Bank statement is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const inputValue = name === "bankStatement" ? files[0] : value;

    setFormData((prev) => ({ ...prev, [name]: inputValue }));
    
    // Only validate if there's a value
    if (inputValue) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, inputValue) }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate each field
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.bankStatement);
      
      // Add other form fields to the FormData
      formDataToSend.append("businessId", formData.businessId);
      formDataToSend.append("gstNumber", formData.gstNumber);
      formDataToSend.append("panNumber", formData.panNumber);
      formDataToSend.append("loanAmount", formData.loanAmount);

      // Step 1: Call Bank Stability API (POST)
      const bankStabilityResponse = await axios.post(
        "http://127.0.0.1:5000/bank-stability",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Bank Stability Response:", bankStabilityResponse.data);
      const bankStability = bankStabilityResponse.data.stability;

      // Step 2: Call Credit Score API with all necessary parameters
      const creditScoreResponse = await axios.post("http://127.0.0.1:5000/credit-score", {
        businessId: formData.businessId,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        loanAmount: formData.loanAmount,
        bankStatus: bankStability
      });

      console.log("Credit Score Response:", creditScoreResponse.data);
      const creditScore = creditScoreResponse.data.credit_score;

      // Step 3: Call Risk Assessment API
      const riskData = {
        business_id: formData.businessId,
        credit_score: creditScore,
        loan_amount: parseFloat(formData.loanAmount),
        bank_stability: bankStability
      };
      
      const riskResponse = await axios.post("http://127.0.0.1:5000/test-risk", riskData);
      console.log("Risk Assessment Response:", riskResponse.data);

      console.log("crediscore: ", creditScore)
      console.log("bank_stability: ", bankStabilityResponse.data)
      console.log("risk",riskData)


      
      // Step 4: Navigate to Dashboard with all the data
      // navigate("/dashboard", { 
      //   state: { 
      //     creditScore,
      //     bankStability,
      //     defaultRisk: riskResponse.data.default_probability,
      //     businessId: formData.businessId
      //   } 
      // });

    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("An error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="text-blue-400">Credit</span> Assessment Form
          </h2>
          <p className="text-gray-300">
            Fill in your details to get AI-powered credit score prediction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <FiBriefcase className="w-5 h-5 mr-2 text-blue-400" />
              Business ID
            </label>
            <input
              type="text"
              name="businessId"
              value={formData.businessId}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Business ID"
            />
            {errors.businessId && (
              <p className="mt-1 text-sm text-red-400">{errors.businessId}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <FiFileText className="w-5 h-5 mr-2 text-blue-400" />
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter PAN Number"
            />
            {errors.panNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.panNumber}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <FiCreditCard className="w-5 h-5 mr-2 text-blue-400" />
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter GST Number"
            />
            {errors.gstNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.gstNumber}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <FiDollarSign className="w-5 h-5 mr-2 text-blue-400" />
              Loan Amount
            </label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Loan Amount"
            />
            {errors.loanAmount && (
              <p className="mt-1 text-sm text-red-400">{errors.loanAmount}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <FiUpload className="w-5 h-5 mr-2 text-blue-400" />
              Upload Bank Statement (CSV)
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              <input
                type="file"
                name="bankStatement"
                accept=".csv"
                onChange={handleChange}
                className="w-full text-gray-300"
              />
              <p className="mt-2 text-xs text-gray-400">Upload your bank transactions in CSV format</p>
            </div>
            {errors.bankStatement && (
              <p className="mt-1 text-sm text-red-400">{errors.bankStatement}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
              loading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Processing..." : "Get Credit Score"}
          </button>
        </form>
      </div>
    </div>
  );
}