
import React, { useState, useEffect } from 'react';
import { tokens } from '../lib/mockData';
import { ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react';
import { getPredictionHistory, storeAiPrediction } from '../services/aptosService';
import { generatePrediction } from '../services/predictionService';
import { chartData } from '../lib/mockData';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const PredictionCard: React.FC = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadPredictions();
  }, []);
  
  const loadPredictions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch predictions for multiple tokens
      const tokenIds = ['aptos', 'btc', 'eth'];
      const results = await Promise.all(
        tokenIds.map(id => getPredictionHistory(id))
      );
      
      // Get only the most recent prediction for each token
      const recentPredictions = results.map(tokenPredictions => 
        tokenPredictions[0]
      );
      
      // Sort by confidence (highest first)
      const sortedPredictions = [...recentPredictions].sort((a, b) => b.confidence - a.confidence);
      
      setPredictions(sortedPredictions);
    } catch (error) {
      console.error("Error loading predictions:", error);
      toast({
        title: "Error",
        description: "Failed to load predictions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshPrediction = async (tokenId: string) => {
    try {
      setIsGenerating(true);
      
      // Get historical price data
      const historicalData = chartData[tokenId as keyof typeof chartData] || [];
      const historicalPrices = historicalData.map(d => d.price);
      
      // Generate new prediction
      const newPrediction = await generatePrediction({
        tokenId,
        historicalPrices,
        timeframe: '7d'
      });
      
      // Store prediction on-chain
      await storeAiPrediction({
        ...newPrediction,
        timestamp: Date.now()
      });
      
      // Update predictions list
      setPredictions(prev => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.tokenId === tokenId);
        
        if (index !== -1) {
          updated[index] = newPrediction;
        }
        
        return updated;
      });
      
      toast({
        title: "Success",
        description: `Generated new prediction for ${tokenId.toUpperCase()}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error refreshing prediction:", error);
      toast({
        title: "Error",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getTokenDetails = (tokenId: string) => {
    return tokens.find(token => token.id === tokenId);
  };

  const handleViewDetailedAnalysis = (tokenId: string) => {
    navigate(`/token/${tokenId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {[1, 2, 3].map(i => (
          <div key={i} className="token-card animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-700 rounded"></div>
                <div className="h-3 w-12 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-700 rounded"></div>
              <div className="h-6 w-full bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {predictions.map((prediction) => {
        const token = getTokenDetails(prediction.tokenId);
        if (!token) return null;
        
        const isPositive = prediction.predictedChange > 0;
        
        return (
          <div key={prediction.tokenId} className="token-card group relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-intelliPurple to-tokenBlue opacity-60"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img 
                  src={token.logoUrl} 
                  alt={token.name} 
                  className="w-10 h-10 mr-3 rounded-full bg-dark p-1 shadow-subtle"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40/333333/858585?text=?';
                  }}
                />
                <div>
                  <h3 className="font-bold text-lg text-white">{token.name}</h3>
                  <p className="text-sm text-gray-400">{token.symbol}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <button 
                  className="mr-2 p-1.5 text-gray-400 hover:text-intelliPurple rounded-full hover:bg-dark transition-colors"
                  onClick={() => handleRefreshPrediction(prediction.tokenId)}
                  disabled={isGenerating}
                  title="Refresh Prediction"
                >
                  <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
                </button>
                <div 
                  className={`chip ${isPositive ? 'chip-green' : 'chip-red'}`}
                >
                  <span>{isPositive ? '+' : ''}{prediction.predictedChange.toFixed(2)}%</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Current Price</span>
                <span className="text-sm text-gray-400">Predicted Price</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xl font-semibold text-white">
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
                <Clock size={14} className="text-gray-400 mr-1" />
                <span className="text-gray-400">{prediction.timeframe} Forecast</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Confidence</span>
                <div className="relative w-full h-2 bg-dark rounded-full mt-1">
                  <div 
                    className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-intelliPurple to-tokenBlue"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800">
              <button 
                onClick={() => handleViewDetailedAnalysis(prediction.tokenId)}
                className="text-intelliPurple hover:text-intelliPurple/80 font-medium text-sm transition-colors inline-flex items-center"
              >
                View Detailed Analysis
                <ArrowUpRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionCard;
