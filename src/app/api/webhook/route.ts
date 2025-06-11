import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConfigModel from '@/models/ConfigModel';
import OrderModel from '@/models/OrderModel';
import { getCurrentPrice, validateSignal, calculateTPSL, simulateOrder } from '@/services/binanceService';

// Webhook handler from TradingView
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Parse webhook data
    const webhookData = await request.json();
    
    // Validate required fields
    const requiredFields = ['symbol', 'plusDI', 'minusDI', 'adx', 'timeframe'];
    for (const field of requiredFields) {
      if (!webhookData[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Get the active configuration
    const config = await ConfigModel.findOne().sort({ createdAt: -1 });
    
    // If no configuration exists, use defaults
    const activeConfig = config || {
      symbol: 'BTCUSDT',
      timeframe: '5m',
      plusDIThreshold: 25,
      minusDIThreshold: 20,
      adxMinimum: 20,
      takeProfitPercent: 2,
      stopLossPercent: 1,
      leverage: 10,
    };
    
    // Validate the signal based on DMI/ADX values
    const { plusDI, minusDI, adx, symbol, timeframe } = webhookData;
    const action = validateSignal(
      plusDI,
      minusDI,
      adx,
      activeConfig.plusDIThreshold,
      activeConfig.minusDIThreshold,
      activeConfig.adxMinimum
    );
    
    // If no valid signal, return early
    if (!action) {
      return NextResponse.json({
        success: true,
        message: 'No valid trading signal detected',
        data: {
          signal: 'NONE',
          conditions: {
            plusDI,
            minusDI,
            adx,
            plusDIThreshold: activeConfig.plusDIThreshold,
            minusDIThreshold: activeConfig.minusDIThreshold,
            adxMinimum: activeConfig.adxMinimum,
          },
        },
      });
    }
    
    // Get the current price from Binance
    const currentPrice = await getCurrentPrice(symbol);
    
    // Calculate take profit and stop loss prices
    const { tpPrice, slPrice } = calculateTPSL(
      action,
      currentPrice,
      activeConfig.takeProfitPercent,
      activeConfig.stopLossPercent
    );
    
    // Simulate the order on Binance testnet
    const orderResult = await simulateOrder(
      symbol,
      action,
      activeConfig.leverage,
      currentPrice,
      tpPrice,
      slPrice
    );
    
    // Save the order to the database
    const newOrder = await OrderModel.create({
      symbol,
      action,
      priceEntry: currentPrice,
      tpPrice,
      slPrice,
      leverage: `${activeConfig.leverage}x`,
      timeframe,
      timestamp: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${action} signal`,
      data: {
        signal: action,
        order: newOrder,
        conditions: {
          plusDI,
          minusDI,
          adx,
          plusDIThreshold: activeConfig.plusDIThreshold,
          minusDIThreshold: activeConfig.minusDIThreshold,
          adxMinimum: activeConfig.adxMinimum,
        },
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 