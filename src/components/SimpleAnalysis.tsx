
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { generatePrediction } from '../services/predictionService';
import { storeAiPrediction } from '../services/aptosService';
import { chartData } from '../lib/mockData';
import { ArrowRight, BrainCircuit, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PriceChart from './PriceChart';
import { useToast } from "@/components/ui/use-toast";

interface SimpleAnalysisProps {
  tokenId: string;
}

const SimpleAnalysis: React.FC<SimpleAnalysisProps> = ({ tokenId }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const runAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      
      // Get historical price data
      const historicalData = chartData[tokenId as keyof typeof chartData] || [];
      const historicalPrices = historicalData.map(d => d.price);
      
      // Generate three predictions for different timeframes
      const results = await Promise.all([
        generatePrediction({ tokenId, historicalPrices, timeframe: '1d' }),
        generatePrediction({ tokenId, historicalPrices, timeframe: '7d' }),
        generatePrediction({ tokenId, historicalPrices, timeframe: '30d' })
      ]);
      
      // Store the 7-day prediction on chain (as an example)
      await storeAiPrediction({
        ...results[1],
        timestamp: Date.now()
      });
      
      setAnalysis({
        tokenId,
        predictions: results,
        timestamp: Date.now(),
        factors: [
          { name: "Market Sentiment", impact: "Positive", score: 7.8 },
          { name: "Volume Trends", impact: "Neutral", score: 5.2 },
          { name: "Technical Indicators", impact: "Positive", score: 8.1 },
          { name: "On-Chain Activity", impact: "Very Positive", score: 9.2 }
        ]
      });
      
      toast({
        title: "Analysis Complete",
        description: "AI prediction generated and stored on-chain",
        duration: 3000
      });
    } catch (error) {
      console.error("Error running analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate AI prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">AI-Powered Analysis</h3>
        <p className="text-gray-400">
          Use our advanced AI models to analyze this token and predict future price movements
          based on historical data and market trends.
        </p>
      </div>
      
      {!analysis ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-intelliPurple/10 rounded-full flex items-center justify-center mb-4">
            <BrainCircuit size={32} className="text-intelliPurple" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Run AI Analysis</h4>
          <p className="text-gray-400 mb-6">
            Generate AI-powered price predictions and market insights 
            for this token using our machine learning models.
          </p>
          <Button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="bg-intelliPurple hover:bg-intelliPurple/90"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="mb-6">
            <PriceChart tokenId={tokenId} showControls={false} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {analysis.predictions.map((prediction: any, index: number) => {
              const isPositive = prediction.predictedChange > 0;
              return (
                <div key={index} className="bg-dark rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">{prediction.timeframe} Prediction</span>
                    <div 
                      className={`chip ${isPositive ? 'chip-green' : 'chip-red'} text-xs`}
                    >
                      {isPositive ? '+' : ''}{prediction.predictedChange.toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-gray-400">Price Target</span>
                    <div className="flex items-center">
                      {isPositive ? (
                        <ArrowUpRight size={14} className="text-tokenGreen mr-1" />
                      ) : (
                        <ArrowDownRight size={14} className="text-tokenRed mr-1" />
                      )}
                      <span className={`text-base font-bold ${isPositive ? 'text-tokenGreen' : 'text-tokenRed'}`}>
                        ${prediction.predictedPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-xs text-gray-400">Confidence</span>
                    <div className="relative w-full h-1.5 bg-gray-800 rounded-full mt-1">
                      <div 
                        className="absolute top-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-intelliPurple to-tokenBlue"
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-2">Key Influencing Factors</h4>
            <div className="space-y-3">
              {analysis.factors.map((factor: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{factor.name}</span>
                  <div className="flex items-center">
                    <span className={`text-sm mr-2 ${
                      factor.impact.includes('Positive') ? 'text-tokenGreen' : 
                      factor.impact.includes('Negative') ? 'text-tokenRed' : 'text-gray-400'
                    }`}>
                      {factor.impact}
                    </span>
                    <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          factor.score > 7 ? 'bg-tokenGreen' : 
                          factor.score < 4 ? 'bg-tokenRed' : 'bg-tokenBlue'
                        }`}
                        style={{ width: `${factor.score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Button 
              onClick={runAnalysis}
              disabled={isAnalyzing}
              variant="outline"
              className="border-intelliPurple text-intelliPurple hover:bg-intelliPurple/10"
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAnalysis;
