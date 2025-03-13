
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center pt-20 pb-16">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <div className="inline-block mb-2">
                <span className="chip chip-blue">Powered by AI & Aptos Blockchain</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-darkText">
                Predict Token Prices <br />with <span className="text-gradient">Artificial Intelligence</span>
              </h1>
            </div>
            <p className="text-lg text-lightText max-w-lg">
              Advanced AI models analyze market patterns to predict future token prices with unparalleled accuracy, secured by Aptos blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#predictions" className="button-primary inline-flex items-center justify-center">
                View Predictions
                <ArrowRight size={16} className="ml-2" />
              </a>
              <a href="#how-it-works" className="button-secondary inline-flex items-center justify-center">
                Learn How It Works
              </a>
            </div>
            
            <div className="text-sm text-lightText pt-4">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-tokenGreen mr-2"></div>
                  <span>99.8% Uptime</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-tokenBlue mr-2"></div>
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-aptos mr-2"></div>
                  <span>Aptos Blockchain</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-2xl blur opacity-20 animate-pulse-soft"></div>
            <div className="relative glass-container rounded-2xl overflow-hidden shadow-card">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="chip chip-blue mb-2">APT</div>
                    <h3 className="text-2xl font-bold text-darkText">Aptos</h3>
                    <p className="text-tokenBlue font-semibold">$14.28</p>
                  </div>
                  <div className="text-right">
                    <div className="chip chip-green mb-1">+5.2%</div>
                    <p className="text-sm text-lightText">24h Change</p>
                  </div>
                </div>
                
                <div className="relative h-40 mb-6">
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full h-32 bg-gradient-to-t from-blue-50 to-transparent"></div>
                    <svg viewBox="0 0 400 100" className="w-full h-full absolute bottom-0 left-0 overflow-visible">
                      <path 
                        d="M0,50 C30,30 60,70 90,50 C120,30 150,70 180,50 C210,30 240,70 270,50 C300,30 330,70 360,50 C390,30 400,50 400,50" 
                        fill="none" 
                        stroke="#0071E3" 
                        strokeWidth="2"
                        className="drop-shadow-sm"
                      />
                      <path 
                        d="M0,50 C30,30 60,70 90,50 C120,30 150,70 180,50 C210,30 240,70 270,50 C300,30 330,70 360,50 C390,30 400,50 400,50" 
                        fill="none" 
                        stroke="#0099FF" 
                        strokeWidth="2" 
                        strokeDasharray="2 4"
                      />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-darkText mb-2">AI Prediction</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-aptos">$16.45</p>
                      <p className="text-sm text-green-500">+15.2%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-lightText">Expected in</p>
                      <p className="font-semibold">7 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
