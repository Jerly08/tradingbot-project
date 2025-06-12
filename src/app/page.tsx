'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ConfigForm from '@/components/ConfigForm';
import ActiveConfig from '@/components/ActiveConfig';
import OrderTable from '@/components/OrderTable';
import { IConfig } from '@/models/ConfigModel';
import { IOrder } from '@/models/OrderModel';
import ClientOnly from '@/components/ClientOnly';

// Fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

export default function Home() {
  // State for active section (config or orders)
  const [activeSection, setActiveSection] = useState<'config' | 'orders'>('config');
  
  // MetaMask polyfill
  useEffect(() => {
    // This runs only on the client
    if (typeof window !== 'undefined' && !window.ethereum) {
      window.ethereum = null;
      console.log('MetaMask polyfill loaded (client-side)');
    }
  }, []);
  
  // Fetch config and orders
  const { 
    data: config, 
    error: _configError, 
    isLoading: configLoading,
    mutate: mutateConfig
  } = useSWR<IConfig>('/api/config', fetcher);
  
  const { 
    data: orders, 
    error: _ordersError, 
    isLoading: ordersLoading,
    mutate: mutateOrders
  } = useSWR<IOrder[]>('/api/orders', fetcher);
  
  // Handle config update
  const handleConfigUpdate = (newConfig: IConfig) => {
    mutateConfig(newConfig);
  };
  
  // Default config values
  const defaultConfig: IConfig = {
    symbol: 'BTCUSDT',
    timeframe: '5m',
    plusDIThreshold: 25,
    minusDIThreshold: 20,
    adxMinimum: 20,
    takeProfitPercent: 2,
    stopLossPercent: 1,
    leverage: 10,
  };
  
  // Setup polling for orders
  useEffect(() => {
    const interval = setInterval(() => {
      mutateOrders();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [mutateOrders]);
  
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Trading Bot Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Configure your DMI/ADX strategy and monitor automated trading signals
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeSection === 'config'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveSection('config')}
          >
            Configuration
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeSection === 'orders'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveSection('orders')}
          >
            Order History
          </button>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {activeSection === 'config' ? (
            <>
              {/* Configuration Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ClientOnly>
                  <ConfigForm 
                    defaultValues={config || defaultConfig} 
                    onSuccess={handleConfigUpdate} 
                  />
                </ClientOnly>
                <ActiveConfig 
                  config={config || defaultConfig}
                  isLoading={configLoading}
                />
              </div>
              
              {/* API Instructions */}
              <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-2xl font-bold mb-4">TradingView Webhook Setup</h2>
                <p className="mb-4">To receive signals from TradingView, use the following webhook URL in your alerts:</p>
                <ClientOnly>
                  <code className="block bg-gray-100 p-4 rounded">
                    {`${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/webhook`}
                  </code>
                </ClientOnly>
                <p className="mt-4">Example payload format:</p>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  {JSON.stringify({
                    symbol: 'BTCUSDT',
                    plusDI: 27.5,
                    minusDI: 15.0,
                    adx: 25.0,
                    timeframe: '5m'
                  }, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            /* Orders Section */
            <OrderTable orders={orders || []} isLoading={ordersLoading} />
          )}
        </div>
      </div>
    </main>
  );
}
