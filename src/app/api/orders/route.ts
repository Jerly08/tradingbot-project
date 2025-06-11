import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import OrderModel from '@/models/OrderModel';

// GET handler to get all orders
export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all orders, sorted by most recent first
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get orders' },
      { status: 500 }
    );
  }
} 