
import { supabase } from '@/integrations/supabase/client';
import { getAptosWallet } from "../lib/aptos";

// Define types for API responses
export interface TokenPrice {
  id: string;
  price: number;
  timestamp: number;
}

export interface PredictionData {
  tokenId: string;
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  confidence: number;
  timeframe: string;
  timestamp: number;
}

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  percentChange24h: number;
  logoUrl: string;
}

/**
 * Fetch token prices from Supabase
 */
export const fetchTokenPrices = async (): Promise<TokenPrice[]> => {
  try {
    console.log("Fetching token prices from database...");
    
    // Get the latest price for each token
    const { data, error } = await supabase
      .from('tokens')
      .select('id, current_price, updated_at');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Fallback to mock data if no tokens found
      console.log("No tokens found in database, using mock data");
      return [
        { id: "aptos", price: 2.35 + (Math.random() * 0.3 - 0.15), timestamp: Date.now() },
        { id: "btc", price: 56780 + (Math.random() * 1000 - 500), timestamp: Date.now() },
        { id: "eth", price: 3120 + (Math.random() * 100 - 50), timestamp: Date.now() },
        { id: "sol", price: 142 + (Math.random() * 15 - 7.5), timestamp: Date.now() },
        { id: "sui", price: 1.28 + (Math.random() * 0.2 - 0.1), timestamp: Date.now() },
      ];
    }
    
    // Update token prices with a small random fluctuation (for demo purposes)
    const updatedPrices = await Promise.all(data.map(async (token) => {
      // Add a small random change to simulate live price updates
      const change = Math.random() * 0.05 - 0.025; // -2.5% to +2.5%
      const newPrice = Number(token.current_price) * (1 + change);
      
      // Update the token price in the database
      const { error: updateError } = await supabase
        .from('tokens')
        .update({ 
          current_price: newPrice,
          percent_change_24h: change * 100,
          updated_at: new Date()
        })
        .eq('id', token.id);
      
      if (updateError) console.error("Error updating token price:", updateError);
      
      // Add a new historical price point
      const { error: priceError } = await supabase
        .from('token_prices')
        .insert({
          token_id: token.id,
          price: newPrice,
          timestamp: new Date()
        });
      
      if (priceError) console.error("Error inserting historical price:", priceError);
      
      return {
        id: token.id,
        price: newPrice,
        timestamp: Date.now()
      };
    }));
    
    return updatedPrices;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    throw error;
  }
};

/**
 * Get all tokens from the database
 */
export const fetchAllTokens = async (): Promise<TokenData[]> => {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .order('market_cap', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log("No tokens found in database");
      // Return mock data if no tokens in database
      const { tokens } = await import('../lib/mockData');
      return tokens;
    }
    
    return data.map(token => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      currentPrice: Number(token.current_price),
      marketCap: Number(token.market_cap),
      volume24h: Number(token.volume_24h),
      percentChange24h: Number(token.percent_change_24h),
      logoUrl: token.logo_url
    }));
  } catch (error) {
    console.error("Error fetching all tokens:", error);
    throw error;
  }
};

/**
 * Submit a transaction to store prediction data on-chain
 */
export const storeAiPrediction = async (prediction: PredictionData): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      console.log("No authenticated user, storing prediction without user_id");
    }
    
    const { error } = await supabase
      .from('predictions')
      .insert({
        token_id: prediction.tokenId,
        current_price: prediction.currentPrice,
        predicted_price: prediction.predictedPrice,
        predicted_change: prediction.predictedChange,
        confidence: prediction.confidence,
        timeframe: prediction.timeframe,
        user_id: session.session?.user?.id
      });
    
    if (error) throw error;
    
    console.log("Prediction stored in database");
    return true;
  } catch (error) {
    console.error("Error storing prediction in database:", error);
    
    // For demo purposes, we'll simulate blockchain storage
    try {
      const wallet = getAptosWallet();
      const isConnected = await wallet.isConnected();
      
      if (!isConnected) {
        console.log("Wallet not connected, skipping blockchain storage");
        return false;
      }
      
      console.log("Storing prediction on blockchain (simulated):", prediction);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful transaction
      const txHash = "0x" + Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      console.log("Transaction submitted:", txHash);
      return true;
    } catch (walletError) {
      console.error("Error storing prediction on blockchain:", walletError);
      return false;
    }
  }
};

/**
 * Get prediction history from database
 */
export const getPredictionHistory = async (tokenId: string): Promise<PredictionData[]> => {
  try {
    console.log("Fetching prediction history for:", tokenId);
    
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('token_id', tokenId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log("No predictions found, using mock data");
      // Return mock predictions
      return Array(5).fill(null).map((_, i) => {
        const currentPrice = tokenId === "aptos" ? 2.35 : tokenId === "btc" ? 56780 : 3120;
        const change = (Math.random() * 20 - 5) / 100; // -5% to +15%
        
        return {
          tokenId,
          currentPrice,
          predictedPrice: currentPrice * (1 + change),
          predictedChange: change * 100,
          confidence: 70 + Math.random() * 20,
          timeframe: ["1d", "7d", "30d"][Math.floor(Math.random() * 3)],
          timestamp: Date.now() - (i * 24 * 60 * 60 * 1000) // Going back in time
        };
      });
    }
    
    return data.map(prediction => ({
      tokenId: prediction.token_id,
      currentPrice: Number(prediction.current_price),
      predictedPrice: Number(prediction.predicted_price),
      predictedChange: Number(prediction.predicted_change),
      confidence: Number(prediction.confidence),
      timeframe: prediction.timeframe,
      timestamp: new Date(prediction.created_at).getTime()
    }));
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    throw error;
  }
};

/**
 * Add a token to user favorites
 */
export const addToFavorites = async (tokenId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.user.id,
        token_id: tokenId
      });
    
    if (error) {
      // If error is a duplicate, it's already in favorites
      if (error.code === '23505') {
        console.log("Token already in favorites");
        return true;
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

/**
 * Remove a token from user favorites
 */
export const removeFromFavorites = async (tokenId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.user.id)
      .eq('token_id', tokenId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

/**
 * Get user favorite tokens
 */
export const getFavoriteTokens = async (): Promise<string[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('token_id')
      .eq('user_id', user.user.id);
    
    if (error) throw error;
    
    return data.map(favorite => favorite.token_id);
  } catch (error) {
    console.error("Error getting favorite tokens:", error);
    return [];
  }
};
