
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { chartData } from '../lib/mockData';
import { RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface PriceChartProps {
  tokenId: string;
  color?: string;
  showControls?: boolean;
}

type TimeRange = '1d' | '7d' | '30d' | '90d' | 'all';

const PriceChart: React.FC<PriceChartProps> = ({ 
  tokenId, 
  color = '#9461fb',
  showControls = true
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadChartData();
  }, [tokenId, timeRange]);

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would fetch from an API or blockchain
      // Using a timeout to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
          filteredData = rawData.slice(-90);
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
    } catch (error) {
      console.error("Error loading chart data:", error);
      toast({
        title: "Error",
        description: "Failed to load chart data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // Simulate updating with new data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add some randomness to last data point to simulate live update
      const updatedData = [...data];
      if (updatedData.length > 0) {
        const lastIndex = updatedData.length - 1;
        const lastPoint = updatedData[lastIndex];
        const change = (Math.random() * 0.1 - 0.05) * lastPoint.price;
        updatedData[lastIndex] = {
          ...lastPoint,
          price: lastPoint.price + change
        };
      }
      
      setData(updatedData);
      
      toast({
        title: "Chart Updated",
        description: `Latest ${tokenId.toUpperCase()} price data loaded`,
        duration: 3000
      });
    } catch (error) {
      console.error("Error refreshing chart:", error);
      toast({
        title: "Error",
        description: "Failed to refresh chart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

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
        <div className="bg-dark p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm font-medium text-gray-300">{label}</p>
          <p className="text-lg font-semibold text-white">
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
          <div className="flex items-center">
            <h3 className="font-semibold text-white mr-2">Price History</h3>
            <button 
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-dark transition-colors"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Chart"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="flex space-x-2">
            {(['1d', '7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  timeRange === range
                    ? 'bg-intelliPurple text-white font-medium'
                    : 'bg-dark text-gray-400 hover:bg-gray-800'
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
          <div className="h-64 w-full loading-shimmer rounded-lg bg-gray-800"></div>
        </div>
      ) : (
        <div className="h-64">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                stroke="#555"
              />
              <YAxis 
                tickFormatter={formatCurrency} 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                stroke="#555"
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
        </div>
      )}
    </div>
  );
};

export default PriceChart;
