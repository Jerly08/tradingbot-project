import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IConfig } from '@/models/ConfigModel';
import axios from 'axios';

interface ConfigFormProps {
  defaultValues: IConfig;
  onSuccess: (data: IConfig) => void;
}

// Default initial values for the trading strategy
const initialDefaults: IConfig = {
  symbol: 'BTCUSDT',
  timeframe: '5m',
  plusDIThreshold: 25,
  minusDIThreshold: 20,
  adxMinimum: 20,
  takeProfitPercent: 2,
  stopLossPercent: 1,
  leverage: 10,
};

export default function ConfigForm({ defaultValues, onSuccess }: ConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IConfig>({
    defaultValues,
  });

  const onSubmit = async (data: IConfig) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Remove _id field if it exists to prevent duplicate key errors
      const { _id, ...configData } = data;
      
      console.log('Sending configuration data to server:', configData);
      const response = await axios.post('/api/config', configData);
      console.log('Server response:', response.data);
      
      onSuccess(response.data.data);
      reset(response.data.data);
    } catch (err) {
      console.error('Error saving configuration:', err);
      
      // More detailed error handling
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          
          const errorMessage = err.response.data?.message || 'Server returned an error';
          setError(`Failed to save configuration: ${errorMessage} (Status: ${err.response.status})`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          setError('Failed to save configuration: No response from server. Please check your network connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Failed to save configuration: ${err.message}`);
        }
      } else {
        setError('Failed to save configuration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to factory defaults
  const handleResetToDefaults = () => {
    reset(initialDefaults);
  };

  // Reset to last saved values
  const handleResetToSaved = () => {
    reset(defaultValues);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Trading Strategy Configuration</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Symbol */}
          <div>
            <label className="block text-gray-700 mb-2">Symbol</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('symbol', { required: 'Symbol is required' })}
            />
            {errors.symbol && (
              <p className="text-red-500 text-sm mt-1">{errors.symbol.message}</p>
            )}
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-gray-700 mb-2">Timeframe</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('timeframe', { required: 'Timeframe is required' })}
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="30m">30m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1d">1d</option>
            </select>
            {errors.timeframe && (
              <p className="text-red-500 text-sm mt-1">{errors.timeframe.message}</p>
            )}
          </div>

          {/* +DI Threshold */}
          <div>
            <label className="block text-gray-700 mb-2">+DI Threshold</label>
            <input
              type="number"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('plusDIThreshold', {
                required: '+DI Threshold is required',
                min: { value: 0, message: 'Must be greater than 0' },
                valueAsNumber: true,
              })}
            />
            {errors.plusDIThreshold && (
              <p className="text-red-500 text-sm mt-1">{errors.plusDIThreshold.message}</p>
            )}
          </div>

          {/* -DI Threshold */}
          <div>
            <label className="block text-gray-700 mb-2">-DI Threshold</label>
            <input
              type="number"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('minusDIThreshold', {
                required: '-DI Threshold is required',
                min: { value: 0, message: 'Must be greater than 0' },
                valueAsNumber: true,
              })}
            />
            {errors.minusDIThreshold && (
              <p className="text-red-500 text-sm mt-1">{errors.minusDIThreshold.message}</p>
            )}
          </div>

          {/* ADX Minimum */}
          <div>
            <label className="block text-gray-700 mb-2">ADX Minimum</label>
            <input
              type="number"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('adxMinimum', {
                required: 'ADX Minimum is required',
                min: { value: 0, message: 'Must be greater than 0' },
                valueAsNumber: true,
              })}
            />
            {errors.adxMinimum && (
              <p className="text-red-500 text-sm mt-1">{errors.adxMinimum.message}</p>
            )}
          </div>

          {/* Take Profit % */}
          <div>
            <label className="block text-gray-700 mb-2">Take Profit %</label>
            <input
              type="number"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('takeProfitPercent', {
                required: 'Take Profit % is required',
                min: { value: 0.1, message: 'Must be at least 0.1%' },
                valueAsNumber: true,
              })}
            />
            {errors.takeProfitPercent && (
              <p className="text-red-500 text-sm mt-1">{errors.takeProfitPercent.message}</p>
            )}
          </div>

          {/* Stop Loss % */}
          <div>
            <label className="block text-gray-700 mb-2">Stop Loss %</label>
            <input
              type="number"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('stopLossPercent', {
                required: 'Stop Loss % is required',
                min: { value: 0.1, message: 'Must be at least 0.1%' },
                valueAsNumber: true,
              })}
            />
            {errors.stopLossPercent && (
              <p className="text-red-500 text-sm mt-1">{errors.stopLossPercent.message}</p>
            )}
          </div>

          {/* Leverage */}
          <div>
            <label className="block text-gray-700 mb-2">Leverage</label>
            <input
              type="number"
              step="1"
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register('leverage', {
                required: 'Leverage is required',
                min: { value: 1, message: 'Must be at least 1' },
                max: { value: 125, message: 'Cannot exceed 125' },
                valueAsNumber: true,
              })}
            />
            {errors.leverage && (
              <p className="text-red-500 text-sm mt-1">{errors.leverage.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </button>
          <div className="inline-flex mt-4 sm:mt-0 ml-4">
            <button
              type="button"
              onClick={handleResetToSaved}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-l"
            >
              Reset to Saved
            </button>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-r border-l border-gray-400"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 