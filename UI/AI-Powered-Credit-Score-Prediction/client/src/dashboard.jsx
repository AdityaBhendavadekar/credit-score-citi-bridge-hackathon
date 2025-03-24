import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {BarChart} from "./Components/BarChart"

Chart.register(CategoryScale);

const Dashboard = () => {
  const currentScore = 750; // Score set to 750 (Excellent)
  const minScore = 300;
  const maxScore = 900;
  const scorePercentage =
    ((currentScore - minScore) / (maxScore - minScore)) * 100;
  const [lineMonth, setLineMonth] = useState("");
  const [lineYear, setLineYear] = useState("");
  const [hardMonth, setHardMonth] = useState("");
  const [hardYear, setHardYear] = useState("");
  const [creditScore, setCreditScore] = useState("");

  useEffect(async () => {
    const response = await axios.get("http://127.0.0.1:5000/recent-activity");
    setLineMonth(response.data.new_credit_line.month);
    setLineYear(response.data.new_credit_line.year);
    setHardMonth(response.data.hard_enquiry.month);
    setHardYear(response.data.hard_enquiry.year);
  }, []);

  useEffect(async () => {
    const response = await axios.get("http://127.0.0.1:5000//credit-score");
    console.log(response)
    setCreditScore(response.data.credit_score);
  }, []);

  // Function to determine the color based on the score
  const getScoreColor = (score) => {
    if (score >= 700) {
      return "text-green-600"; // Green for good scores
    } else if (score >= 500 && score < 700) {
      return "text-yellow-600"; // Yellow for medium scores
    } else {
      return "text-red-600"; // Red for poor scores
    }
  };

  const creditData = [
    { month: "Jan", score: 650 },
    { month: "Feb", score: 680 },
    { month: "Mar", score: 720 },
    { month: "Apr", score: 710 },
    { month: "May", score: 750 },
  ];

  const riskFactors = [
    { title: "Credit Utilization (45%)", status: "High Risk" },
    { title: "2 Late Payments", status: "Medium Risk" },
    { title: "Credit Age (4 years)", status: "Low Risk" },
  ];

  const riskAssessmentData = [
    { month: "January", financialHealth: 80, creditworthiness: 720, riskFactor: 20 },
    { month: "February", financialHealth: 82, creditworthiness: 725, riskFactor: 18 },
    { month: "March", financialHealth: 85, creditworthiness: 730, riskFactor: 16 },
    { month: "April", financialHealth: 83, creditworthiness: 735, riskFactor: 17 },
    { month: "May", financialHealth: 86, creditworthiness: 740, riskFactor: 15 },
    { month: "June", financialHealth: 88, creditworthiness: 745, riskFactor: 14 },
    { month: "July", financialHealth: 90, creditworthiness: 750, riskFactor: 12 },
    { month: "August", financialHealth: 89, creditworthiness: 755, riskFactor: 13 },
    { month: "September", financialHealth: 91, creditworthiness: 760, riskFactor: 11 },
    { month: "October", financialHealth: 93, creditworthiness: 765, riskFactor: 10 },
    { month: "November", financialHealth: 94, creditworthiness: 770, riskFactor: 9 },
    { month: "December", financialHealth: 95, creditworthiness: 775, riskFactor: 8 }
  ];
  
  const [chartData, setChartData] = useState({
    labels: riskAssessmentData.map((data) => data.month),
    datasets: [
      {
        label: "Financial Health (%)",
        data: riskAssessmentData.map((data) => data.financialHealth),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1
      },
      {
        label: "Creditworthiness (Score)",
        data: riskAssessmentData.map((data) => data.creditworthiness),
        backgroundColor: "rgba(54,162,235,0.6)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1
      },
      {
        label: "Risk Factor (%)",
        data: riskAssessmentData.map((data) => data.riskFactor),
        backgroundColor: "rgba(255,99,132,0.6)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1
      }
    ]
  });

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="text-blue-600">Credit Health</span> Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Credit Score Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Credit Score
              </h2>
              {/* Dynamic score color */}
              <p
                className={`text-4xl font-bold mt-2 ${getScoreColor(
                  creditScore
                )}`}
              >
                {creditScore}
              </p>
              <div className="flex items-center mt-3">
                <span className={`${getScoreColor(currentScore)} mr-2`}>
                  {currentScore >= 700
                    ? "Excellent"
                    : currentScore >= 500
                    ? "Fair"
                    : "Poor"}
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentScore >= 700
                      ? "bg-green-500"
                      : currentScore >= 500
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </div>

            {/* 3D Style Score Wheel */}
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Dynamic text color for the score inside the circle */}
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    currentScore
                  )}`}
                >
                  {currentScore}
                </div>
              </div>
              <svg className="transform -rotate-90 w-48 h-48 drop-shadow-lg">
                {/* Background Track */}
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  className="stroke-current text-gray-200"
                  strokeWidth="12"
                  fill="transparent"
                />

                {/* Colored Segments */}
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  className="stroke-current text-red-400"
                  strokeWidth="12"
                  strokeDasharray="175 353"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  className="stroke-current text-amber-400"
                  strokeWidth="12"
                  strokeDasharray="132 396"
                  strokeDashoffset="-175"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  className="stroke-current text-green-500"
                  strokeWidth="12"
                  strokeDasharray="220 308"
                  strokeDashoffset="-307"
                  fill="transparent"
                  style={{
                    filter: "drop-shadow(0 4px 6px rgba(34, 197, 94, 0.3))",
                  }}
                />
              </svg>

              {/* 3D Effect Layer */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 shadow-inner" />
            </div>
          </div>

          {/* Gradient Score Range */}
          <div className="mt-8 relative h-4">
            <div className="h-2 w-full bg-gradient-to-r from-red-400 via-amber-400 to-green-500 rounded-full" />

            {/* Current Score Indicator */}
            <div
              className="absolute top-0 -mt-1 w-4 h-6 bg-blue-600 rounded-sm"
              style={{ left: `${scorePercentage}%` }}
            >
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-blue-600 border-transparent" />
            </div>
          </div>

          {/* Range Labels */}
          <div className="flex justify-between mt-4 px-1">
            <span className="text-xs text-red-500">300</span>
            <span className="text-xs text-gray-500">Score Range</span>
            <span className="text-xs text-green-500">900</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credit Trends */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              12-Month Credit History
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={creditData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{ fill: "#4b5563" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fill: "#4b5563" }}
                    domain={[300, 900]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <BarChart chartData={chartData} />
          </div>

          {/* Risk Factors */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Risk Factors
            </h3>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{factor.title}</span>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        factor.status === "High Risk"
                          ? "bg-red-100 text-red-800"
                          : factor.status === "Medium Risk"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      } text-sm`}
                    >
                      {factor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Credit Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Credit Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-gray-600">Total Credit Lines</span>
                  <p className="text-xs text-gray-400">Active accounts</p>
                </div>
                <span className="text-gray-800 font-medium">4</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-gray-600">Oldest Account</span>
                  <p className="text-xs text-gray-400">Years active</p>
                </div>
                <span className="text-gray-800 font-medium">5.2</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-gray-600">Credit Utilization</span>
                  <p className="text-xs text-gray-400">Recommended: {"<30%"}</p>
                </div>
                <span className="text-gray-800 font-medium">45%</span>
              </div>
            </div>
          </div>

          {/* Recent Changes */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-gray-700 font-medium">
                    New Credit Line Added
                  </p>
                  <span className="text-sm text-blue-600">
                    {lineMonth} {lineYear}
                  </span>
                </div>
                <span className="text-green-600 font-semibold">+25</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-gray-700 font-medium">Hard Inquiry</p>
                  <span className="text-sm text-blue-600">
                    {hardMonth} {hardYear}
                  </span>
                </div>
                <span className="text-red-600 font-semibold">-10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
