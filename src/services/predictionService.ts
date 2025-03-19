
import * as tf from '@tensorflow/tfjs';
import { supabase } from '@/integrations/supabase/client';

// Types for prediction service
export interface PredictionInput {
  tokenId: string;
  historicalPrices: number[];
  timeframe: '1d' | '7d' | '30d';
}

export interface PredictionResult {
  tokenId: string;
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  confidence: number;
  timeframe: string;
}

// Mock training data generator
const generateTrainingData = (prices: number[]) => {
  const windowSize = 5;
  const X = [];
  const y = [];
  
  for (let i = 0; i < prices.length - windowSize; i++) {
    X.push(prices.slice(i, i + windowSize));
    y.push(prices[i + windowSize]);
  }
  
  return { X, y };
};

// Create and train a simple LSTM model
export const createPredictionModel = async (historicalPrices: number[]): Promise<tf.LayersModel> => {
  // Wait for TensorFlow.js to initialize
  await tf.ready();
  
  console.log("Creating prediction model...");
  
  // Generate training data
  const windowSize = 5; // Define windowSize here
  const { X, y } = generateTrainingData(historicalPrices);
  
  // Normalize data
  const xMin = Math.min(...historicalPrices);
  const xMax = Math.max(...historicalPrices);
  const xNorm = historicalPrices.map(p => (p - xMin) / (xMax - xMin));
  
  // Prepare tensors
  const xTensor = tf.tensor2d(X.map(window => 
    window.map(p => (p - xMin) / (xMax - xMin))
  ));
  const yTensor = tf.tensor2d(y.map(val => [(val - xMin) / (xMax - xMin)]));
  
  // Create a simple model
  const model = tf.sequential();
  
  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: false,
    inputShape: [windowSize, 1] // Use windowSize here
  }));
  
  model.add(tf.layers.dense({ units: 1 }));
  
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError'
  });
  
  // Reshape input for LSTM [samples, time steps, features]
  const reshapedX = xTensor.reshape([X.length, windowSize, 1]);
  
  console.log("Training model...");
  
  // Train the model
  await model.fit(reshapedX, yTensor, {
    epochs: 25,
    batchSize: 32,
    shuffle: true,
    verbose: 0
  });
  
  console.log("Model training complete!");
  
  // Clean up tensors
  xTensor.dispose();
  yTensor.dispose();
  
  return model;
};

// Get historical prices from database
export const fetchHistoricalPrices = async (tokenId: string, days: number = 30): Promise<number[]> => {
  try {
    console.log(`Fetching historical prices for ${tokenId} for last ${days} days`);
    
    // Fix the schema access issue by specifying the correct table path
    const { data, error } = await supabase
      .from('token_prices')
      .select('price, timestamp')
      .eq('token_id', tokenId)
      .order('timestamp', { ascending: true })
      .limit(days);
    
    if (error) {
      console.error("Error fetching token prices:", error);
      throw error;
    }
    
    // If we don't have enough data, return mock data
    if (!data || data.length < 10) {
      console.log("Not enough historical data, using mock data");
      // Use the data from the chartData object instead
      const { chartData } = await import('../lib/mockData');
      const mockData = chartData[tokenId as keyof typeof chartData] || [];
      return mockData.map(d => d.price);
    }
    
    return data.map(d => Number(d.price));
  } catch (error) {
    console.error("Error fetching historical prices:", error);
    // Fallback to mock data in case of any error
    const { chartData } = await import('../lib/mockData');
    const mockData = chartData[tokenId as keyof typeof chartData] || [];
    return mockData.map(d => d.price);
  }
};

// Generate predictions using the trained model
export const generatePrediction = async ({ 
  tokenId, 
  historicalPrices,
  timeframe 
}: PredictionInput): Promise<PredictionResult> => {
  try {
    console.log(`Generating prediction for ${tokenId} with timeframe ${timeframe}...`);
    
    if (historicalPrices.length < 10) {
      throw new Error("Not enough historical data for prediction");
    }
    
    // Get current price (last price in the array)
    const currentPrice = historicalPrices[historicalPrices.length - 1];
    
    // Create and train model
    const model = await createPredictionModel(historicalPrices);
    
    // Prepare input for prediction
    const windowSize = 5; // Define windowSize here too
    const lastWindow = historicalPrices.slice(-windowSize);
    
    // Normalize
    const xMin = Math.min(...historicalPrices);
    const xMax = Math.max(...historicalPrices);
    const input = lastWindow.map(p => (p - xMin) / (xMax - xMin));
    
    // Reshape input for LSTM [samples, time steps, features]
    const inputTensor = tf.tensor3d([input.map(x => [x])]);
    
    // Make prediction
    const predictionNorm = model.predict(inputTensor) as tf.Tensor;
    const predictionArr = await predictionNorm.array();
    const predictedValueNorm = predictionArr[0][0];
    
    // Denormalize
    const predictedPrice = predictedValueNorm * (xMax - xMin) + xMin;
    
    // Calculate change percentage
    const predictedChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    // Clean up
    inputTensor.dispose();
    predictionNorm.dispose();
    model.dispose();
    
    // Create prediction result
    const result = {
      tokenId,
      currentPrice,
      predictedPrice,
      predictedChange,
      confidence: 75 + Math.random() * 15, // Mock confidence score
      timeframe
    };
    
    // Store the prediction in the database
    try {
      await storePrediction(result);
    } catch (storeError) {
      console.error("Error storing prediction:", storeError);
      // Continue even if storing fails
    }
    
    return result;
  } catch (error) {
    console.error("Error generating prediction:", error);
    throw error;
  }
};

// Store prediction in the database
export const storePrediction = async (prediction: PredictionResult): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    // Insert into predictions table
    const { error } = await supabase
      .from('predictions')
      .insert({
        token_id: prediction.tokenId,
        current_price: prediction.currentPrice,
        predicted_price: prediction.predictedPrice,
        predicted_change: prediction.predictedChange,
        confidence: prediction.confidence,
        timeframe: prediction.timeframe,
        user_id: userId || null
      });
    
    if (error) {
      console.error("Error inserting prediction:", error);
      throw error;
    }
    
    console.log("Prediction stored in database");
  } catch (error) {
    console.error("Error storing prediction:", error);
    throw error;
  }
};

// Get latest prediction for a token
export const getLatestPrediction = async (tokenId: string, timeframe: string): Promise<PredictionResult | null> => {
  try {
    // Fix the schema access issue
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('token_id', tokenId)
      .eq('timeframe', timeframe)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Error fetching prediction:", error);
      throw error;
    }
    
    if (!data || data.length === 0) return null;
    
    return {
      tokenId: data[0].token_id,
      currentPrice: Number(data[0].current_price),
      predictedPrice: Number(data[0].predicted_price),
      predictedChange: Number(data[0].predicted_change),
      confidence: Number(data[0].confidence),
      timeframe: data[0].timeframe
    };
  } catch (error) {
    console.error("Error getting latest prediction:", error);
    // Return null instead of throwing so UI doesn't break
    return null;
  }
};
