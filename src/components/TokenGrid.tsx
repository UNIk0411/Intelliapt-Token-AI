
import React, { useState } from 'react';
import { tokens, TokenData } from '../lib/mockData';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

const TokenGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof TokenData>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredTokens = tokens.filter(token => 
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-darkText">Top Tokens</h2>
        <div className="relative w-full sm:w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aptos focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-lightText uppercase tracking-wider">
                  Token
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-lightText uppercase tracking-wider cursor-pointer"
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
                  className="px-6 py-3 text-xs font-semibold text-lightText uppercase tracking-wider cursor-pointer"
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
                  className="px-6 py-3 text-xs font-semibold text-lightText uppercase tracking-wider cursor-pointer hidden md:table-cell"
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
                  className="px-6 py-3 text-xs font-semibold text-lightText uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                  onClick={() => handleSort('volume24h')}
                >
                  <div className="flex items-center">
                    <span>24h Volume</span>
                    {sortBy === 'volume24h' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-lightText uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedTokens.map((token) => (
                <tr 
                  key={token.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={token.logoUrl} 
                        alt={token.name} 
                        className="w-8 h-8 mr-3 rounded-full bg-white p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32/EAEAEA/858585?text=?';
                        }}
                      />
                      <div>
                        <div className="font-medium text-darkText">{token.name}</div>
                        <div className="text-xs text-lightText">{token.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-darkText">
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
                  <td className="px-6 py-4 whitespace-nowrap text-lightText hidden md:table-cell">
                    {formatMarketCap(token.marketCap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lightText hidden lg:table-cell">
                    {formatVolume(token.volume24h)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <a 
                      href={`#view-token-${token.id}`}
                      className="text-aptos hover:text-blue-700 font-medium"
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
