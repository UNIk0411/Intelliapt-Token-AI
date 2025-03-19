
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
 * Fetch token prices from database/mock data
 */
export const fetchTokenPrices = async (): Promise<TokenPrice[]> => {
  try {
    console.log("Fetching token prices");
    
    // Always return mock data for now to fix schema issues
    return [
      { id: "aptos", price: 2.35 + (Math.random() * 0.3 - 0.15), timestamp: Date.now() },
      { id: "btc", price: 56780 + (Math.random() * 1000 - 500), timestamp: Date.now() },
      { id: "eth", price: 3120 + (Math.random() * 100 - 50), timestamp: Date.now() },
      { id: "sol", price: 142 + (Math.random() * 15 - 7.5), timestamp: Date.now() },
      { id: "sui", price: 1.28 + (Math.random() * 0.2 - 0.1), timestamp: Date.now() },
    ];
  } catch (error) {
    console.error("Error fetching token prices:", error);
    // Fallback to mock data
    return [
      { id: "aptos", price: 2.35 + (Math.random() * 0.3 - 0.15), timestamp: Date.now() },
      { id: "btc", price: 56780 + (Math.random() * 1000 - 500), timestamp: Date.now() },
      { id: "eth", price: 3120 + (Math.random() * 100 - 50), timestamp: Date.now() },
      { id: "sol", price: 142 + (Math.random() * 15 - 7.5), timestamp: Date.now() },
      { id: "sui", price: 1.28 + (Math.random() * 0.2 - 0.1), timestamp: Date.now() },
    ];
  }
};

/**
 * Get all tokens from mock data
 */
export const fetchAllTokens = async (): Promise<TokenData[]> => {
  try {
    console.log("Fetching all tokens");
    
    // Return mock data
    const { tokens } = await import('../lib/mockData');
    return tokens;
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
    console.log("Storing prediction on blockchain (simulated):", prediction);
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful transaction
    const txHash = "0x" + Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    console.log("Transaction submitted:", txHash);
    return true;
  } catch (error) {
    console.error("Error storing prediction on blockchain:", error);
    return false;
  }
};

/**
 * Get prediction history from mock data
 */
export const getPredictionHistory = async (tokenId: string): Promise<PredictionData[]> => {
  try {
    console.log("Fetching prediction history for:", tokenId);
    
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
    console.log("Added to favorites (mock):", tokenId);
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
    console.log("Removed from favorites (mock):", tokenId);
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
    // Return some mock favorite tokens
    return ['aptos', 'btc', 'eth'];
  } catch (error) {
    console.error("Error getting favorite tokens:", error);
    return [];
  }
};
