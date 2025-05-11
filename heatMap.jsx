import { useState, useEffect } from 'react';
import { ZapOff, Zap, RefreshCw } from 'lucide-react';

// Pixel font styling
const pixelFontStyle = {
  fontFamily: 'monospace',
  textShadow: '0 0 5px #ff00ff',
  letterSpacing: '1px'
};

export default function CryptoHeatmap() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  // Cyberpunk/futuristic color scheme (pink to purple)
  const colorScale = [
    '#ff00ff', // Hot pink
    '#e100ff',
    '#c300ff',
    '#a500ff',
    '#8700ff',
    '#6900ff',
    '#4b00ff',
    '#2d00ff',
    '#0f00ff', // Deep blue-purple
  ];

  // List of cryptocurrencies to fetch
  const cryptoCurrencies = [
    'bitcoin', 'ethereum', 'ripple', 'cardano', 'polkadot', 'solana',
    'dogecoin', 'avalanche-2', 'chainlink', 'matic-network', 'uniswap', 'cosmos'
  ];

  const cryptoSymbols = [
    'BTC', 'ETH', 'XRP', 'ADA', 'DOT', 'SOL',
    'DOGE', 'AVAX', 'LINK', 'MATIC', 'UNI', 'ATOM'
  ];

  // Time intervals for percentage changes
  const timeIntervals = ['1h', '24h', '7d', '14d', '30d'];
  const displayIntervals = ['1H', '1D', '7D', '14D', '30D'];

  // Function to fetch crypto data from CoinGecko API
  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      // Using CoinGecko API
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoCurrencies.join(',')}&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Format the data
      const formattedData = data.map((crypto, index) => {
        // Extract price changes for each time interval
        const changes = timeIntervals.map((interval, i) => {
          const changeKey = `price_change_percentage_${interval}_in_currency`;
          return {
            interval: displayIntervals[i],
            change: crypto[changeKey] ? parseFloat(crypto[changeKey].toFixed(2)) : 0
          };
        });
        
        return {
          id: crypto.id,
          symbol: cryptoSymbols[index] || crypto.symbol.toUpperCase(),
          name: crypto.name,
          price: crypto.current_price,
          image: crypto.image,
          changes
        };
      });
      
      setCryptoData(formattedData);
      setLastUpdated(new Date());
      setCountdown(600); // Reset countdown to 10 minutes
      setError(false);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCryptoData();
  }, []);

  // Countdown timer for next refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          // When countdown reaches 0, fetch new data
          fetchCryptoData();
          return 600; // Reset to 10 minutes
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format countdown time as MM:SS
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format price based on value
  const formatPrice = (price) => {
    if (price >= 1000) return `$${price.toLocaleString()}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  // Helper function to get color based on percentage change
  const getColorForValue = (value) => {
    // Map value from -20..20 to 0..8 (color scale index)
    const normalizedIndex = Math.floor((value + 20) / 40 * 8);
    const boundedIndex = Math.max(0, Math.min(8, normalizedIndex));
    return colorScale[boundedIndex];
  };

  if (loading && cryptoData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-black text-purple-500 p-4 border border-purple-500">
        <div className="animate-pulse text-2xl" style={pixelFontStyle}>LOADING CRYPTO DATA...</div>
        <div className="animate-spin mt-4"><Zap size={24} /></div>
      </div>
    );
  }

  if (error && cryptoData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-black text-red-500 p-4 border border-red-500">
        <div className="text-2xl" style={pixelFontStyle}>DATA FEED ERROR</div>
        <ZapOff size={24} className="mt-4" />
        <button 
          className="mt-4 px-4 py-2 bg-red-900 bg-opacity-30 border border-red-500 text-red-400 hover:bg-opacity-50"
          onClick={fetchCryptoData}
          style={pixelFontStyle}
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-black p-4 border border-purple-500 relative overflow-hidden">
      {/* Wireframe background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-purple-500 rounded"></div>
        <div className="absolute top-10 left-10 w-3/4 h-3/4 border border-pink-500"></div>
        <div className="absolute bottom-10 right-10 w-1/2 h-1/2 border border-purple-300"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-purple-900 opacity-20"></div>
      </div>
      
      {/* Header */}
      <div className="mb-4 text-center relative z-10">
        <h1 className="text-2xl font-bold text-pink-500 tracking-widest" style={pixelFontStyle}>
          ::CRYPTO HEAT INDEX::
        </h1>
        <div className="flex justify-center items-center space-x-4">
          <p className="text-purple-300 text-xs mt-1" style={pixelFontStyle}>
            LAST UPDATE: {lastUpdated.toLocaleTimeString()}
          </p>
          <p className="text-purple-300 text-xs mt-1 flex items-center" style={pixelFontStyle}>
            <RefreshCw size={12} className="mr-1" /> NEXT: {formatCountdown(countdown)}
          </p>
          <button 
            className="text-xs mt-1 text-pink-400 border border-pink-800 px-2 py-1 hover:bg-pink-900 hover:bg-opacity-20"
            onClick={fetchCryptoData}
            disabled={loading}
            style={pixelFontStyle}
          >
            {loading ? 'SYNCING...' : 'FORCE SYNC'}
          </button>
        </div>
      </div>
      
      {/* Heatmap */}
      <div className="relative overflow-x-auto z-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-800">
              <th className="px-4 py-2 text-left text-purple-300" style={pixelFontStyle}>TOKEN</th>
              <th className="px-4 py-2 text-right text-purple-300" style={pixelFontStyle}>PRICE</th>
              {displayIntervals.map(interval => (
                <th key={interval} className="px-4 py-2 text-right text-purple-300" style={pixelFontStyle}>
                  {interval}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.id} className="border-b border-purple-900 hover:bg-purple-900 hover:bg-opacity-20 transition">
                <td className="px-4 py-3 font-medium text-pink-500 flex items-center" style={pixelFontStyle}>
                  <span className="mr-2">{crypto.symbol}</span>
                </td>
                <td className="px-4 py-3 text-right text-purple-100" style={pixelFontStyle}>
                  {formatPrice(crypto.price)}
                </td>
                {crypto.changes.map((change, index) => (
                  <td 
                    key={index} 
                    className="px-4 py-3 text-right relative"
                    style={{
                      ...pixelFontStyle,
                      backgroundColor: `${getColorForValue(change.change)}20`, // 20 is hex for 12% opacity
                      color: getColorForValue(change.change)
                    }}
                  >
                    <span className="relative z-10">
                      {change.change > 0 ? '+' : ''}{change.change}%
                    </span>
                    {/* Wireframe grid cell highlight */}
                    <div className="absolute inset-0 border border-opacity-20" style={{ borderColor: getColorForValue(change.change) }}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center items-center relative z-10">
        <div className="flex items-center space-x-1" style={pixelFontStyle}>
          <span className="text-pink-500 text-xs">BEARISH</span>
          <div className="flex h-4">
            {colorScale.map((color, index) => (
              <div 
                key={index} 
                className="w-6 h-full"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
          <span className="text-purple-500 text-xs">BULLISH</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center relative z-10" style={pixelFontStyle}>
        <p className="text-xs text-purple-400">
          <span className="text-pink-500">!</span> LIVE MARKET DATA VIA COINGECKO API <span className="text-pink-500">!</span>
        </p>
        <p className="text-xs text-purple-400 mt-1">
          AUTO-REFRESH EVERY 10 MINUTES
        </p>
      </div>
    </div>
  );
}
