import { use, useState } from 'react';
import './LandingPage.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-gray-900/90"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div onClick={()=>{navigate('/')}} className="text-white text-2xl font-bold">
            <span className="text-blue-400">Cred</span>AI
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="/about" className="px-6 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300 text-white">
              About
            </a>
            <a href="/dashboard" className="px-6 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300 text-white">
              Dashboard
            </a>
            <a href="/input" className="px-6 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300 text-white">
              Get Started
            </a>
          </div>


          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800">
            <a href="#" className="block px-6 py-3 text-gray-300 hover:bg-gray-700">
              About
            </a>
            <a href="/input" className="block px-6 py-3 bg-blue-500 text-white hover:bg-blue-600">
              Get Started
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative z-40 min-h-screen flex items-center">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
              AI-Powered Credit Score 
              <span className="text-blue-400"> Prediction</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up delay-100">
              Get instant credit score analysis powered by advanced machine learning algorithms.
              Improve your financial health with personalized recommendations.
            </p>

            <div className="flex space-x-4 animate-fade-in-up delay-200">
              <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full text-white text-lg font-semibold transition-all duration-300 hover:scale-105">
                Get Started Free
              </button>
            </div>

            {/* Animated AI Chip */}
            <div className="mt-20 animate-float">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl inline-block shadow-xl">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-white font-semibold">AI-Powered Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-40 bg-gray-800/60 backdrop-blur-lg py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-900/50 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="text-blue-400 text-3xl mb-4">⚡</div>
            <h3 className="text-white text-xl font-semibold mb-2">Instant Prediction</h3>
            <p className="text-gray-400">Get your credit score prediction in seconds using our advanced AI models</p>
          </div>
          
          <div className="p-6 bg-gray-900/50 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="text-blue-400 text-3xl mb-4">🔒</div>
            <h3 className="text-white text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-400">Bank-level security and encryption to protect your financial data</p>
          </div>
          
          <div className="p-6 bg-gray-900/50 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="text-blue-400 text-3xl mb-4">📈</div>
            <h3 className="text-white text-xl font-semibold mb-2">Improvement Tips</h3>
            <p className="text-gray-400">Personalized recommendations to help improve your credit score</p>
          </div>
        </div>
      </div>
    </div>
  );
}