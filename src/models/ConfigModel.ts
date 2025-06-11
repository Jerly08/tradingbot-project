import mongoose, { Schema } from 'mongoose';

// Define the type for the config document
export interface IConfig {
  symbol: string;
  timeframe: string;
  plusDIThreshold: number;
  minusDIThreshold: number;
  adxMinimum: number;
  takeProfitPercent: number;
  stopLossPercent: number;
  leverage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a schema with default values matching requirements
const ConfigSchema = new Schema<IConfig>(
  {
    symbol: {
      type: String,
      required: true,
      default: 'BTCUSDT',
    },
    timeframe: {
      type: String,
      required: true,
      default: '5m',
    },
    plusDIThreshold: {
      type: Number,
      required: true,
      default: 25,
    },
    minusDIThreshold: {
      type: Number,
      required: true,
      default: 20,
    },
    adxMinimum: {
      type: Number,
      required: true,
      default: 20,
    },
    takeProfitPercent: {
      type: Number,
      required: true,
      default: 2,
    },
    stopLossPercent: {
      type: Number,
      required: true,
      default: 1,
    },
    leverage: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent model overwrite errors
export default mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema); 