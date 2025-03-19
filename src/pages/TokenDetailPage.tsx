
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PriceChart from '../components/PriceChart';
import SimpleAnalysis from '../components/SimpleAnalysis';
import Footer from '../components/Footer';
import { ArrowLeft, Star, TrendingUp, LineChart, BrainCircuit } from 'lucide-react';
import { tokens } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { addToFavorites } from '../services/aptosService';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const TokenDetailPage = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [token, setToken] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (tokenId) {
      // Find token details from our mock data
      const foundToken = tokens.find(t => t.id === tokenId);
      setToken(foundToken || null);
      setIsLoading(false);
    }
  }, [tokenId]);

  const handleAddToFavorites = async () => {
    if (!tokenId) return;
    
    try {
      await addToFavorites(tokenId);
      toast({
        title: "Added to Favorites",
        description: `${token?.name || tokenId.toUpperCase()} has been added to your favorites`,
        duration: 3000
      });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-darkBg">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-intelliPurple border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-darkBg">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Token Not Found</h1>
          <p className="text-gray-400 mb-6">We couldn't find details for the requested token.</p>
          <Link to="/" className="button-primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-darkBg">
      <Navbar />
      
      <main className="flex-grow">
        {/* Token Header */}
        <div className="bg-dark py-8">
          <div className="section-container">
            <div className="flex items-center mb-6">
              <Link to="/" className="text-gray-400 hover:text-white mr-4">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center">
                <img 
                  src={token.logoUrl} 
                  alt={token.name} 
                  className="w-12 h-12 mr-4 rounded-full bg-darkCard p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48/333333/858585?text=?';
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-white">{token.name}</h1>
                  <p className="text-gray-400">{token.symbol}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="ml-auto border-intelliPurple text-intelliPurple hover:bg-intelliPurple/10"
                onClick={handleAddToFavorites}
              >
                <Star size={16} className="mr-2" />
                Add to Favorites
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                <span className="text-sm text-gray-400">Current Price</span>
                <div className="flex items-end mt-1">
                  <span className="text-2xl font-bold text-white mr-2">
                    ${token.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`text-sm ${token.percentChange24h >= 0 ? 'text-tokenGreen' : 'text-tokenRed'}`}>
                    {token.percentChange24h >= 0 ? '+' : ''}{token.percentChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                <span className="text-sm text-gray-400">Market Cap</span>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-white">
                    ${(token.marketCap / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
              
              <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                <span className="text-sm text-gray-400">24h Volume</span>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-white">
                    ${(token.volume24h / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts and Analysis */}
        <div className="py-12">
          <div className="section-container">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Price Chart</h2>
              <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                <PriceChart tokenId={tokenId || 'aptos'} showControls={true} />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">AI Analysis</h2>
              <SimpleAnalysis tokenId={tokenId || 'aptos'} />
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Market Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-intelliPurple/10 flex items-center justify-center mr-3">
                      <TrendingUp size={20} className="text-intelliPurple" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Market Trends</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    {token.name} has shown {token.percentChange24h >= 0 ? 'positive' : 'negative'} movement in the last 24 hours,
                    with {Math.abs(token.percentChange24h).toFixed(2)}% change. The overall market sentiment appears to be
                    {token.percentChange24h >= 3 ? ' strongly bullish' : token.percentChange24h >= 0 ? ' cautiously optimistic' : ' bearish'}.
                  </p>
                  <div className="bg-dark rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Market Position</span>
                      <span className="text-sm text-white">Top {Math.floor(Math.random() * 20) + 1}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-intelliPurple/10 flex items-center justify-center mr-3">
                      <BrainCircuit size={20} className="text-intelliPurple" />
                    </div>
                    <h3 className="text-xl font-bold text-white">AI Sentiment Analysis</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Our AI models analyzed social media, news articles, and on-chain metrics to determine
                    the overall sentiment for {token.name} is currently 
                    {token.percentChange24h >= 5 ? ' very positive' : token.percentChange24h >= 0 ? ' positive' : ' neutral'}.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">Social Media Sentiment</span>
                        <span className="text-sm text-tokenGreen">Bullish</span>
                      </div>
                      <div className="relative w-full h-2 bg-dark rounded-full">
                        <div 
                          className="absolute top-0 left-0 h-2 rounded-full bg-tokenGreen"
                          style={{ width: `${65 + Math.random() * 20}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">News Sentiment</span>
                        <span className="text-sm text-intelliPurple">Neutral</span>
                      </div>
                      <div className="relative w-full h-2 bg-dark rounded-full">
                        <div 
                          className="absolute top-0 left-0 h-2 rounded-full bg-intelliPurple"
                          style={{ width: `${40 + Math.random() * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TokenDetailPage;
