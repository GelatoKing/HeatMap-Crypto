# Crypto Heatmap

A React component that displays real-time cryptocurrency data in a stylish, cyberpunk-themed heatmap interface. The component fetches live data from the CoinGecko API and automatically refreshes every 10 minutes.

![Crypto Heatmap Preview](https://i.imgur.com/YourImageHere.png)

## Features

- **Real-time Cryptocurrency Data**: Shows current prices and percentage changes for 12 popular cryptocurrencies
- **Automatic Updates**: Refreshes data every 10 minutes with a countdown timer
- **Multiple Time Intervals**: Displays performance across various timeframes (1H, 1D, 7D, 14D, 30D)
- **Visual Heat Indication**: Color-coded cells make it easy to see positive and negative trends at a glance
- **Cyberpunk/Futuristic UI**: Stylish interface with a neon pink and purple color scheme
- **Responsive Design**: Works on different screen sizes
- **Manual Refresh Option**: Force data refresh at any time

## Installation

1. Add the component to your React project:

```bash
# First, install required dependencies if you don't have them:
npm install react lucide-react
# or
yarn add react lucide-react
```

2. Copy the `CryptoHeatmap.jsx` file to your components directory

3. Import and use the component in your application:

```jsx
import CryptoHeatmap from './components/CryptoHeatmap';

function App() {
  return (
    <div className="App">
      <CryptoHeatmap />
    </div>
  );
}

export default App;
```

## API Usage

This component uses the free [CoinGecko API](https://www.coingecko.com/en/api) to fetch cryptocurrency data. No API key is required for basic usage, but there are rate limits. If you plan to use this in a production environment with frequent refreshes, consider:

1. Using a proxy server
2. Implementing more sophisticated caching
3. Signing up for CoinGecko Pro if needed for higher rate limits

## Styling

The component uses Tailwind CSS utility classes. If you're not using Tailwind in your project, you have a few options:

1. Add Tailwind to your project: [Tailwind Installation Guide](https://tailwindcss.com/docs/installation)
2. Replace Tailwind classes with your own CSS
3. Use a CDN version of Tailwind for quick testing

## Customization

### Changing the cryptocurrencies displayed

Edit the `cryptoCurrencies` and `cryptoSymbols` arrays in the component:

```jsx
const cryptoCurrencies = [
  'bitcoin', 'ethereum', 'ripple', 'cardano', 'polkadot', 'solana',
  'dogecoin', 'avalanche-2', 'chainlink', 'matic-network', 'uniswap', 'cosmos'
];

const cryptoSymbols = [
  'BTC', 'ETH', 'XRP', 'ADA', 'DOT', 'SOL', 
  'DOGE', 'AVAX', 'LINK', 'MATIC', 'UNI', 'ATOM'
];
```

### Changing the refresh interval

Find the following lines and adjust the seconds value (currently set to 600 seconds = 10 minutes):

```jsx
const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

// And in the countdown reset:
setCountdown(600); // Reset to 10 minutes
```

### Modifying the color scheme

Update the `colorScale` array with your preferred colors:

```jsx
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
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing the free API
- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- Inspiration from cyberpunk interfaces and cryptocurrency trading terminals
