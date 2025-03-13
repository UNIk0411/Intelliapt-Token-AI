
// Mock data for development purposes
// In production, this would be replaced with API calls

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  currentPrice: number;
  percentChange24h: number;
  marketCap: number;
  volume24h: number;
}

export interface PredictionData {
  id: string;
  tokenId: string;
  predictedPrice: number;
  predictedChange: number;
  confidence: number;
  timeframe: '7d' | '30d' | '90d';
  createdAt: string;
}

export interface ChartDataPoint {
  timestamp: string;
  price: number;
}

export const tokens: TokenData[] = [
  {
    id: 'aptos',
    name: 'Aptos',
    symbol: 'APT',
    logoUrl: 'https://cryptologos.cc/logos/aptos-apt-logo.png',
    currentPrice: 14.28,
    percentChange24h: 5.2,
    marketCap: 4823000000,
    volume24h: 328000000,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    currentPrice: 3480.12,
    percentChange24h: 1.8,
    marketCap: 427800000000,
    volume24h: 18600000000,
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    currentPrice: 59320.75,
    percentChange24h: -0.5,
    marketCap: 1167000000000,
    volume24h: 42500000000,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    currentPrice: 121.36,
    percentChange24h: 2.4,
    marketCap: 52300000000,
    volume24h: 3120000000,
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    logoUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    currentPrice: 0.42,
    percentChange24h: -1.2,
    marketCap: 15200000000,
    volume24h: 630000000,
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    logoUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    currentPrice: 36.75,
    percentChange24h: 4.1,
    marketCap: 13500000000,
    volume24h: 945000000,
  },
];

export const predictions: PredictionData[] = [
  {
    id: 'pred-apt-7d',
    tokenId: 'aptos',
    predictedPrice: 16.45,
    predictedChange: 15.2,
    confidence: 85,
    timeframe: '7d',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-apt-30d',
    tokenId: 'aptos',
    predictedPrice: 18.92,
    predictedChange: 32.5,
    confidence: 79,
    timeframe: '30d',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-eth-7d',
    tokenId: 'ethereum',
    predictedPrice: 3612.50,
    predictedChange: 3.8,
    confidence: 82,
    timeframe: '7d',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-btc-7d',
    tokenId: 'bitcoin',
    predictedPrice: 62450.25,
    predictedChange: 5.28,
    confidence: 88,
    timeframe: '7d',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-sol-7d',
    tokenId: 'solana',
    predictedPrice: 133.85,
    predictedChange: 10.3,
    confidence: 76,
    timeframe: '7d',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-ada-7d',
    tokenId: 'cardano',
    predictedPrice: 0.39,
    predictedChange: -7.1,
    confidence: 72,
    timeframe: '7d',
    createdAt: new Date().toISOString(),
  },
];

export const generateChartData = (days = 30, volatility = 0.02, trend = 0.001): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  let price = 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness with a slight upward trend
    const random = Math.random() * volatility * 2 - volatility;
    const trendFactor = trend * (days - i);
    price = price * (1 + random + trendFactor);
    
    data.push({
      timestamp: date.toISOString(),
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};

export const chartData = {
  aptos: generateChartData(90, 0.03, 0.002),
  ethereum: generateChartData(90, 0.02, 0.001),
  bitcoin: generateChartData(90, 0.015, 0.0008),
  solana: generateChartData(90, 0.04, 0.0025),
  cardano: generateChartData(90, 0.025, -0.0005),
  avalanche: generateChartData(90, 0.035, 0.0015),
};
