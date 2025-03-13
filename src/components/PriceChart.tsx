
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { chartData } from '../lib/mockData';

interface PriceChartProps {
  tokenId: string;
  color?: string;
  showControls?: boolean;
}

type TimeRange = '1d' | '7d' | '30d' | '90d' | 'all';

const PriceChart: React.FC<PriceChartProps> = ({ 
  tokenId, 
  color = '#0071E3',
  showControls = true
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch with a timeout
    const timer = setTimeout(() => {
      const rawData = chartData[tokenId as keyof typeof chartData] || [];
      let filteredData;
      
      switch (timeRange) {
        case '1d':
          filteredData = rawData.slice(-24);
          break;
        case '7d':
          filteredData = rawData.slice(-7);
          break;
        case '30d':
          filteredData = rawData.slice(-30);
          break;
        case '90d':
          filteredData = rawData;
          break;
        case 'all':
          filteredData = rawData;
          break;
        default:
          filteredData = rawData.slice(-30);
      }
      
      // Format data for the chart
      const formattedData = filteredData.map(point => ({
        date: new Date(point.timestamp).toLocaleDateString(),
        price: point.price
      }));
      
      setData(formattedData);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [tokenId, timeRange]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container animate-scale-in">
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-darkText">Price History</h3>
          <div className="flex space-x-2">
            {(['1d', '7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  timeRange === range
                    ? 'bg-aptos text-white font-medium'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="h-40 w-full loading-shimmer rounded-lg"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`gradient-${tokenId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              stroke="#86868B"
            />
            <YAxis 
              tickFormatter={formatCurrency} 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              stroke="#86868B"
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={false}
              animationDuration={1000}
              fill={`url(#gradient-${tokenId})`}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriceChart;
