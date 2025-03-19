
import * as tf from '@tensorflow/tfjs';

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
    inputShape: [windowSize, 1]
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
    
    // For demo purposes, we'll use a simpler approach
    // In a real app, you'd use a more sophisticated model
    
    // Get current price (last price in the array)
    const currentPrice = historicalPrices[historicalPrices.length - 1];
    
    // Create and train model
    const model = await createPredictionModel(historicalPrices);
    
    // Prepare input for prediction
    const windowSize = 5;
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
    
    // Return prediction result
    return {
      tokenId,
      currentPrice,
      predictedPrice,
      predictedChange,
      confidence: 75 + Math.random() * 15, // Mock confidence score
      timeframe
    };
  } catch (error) {
    console.error("Error generating prediction:", error);
    throw error;
  }
};

