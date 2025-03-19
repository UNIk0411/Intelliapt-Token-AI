
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PredictionCard from '../components/PredictionCard';
import TokenGrid from '../components/TokenGrid';
import PriceChart from '../components/PriceChart';
import SimpleAnalysis from '../components/SimpleAnalysis';
import Footer from '../components/Footer';
import { ArrowRight, BrainCircuit, Lock, TrendingUp, Database, Zap } from 'lucide-react';
import { getAptosWallet } from '../lib/aptos';

const Index = () => {
  const [selectedToken, setSelectedToken] = useState('aptos');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  useEffect(() => {
    // Check wallet connection status
    const checkWalletConnection = async () => {
      const wallet = getAptosWallet();
      const connected = await wallet.isConnected();
      setIsWalletConnected(connected);
    };
    
    checkWalletConnection();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
    
    // Listen for wallet connection events
    window.addEventListener('walletConnected', () => {
      setIsWalletConnected(true);
    });
    
    window.addEventListener('walletDisconnected', () => {
      setIsWalletConnected(false);
    });
    
    return () => {
      window.removeEventListener('walletConnected', () => {});
      window.removeEventListener('walletDisconnected', () => {});
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* AI Prediction Section */}
        <section id="predictions" className="bg-darkBg py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-12">
              <div className="inline-block mb-2">
                <span className="chip chip-purple">AI-Powered Insights</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                AI Token Price Predictions
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our advanced AI models analyze multiple market factors to predict future token prices,
                giving you actionable insights that stay ahead of market movements.
              </p>
            </div>
            
            <PredictionCard />
            
            <div className="text-center mt-12">
              <a href="#tokens" className="button-primary inline-flex items-center">
                View All Tokens
                <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </section>
        
        {/* Token List Section */}
        <section id="tokens" className="bg-dark py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-12">
              <div className="inline-block mb-2">
                <span className="chip chip-purple">Real-Time Data</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Market Overview
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Stay updated with the latest token prices, market trends, and trading volumes
                across the Aptos ecosystem and beyond.
              </p>
            </div>
            
            <div className="mb-12">
              <TokenGrid />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl bg-darkCard shadow-soft p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-6">
                  {selectedToken.toUpperCase()} Price History
                </h3>
                <PriceChart tokenId={selectedToken} />
              </div>
              
              <SimpleAnalysis tokenId={selectedToken} />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="bg-darkBg py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-12">
              <div className="inline-block mb-2">
                <span className="chip chip-purple">Technology</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                How IntelliAPT Works
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our platform combines cutting-edge AI with the security of Aptos blockchain
                to deliver accurate predictions and real-time market insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                <div className="h-12 w-12 rounded-xl bg-intelliPurple/10 flex items-center justify-center mb-4">
                  <BrainCircuit size={24} className="text-intelliPurple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  AI Prediction Engine
                </h3>
                <p className="text-gray-400">
                  Our proprietary AI models analyze historical data, market sentiment, and on-chain metrics
                  to generate accurate price predictions for various timeframes.
                </p>
              </div>
              
              <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                <div className="h-12 w-12 rounded-xl bg-intelliPurple/10 flex items-center justify-center mb-4">
                  <Lock size={24} className="text-intelliPurple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Blockchain Security
                </h3>
                <p className="text-gray-400">
                  All predictions are stored on the Aptos blockchain using secure Move smart contracts,
                  ensuring transparency, immutability, and trustless verification.
                </p>
              </div>
              
              <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                <div className="h-12 w-12 rounded-xl bg-intelliPurple/10 flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-intelliPurple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Real-Time Updates
                </h3>
                <p className="text-gray-400">
                  Our system constantly monitors market conditions and updates predictions accordingly,
                  providing you with the most current and relevant insights.
                </p>
              </div>
            </div>
            
            <div className="mt-16 bg-darkCard rounded-xl p-8 shadow-subtle">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Technical Architecture
                  </h3>
                  <p className="text-gray-400 mb-6">
                    IntelliAPT combines front-end React components with a robust backend and Aptos blockchain integration
                    to deliver a seamless, powerful experience.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-intelliPurple flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                        <Database size={14} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Oracle Data Feeds</h4>
                        <p className="text-sm text-gray-400">
                          Secure price feeds from multiple sources ensure our predictions are based on accurate, real-time data.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-intelliPurple flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                        <BrainCircuit size={14} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">AI Prediction Models</h4>
                        <p className="text-sm text-gray-400">
                          Advanced machine learning algorithms process vast amounts of data to generate accurate forecasts.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-intelliPurple flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                        <Lock size={14} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Aptos Smart Contracts</h4>
                        <p className="text-sm text-gray-400">
                          Written in Move, our contracts securely store predictions and enable trustless verification.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-intelliPurple flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                        <Zap size={14} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">React Frontend</h4>
                        <p className="text-sm text-gray-400">
                          A responsive, modern interface that makes accessing powerful AI predictions intuitive and simple.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden lg:block relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-intelliPurple/10 to-tokenBlue/5 rounded-xl"></div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-center">
                      <svg viewBox="0 0 500 400" className="w-full h-auto">
                        {/* Architecture Diagram */}
                        <rect x="20" y="250" width="120" height="60" rx="10" fill="#2A2A3C" stroke="#9461FB" strokeWidth="2" />
                        <text x="80" y="285" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="500">Frontend</text>
                        
                        <rect x="190" y="250" width="120" height="60" rx="10" fill="#2A2A3C" stroke="#9461FB" strokeWidth="2" />
                        <text x="250" y="285" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="500">Backend API</text>
                        
                        <rect x="360" y="250" width="120" height="60" rx="10" fill="#2A2A3C" stroke="#9461FB" strokeWidth="2" />
                        <text x="420" y="285" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="500">Blockchain</text>
                        
                        <rect x="190" y="150" width="120" height="60" rx="10" fill="#2A2A3C" stroke="#9461FB" strokeWidth="2" />
                        <text x="250" y="185" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="500">AI Engine</text>
                        
                        <rect x="190" y="50" width="120" height="60" rx="10" fill="#2A2A3C" stroke="#9461FB" strokeWidth="2" />
                        <text x="250" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="500">Data Sources</text>
                        
                        {/* Connecting Lines */}
                        <line x1="140" y1="280" x2="190" y2="280" stroke="#9461FB" strokeWidth="2" />
                        <line x1="310" y1="280" x2="360" y2="280" stroke="#9461FB" strokeWidth="2" />
                        <line x1="250" y1="250" x2="250" y2="210" stroke="#9461FB" strokeWidth="2" />
                        <line x1="250" y1="150" x2="250" y2="110" stroke="#9461FB" strokeWidth="2" />
                        
                        {/* Arrows */}
                        <polygon points="185,280 195,276 195,284" fill="#9461FB" />
                        <polygon points="355,280 365,276 365,284" fill="#9461FB" />
                        <polygon points="250,215 246,205 254,205" fill="#9461FB" />
                        <polygon points="250,115 246,105 254,105" fill="#9461FB" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-intelliPurple py-16 sm:py-24">
          <div className="section-container text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Predict the Future?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Connect your Aptos wallet today and get access to cutting-edge AI predictions
              that can transform your crypto investment strategy.
            </p>
            {isWalletConnected ? (
              <a href="#predictions" className="bg-white text-intelliPurple px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all inline-flex items-center">
                View Your Predictions
                <ArrowRight size={16} className="ml-2" />
              </a>
            ) : (
              <button 
                onClick={() => {
                  const event = new CustomEvent('openWalletConnect');
                  window.dispatchEvent(event);
                }}
                className="bg-white text-intelliPurple px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all inline-flex items-center"
              >
                Connect Wallet
                <ArrowRight size={16} className="ml-2" />
              </button>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
