import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConfigModel, { IConfig } from '@/models/ConfigModel';

// GET handler to get the active configuration
export async function GET() {
  try {
    await connectToDatabase();
    
    // Get the most recent configuration
    const config = await ConfigModel.findOne().sort({ createdAt: -1 });
    
    if (!config) {
      // If no configuration exists, return the default values
      return NextResponse.json({
        success: true,
        data: {
          symbol: 'BTCUSDT',
          timeframe: '5m',
          plusDIThreshold: 25,
          minusDIThreshold: 20,
          adxMinimum: 20,
          takeProfitPercent: 2,
          stopLossPercent: 1,
          leverage: 10,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error getting configuration:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get configuration' },
      { status: 500 }
    );
  }
}

// POST handler to save a new configuration
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'symbol',
      'timeframe',
      'plusDIThreshold',
      'minusDIThreshold',
      'adxMinimum',
      'takeProfitPercent',
      'stopLossPercent',
      'leverage',
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Make sure we don't include an _id field to avoid duplicate key errors
    const { _id, ...configData } = body;
    
    // Create a new configuration with fresh data only
    const newConfig = await ConfigModel.create(configData);
    
    return NextResponse.json({
      success: true,
      data: newConfig,
    });
  } catch (error) {
    console.error('Error saving configuration:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save configuration' },
      { status: 500 }
    );
  }
} 