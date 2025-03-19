
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { getFavoriteTokens, fetchAllTokens, TokenData, removeFromFavorites } from '@/services/aptosService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const FavoritesPage = () => {
  const { user, loading } = useAuth();
  const [favoriteTokens, setFavoriteTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      
      // Get favorite token IDs
      const favoriteIds = await getFavoriteTokens();
      
      if (favoriteIds.length === 0) {
        setFavoriteTokens([]);
        return;
      }
      
      // Get all tokens
      const allTokens = await fetchAllTokens();
      
      // Filter to only favorite tokens
      const favorites = allTokens.filter(token => 
        favoriteIds.includes(token.id)
      );
      
      setFavoriteTokens(favorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load your favorite tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (tokenId: string) => {
    try {
      await removeFromFavorites(tokenId);
      
      // Update the UI
      setFavoriteTokens(prev => prev.filter(token => token.id !== tokenId));
      
      toast({
        title: "Removed from favorites",
        description: "Token has been removed from your favorites"
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove token from favorites",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-white">Loading favorites...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Your Favorite Tokens</h1>
        
        <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
          {isLoading ? (
            <p className="text-gray-400">Loading your favorites...</p>
          ) : favoriteTokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't added any favorite tokens yet.</p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-intelliPurple hover:bg-intelliPurple/90"
              >
                Explore Tokens
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteTokens.map((token) => (
                <div key={token.id} className="bg-dark rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={token.logoUrl} 
                      alt={token.name} 
                      className="w-10 h-10 mr-3 rounded-full bg-darkCard p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40/333333/858585?text=?';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-white">{token.name}</h3>
                      <p className="text-sm text-gray-400">{token.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-6">
                      <p className="text-xl font-semibold text-white">
                        ${token.currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                      <div className={`flex items-center text-sm ${
                        token.percentChange24h >= 0 ? 'text-tokenGreen' : 'text-tokenRed'
                      }`}>
                        {token.percentChange24h >= 0 ? (
                          <TrendingUp size={14} className="mr-1" />
                        ) : (
                          <TrendingDown size={14} className="mr-1" />
                        )}
                        <span>
                          {token.percentChange24h >= 0 ? '+' : ''}
                          {token.percentChange24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite(token.id)}
                      className="text-gray-400 hover:text-tokenRed hover:bg-dark"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
