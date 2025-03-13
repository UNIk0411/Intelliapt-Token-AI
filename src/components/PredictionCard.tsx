
import React from 'react';
import { predictions, tokens } from '../lib/mockData';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const PredictionCard: React.FC = () => {
  // Get only the most recent predictions for each token (7-day timeframe)
  const recentPredictions = predictions.filter(pred => pred.timeframe === '7d');
  
  // Sort by confidence (highest first)
  const sortedPredictions = [...recentPredictions].sort((a, b) => b.confidence - a.confidence);
  
  const getTokenDetails = (tokenId: string) => {
    return tokens.find(token => token.id === tokenId);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {sortedPredictions.map((prediction) => {
        const token = getTokenDetails(prediction.tokenId);
        if (!token) return null;
        
        const isPositive = prediction.predictedChange > 0;
        
        return (
          <div key={prediction.id} className="token-card group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-aptos to-tokenBlue opacity-60"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img 
                  src={token.logoUrl} 
                  alt={token.name} 
                  className="w-10 h-10 mr-3 rounded-full bg-white p-1 shadow-subtle"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40/EAEAEA/858585?text=?';
                  }}
                />
                <div>
                  <h3 className="font-bold text-lg text-darkText">{token.name}</h3>
                  <p className="text-sm text-lightText">{token.symbol}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div 
                  className={`chip ${isPositive ? 'chip-green' : 'chip-red'}`}
                >
                  <span>{isPositive ? '+' : ''}{prediction.predictedChange.toFixed(2)}%</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-lightText">Current Price</span>
                <span className="text-sm text-lightText">Predicted Price</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xl font-semibold text-darkText">
                  ${token.currentPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                
                <div className="flex items-center">
                  {isPositive ? (
                    <ArrowUpRight size={18} className="text-tokenGreen mr-1" />
                  ) : (
                    <ArrowDownRight size={18} className="text-tokenRed mr-1" />
                  )}
                  <span className={`text-xl font-bold ${isPositive ? 'text-tokenGreen' : 'text-tokenRed'}`}>
                    ${prediction.predictedPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm mt-6">
              <div className="flex items-center">
                <Clock size={14} className="text-lightText mr-1" />
                <span className="text-lightText">{prediction.timeframe} Forecast</span>
              </div>
              <div className="text-right">
                <span className="text-lightText">Confidence</span>
                <div className="relative w-full h-2 bg-gray-100 rounded-full mt-1">
                  <div 
                    className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-aptos to-tokenBlue"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a 
                href={`#token-${token.id}`}
                className="text-aptos hover:text-blue-700 font-medium text-sm transition-colors inline-flex items-center"
              >
                View Detailed Analysis
                <ArrowUpRight size={14} className="ml-1" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionCard;
