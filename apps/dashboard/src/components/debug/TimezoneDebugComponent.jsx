import React, { useState, useEffect } from 'react';
import { useAppInitialization, useTimezone } from '@shared/hooks/useAppInitialization';
import { fetchGHLTimezone, getCurrentTimezone, getTimezoneInfo } from '@services/timezoneService';
import { GHL_CONFIG } from '@config/ghlConfig';
import { createLogger } from '@utils/logger';

const debugLogger = createLogger('TimezoneDebug');

/**
 * 🌍 Timezone Debug Component
 * Shows real-time timezone information from GHL API
 */
const TimezoneDebugComponent = () => {
  const [manualTimezone, setManualTimezone] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState(null);
  const [timezoneServiceInfo, setTimezoneServiceInfo] = useState(null);

  // Use the app initialization hook
  const { isInitialized, isLoading, error, timezone } = useAppInitialization();
  const timezoneHook = useTimezone();

  useEffect(() => {
    // Get timezone service info
    try {
      const info = getTimezoneInfo();
      setTimezoneServiceInfo(info);
    } catch (err) {
      debugLogger.warn('Could not get timezone service info:', err);
    }
  }, []);

  const handleManualFetch = async () => {
    setManualLoading(true);
    setManualError(null);

    try {
      debugLogger.info('🌍 Manually fetching timezone...');
      const fetchedTimezone = await fetchGHLTimezone(GHL_CONFIG.locationId);
      setManualTimezone(fetchedTimezone);
      debugLogger.success('✅ Manual fetch successful:', fetchedTimezone);
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      setManualError(errorMessage);
      debugLogger.error('❌ Manual fetch failed:', error);
    } finally {
      setManualLoading(false);
    }
  };

  const currentTime = new Date();
  const currentTimezoneFromService = getCurrentTimezone();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          🌍 GHL Timezone Debug Panel
        </h2>
        <p className="text-gray-600">
          Testing real timezone fetching from GoHighLevel API
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* App Initialization Status */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">🚀 App Initialization</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Status:</span>
              <span className={`font-semibold ${isLoading ? 'text-yellow-600' : isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                {isLoading ? '⏳ Loading...' : isInitialized ? '✅ Initialized' : '❌ Failed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Timezone:</span>
              <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                {timezone || 'N/A'}
              </span>
            </div>
            {error && (
              <div className="mt-2">
                <span className="text-red-600 text-sm">❌ {error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timezone Hook Status */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">🕐 Timezone Hook</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Current TZ:</span>
              <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                {timezoneHook.timezone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Ready:</span>
              <span className={`font-semibold ${timezoneHook.isReady() ? 'text-green-600' : 'text-red-600'}`}>
                {timezoneHook.isReady() ? '✅ Ready' : '❌ Not Ready'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Name:</span>
              <span className="text-sm">
                {timezoneHook.getTimezoneInfo().name}
              </span>
            </div>
          </div>
        </div>

        {/* Manual Timezone Fetch */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3">🔧 Manual Fetch</h3>
          <div className="space-y-3">
            <button
              onClick={handleManualFetch}
              disabled={manualLoading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {manualLoading ? '⏳ Fetching...' : '🌍 Fetch Timezone Now'}
            </button>

            {manualTimezone && (
              <div className="text-sm">
                <span className="text-gray-700">Result:</span>
                <div className="font-mono bg-white px-2 py-1 rounded mt-1">
                  {manualTimezone}
                </div>
              </div>
            )}

            {manualError && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                ❌ {manualError}
              </div>
            )}
          </div>
        </div>

        {/* Service Information */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Service Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Service TZ:</span>
              <span className="font-mono bg-white px-2 py-1 rounded">
                {currentTimezoneFromService || 'N/A'}
              </span>
            </div>
            {timezoneServiceInfo && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-700">Location ID:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    {timezoneServiceInfo.locationId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Initialized:</span>
                  <span className={`font-semibold ${timezoneServiceInfo.isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                    {timezoneServiceInfo.isInitialized ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-3">🕐 Time Display</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Local Time</div>
            <div className="font-mono text-lg bg-white px-3 py-2 rounded">
              {currentTime.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">UTC Time</div>
            <div className="font-mono text-lg bg-white px-3 py-2 rounded">
              {currentTime.toUTCString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">GHL Timezone</div>
            <div className="font-mono text-lg bg-white px-3 py-2 rounded">
              {timezone ? currentTime.toLocaleString('en-US', { timeZone: timezone }) : 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {timezone || 'No timezone available'}
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-3">⚙️ API Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-700 font-medium">Location ID:</span>
            <div className="font-mono bg-white px-2 py-1 rounded mt-1">
              {GHL_CONFIG.locationId}
            </div>
          </div>
          <div>
            <span className="text-gray-700 font-medium">API Token:</span>
            <div className="font-mono bg-white px-2 py-1 rounded mt-1">
              {GHL_CONFIG.token.substring(0, 15)}...
            </div>
          </div>
          <div>
            <span className="text-gray-700 font-medium">Timezone Endpoint:</span>
            <div className="font-mono bg-white px-2 py-1 rounded mt-1 text-xs">
              /locations/{'{locationId}'}/timezones
            </div>
          </div>
          <div>
            <span className="text-gray-700 font-medium">API Version:</span>
            <div className="font-mono bg-white px-2 py-1 rounded mt-1">
              2021-07-28
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimezoneDebugComponent;
