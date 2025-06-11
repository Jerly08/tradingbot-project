import mongoose, { Schema } from 'mongoose';

// Define the type for the order document
export interface IOrder {
  symbol: string;
  action: 'BUY' | 'SELL';
  priceEntry: number;
  tpPrice: number;
  slPrice: number;
  leverage: string;
  timeframe: string;
  timestamp: Date;
  status?: 'OPEN' | 'FILLED' | 'CANCELED' | 'TRIGGERED_TP' | 'TRIGGERED_SL';
  createdAt?: Date;
}

// Create the schema for the order
const OrderSchema = new Schema<IOrder>(
  {
    symbol: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['BUY', 'SELL'],
    },
    priceEntry: {
      type: Number,
      required: true,
    },
    tpPrice: {
      type: Number,
      required: true,
    },
    slPrice: {
      type: Number,
      required: true,
    },
    leverage: {
      type: String,
      required: true,
    },
    timeframe: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ['OPEN', 'FILLED', 'CANCELED', 'TRIGGERED_TP', 'TRIGGERED_SL'],
      default: 'OPEN',
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent model overwrite errors
export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema); 