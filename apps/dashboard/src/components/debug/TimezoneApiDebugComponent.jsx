// ========================================
// 🧪 Timezone API Debug Test Component
// ========================================

import React, { useState } from 'react';
import { GHL_CONFIG } from '@config/ghlConfig';

const TimezoneApiDebugComponent = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testTimezoneAPI = async () => {
    setLoading(true);
    setError(null);
    setTestResults(null);

    try {
      const locationId = GHL_CONFIG.locationId; // b7vHWUGVUNQGoIlAXabY

      console.warn('🧪 Testing timezone API with location:', locationId);

      const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/timezones`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${GHL_CONFIG.token}`,
          'Version': '2021-07-28',
        },
      });

      console.warn('📡 Response status:', response.status);
      console.warn('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.warn('📡 Raw response:', result);

      setTestResults({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: result,
        bodyKeys: result ? Object.keys(result) : [],
        bodyType: typeof result,
      });

    } catch (err) {
      console.error('❌ Timezone API test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testLocationAPI = async () => {
    setLoading(true);
    setError(null);
    setTestResults(null);

    try {
      const locationId = GHL_CONFIG.locationId;

      console.warn('🧪 Testing location API with location:', locationId);

      const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${GHL_CONFIG.token}`,
          'Version': GHL_CONFIG.version,
        },
      });

      const result = await response.json();
      console.warn('📡 Location API response:', result);

      setTestResults({
        endpoint: 'Location API',
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: result,
        bodyKeys: result ? Object.keys(result) : [],
        bodyType: typeof result,
      });

    } catch (err) {
      console.error('❌ Location API test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🧪 Timezone API Debug Test
        </h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Configuration</h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p><strong>Location ID:</strong> {GHL_CONFIG.locationId}</p>
            <p><strong>API Version (Timezone):</strong> 2021-07-28</p>
            <p><strong>API Version (Location):</strong> {GHL_CONFIG.version}</p>
            <p><strong>Token:</strong> {GHL_CONFIG.token?.slice(0, 20)}...</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={testTimezoneAPI}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? '🔄 Testing...' : '🧪 Test Timezone API'}
          </button>

          <button
            onClick={testLocationAPI}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {loading ? '🔄 Testing...' : '🧪 Test Location API'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
            <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {testResults && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ API Response</h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                <p><strong>Endpoint:</strong> {testResults.endpoint || 'Timezone API'}</p>
                <p><strong>Status:</strong> {testResults.status} {testResults.statusText}</p>
                <p><strong>Body Type:</strong> {testResults.bodyType}</p>
                <p><strong>Body Keys:</strong> [{testResults.bodyKeys.join(', ')}]</p>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                  📋 Show Full Response
                </summary>
                <div className="mt-2 max-h-96 overflow-y-auto">
                  <pre className="text-xs bg-gray-100 p-3 rounded">
                    {JSON.stringify(testResults.body, null, 2)}
                  </pre>
                </div>
              </details>

              <details className="mt-4">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                  📋 Show Headers
                </summary>
                <div className="mt-2 max-h-60 overflow-y-auto">
                  <pre className="text-xs bg-gray-100 p-3 rounded">
                    {JSON.stringify(testResults.headers, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneApiDebugComponent;
