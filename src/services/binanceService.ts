import axios from 'axios';
import crypto from 'crypto';

// Configuration
const BINANCE_API_KEY = process.env.BINANCE_API_KEY || '';
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET || '';
const BINANCE_API_URL = 'https://testnet.binancefuture.com'; // Using testnet

// Helper function to sign the request
const generateSignature = (queryString: string): string => {
  return crypto
    .createHmac('sha256', BINANCE_API_SECRET)
    .update(queryString)
    .digest('hex');
};

// Get current price for a symbol
export const getCurrentPrice = async (symbol: string): Promise<number> => {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/fapi/v1/ticker/price`, {
      params: { symbol },
    });
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching current price:', error);
    throw new Error('Failed to fetch current price');
  }
};

// Simulate placing an order on Binance Testnet
export const simulateOrder = async (
  symbol: string,
  side: 'BUY' | 'SELL',
  leverage: number,
  price: number,
  takeProfitPrice: number,
  stopLossPrice: number
) => {
  // Set leverage first
  try {
    const timestamp = Date.now();
    const queryString = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}`;
    const signature = generateSignature(queryString);

    await axios.post(
      `${BINANCE_API_URL}/fapi/v1/leverage`,
      null,
      {
        params: {
          symbol,
          leverage,
          timestamp,
          signature,
        },
        headers: {
          'X-MBX-APIKEY': BINANCE_API_KEY,
        },
      }
    );

    // For simulation purposes, we're not actually placing orders on testnet
    // We're just returning the order details as if they were placed
    return {
      symbol,
      side,
      price,
      takeProfitPrice,
      stopLossPrice,
      leverage: `${leverage}x`,
      timestamp: new Date(),
      status: 'SIMULATED',
    };
  } catch (error) {
    console.error('Error simulating order:', error);
    throw new Error('Failed to simulate order');
  }
};

// Validate trading signal based on DMI/ADX values
export const validateSignal = (
  plusDI: number,
  minusDI: number,
  adx: number,
  plusDIThreshold: number,
  minusDIThreshold: number,
  adxMinimum: number
) => {
  // BUY conditions
  if (plusDI > plusDIThreshold && minusDI < minusDIThreshold && adx > adxMinimum) {
    return 'BUY';
  }
  // SELL conditions (opposite of BUY)
  else if (plusDI < plusDIThreshold && minusDI > minusDIThreshold && adx > adxMinimum) {
    return 'SELL';
  }
  // No valid signal
  return null;
};

// Calculate Take Profit and Stop Loss prices
export const calculateTPSL = (
  action: 'BUY' | 'SELL',
  entryPrice: number,
  takeProfitPercent: number,
  stopLossPercent: number
) => {
  let tpPrice: number;
  let slPrice: number;

  if (action === 'BUY') {
    // For a buy, TP is higher, SL is lower
    tpPrice = entryPrice * (1 + takeProfitPercent / 100);
    slPrice = entryPrice * (1 - stopLossPercent / 100);
  } else {
    // For a sell, TP is lower, SL is higher
    tpPrice = entryPrice * (1 - takeProfitPercent / 100);
    slPrice = entryPrice * (1 + stopLossPercent / 100);
  }

  return {
    tpPrice: parseFloat(tpPrice.toFixed(2)),
    slPrice: parseFloat(slPrice.toFixed(2)),
  };
}; 