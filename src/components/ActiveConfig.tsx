import { IConfig } from '@/models/ConfigModel';

interface ActiveConfigProps {
  config: IConfig;
  isLoading: boolean;
}

export default function ActiveConfig({ config, isLoading }: ActiveConfigProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Active Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Symbol</h3>
            <p className="mt-1 text-lg text-gray-900">{config.symbol}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Timeframe</h3>
            <p className="mt-1 text-lg text-gray-900">{config.timeframe}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">+DI Threshold</h3>
            <p className="mt-1 text-lg text-gray-900">{config.plusDIThreshold}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">-DI Threshold</h3>
            <p className="mt-1 text-lg text-gray-900">{config.minusDIThreshold}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">ADX Minimum</h3>
            <p className="mt-1 text-lg text-gray-900">{config.adxMinimum}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Take Profit %</h3>
            <p className="mt-1 text-lg text-gray-900">{config.takeProfitPercent}%</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Stop Loss %</h3>
            <p className="mt-1 text-lg text-gray-900">{config.stopLossPercent}%</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Leverage</h3>
            <p className="mt-1 text-lg text-gray-900">{config.leverage}x</p>
          </div>
        </div>
      </div>
    </div>
  );
} 