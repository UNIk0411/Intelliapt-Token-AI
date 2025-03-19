
import React, { useState, useEffect } from 'react';
import { tokens, TokenData } from '../lib/mockData';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import { fetchTokenPrices } from '../services/aptosService';
import { useToast } from "@/components/ui/use-toast";

const TokenGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof TokenData>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [tokenList, setTokenList] = useState(tokens);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestPrices();
  }, []);

  const fetchLatestPrices = async () => {
    try {
      setIsRefreshing(true);
      
      // Fetch latest prices from Aptos blockchain
      const latestPrices = await fetchTokenPrices();
      
      // Update token list with latest prices
      const updatedTokens = tokenList.map(token => {
        const priceData = latestPrices.find(p => p.id === token.id);
        
        if (priceData) {
          const percentChange = ((priceData.price - token.currentPrice) / token.currentPrice) * 100;
          
          return {
            ...token,
            currentPrice: priceData.price,
            percentChange24h: percentChange
          };
        }
        
        return token;
      });
      
      setTokenList(updatedTokens);
      
      if (isLoading) {
        setIsLoading(false);
      } else {
        toast({
          title: "Prices Updated",
          description: "Latest token prices have been fetched from the blockchain",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error fetching latest prices:", error);
      toast({
        title: "Error",
        description: "Failed to update prices. Please try again.",
        variant: "destructive"
      });
      
      if (isLoading) setIsLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredTokens = tokenList.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const handleSort = (key: keyof TokenData) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const formatPrice = (price: number) => {
    return price >= 1
      ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
  };

  const formatMarketCap = (marketCap: number) => {
    return `$${(marketCap / 1000000000).toFixed(1)}B`;
  };

  const formatVolume = (volume: number) => {
    return `$${(volume / 1000000).toFixed(1)}M`;
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Top Tokens</h2>
          <div className="h-10 w-64 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        <div className="bg-darkCard rounded-xl shadow-soft overflow-hidden animate-pulse">
          <div className="h-96 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-white mr-2">Top Tokens</h2>
          <button 
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-dark transition-colors"
            onClick={fetchLatestPrices}
            disabled={isRefreshing}
            title="Refresh Prices"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark pl-10 pr-4 py-2 w-full rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-intelliPurple focus:border-transparent text-white"
          />
        </div>
      </div>

      <div className="bg-darkCard rounded-xl shadow-soft overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Token
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('currentPrice')}
                >
                  <div className="flex items-center">
                    <span>Price</span>
                    {sortBy === 'currentPrice' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('percentChange24h')}
                >
                  <div className="flex items-center">
                    <span>24h Change</span>
                    {sortBy === 'percentChange24h' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center">
                    <span>Market Cap</span>
                    {sortBy === 'marketCap' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                  onClick={() => handleSort('volume24h')}
                >
                  <div className="flex items-center">
                    <span>24h Volume</span>
                    {sortBy === 'volume24h' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sortedTokens.map((token) => (
                <tr 
                  key={token.id}
                  className="hover:bg-dark transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={token.logoUrl} 
                        alt={token.name} 
                        className="w-8 h-8 mr-3 rounded-full bg-dark p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32/333333/858585?text=?';
                        }}
                      />
                      <div>
                        <div className="font-medium text-white">{token.name}</div>
                        <div className="text-xs text-gray-400">{token.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                    {formatPrice(token.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${
                      token.percentChange24h >= 0 ? 'text-tokenGreen' : 'text-tokenRed'
                    }`}>
                      {token.percentChange24h >= 0 ? (
                        <TrendingUp size={16} className="mr-1" />
                      ) : (
                        <TrendingDown size={16} className="mr-1" />
                      )}
                      <span className="font-medium">
                        {token.percentChange24h >= 0 ? '+' : ''}
                        {token.percentChange24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 hidden md:table-cell">
                    {formatMarketCap(token.marketCap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 hidden lg:table-cell">
                    {formatVolume(token.volume24h)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <a 
                      href={`#view-token-${token.id}`}
                      className="text-intelliPurple hover:text-intelliPurple/80 font-medium"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenGrid;
