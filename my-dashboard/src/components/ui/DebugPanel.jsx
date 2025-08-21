// ========================================
// 🐛 DEBUG PANEL COMPONENT
// ========================================

import { useState } from 'react';
import { testGHLConnection, testGHLTaskCreation } from '@utils/testGHLTaskCreation';
import { GHL_CONFIG, validateGHLConfig, GHL_TOKEN_INSTRUCTIONS } from '@config/ghlConfig';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async (testFunction, testName) => {
    setIsLoading(true);
    setTestResults(null);

    try {
      const result = await testFunction();
      setTestResults({
        testName,
        result,
        timestamp: new Date().toISOString(),
      });
      console.log(`${testName} Result:`, result);
    } catch (error) {
      setTestResults({
        testName,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      console.error(`${testName} Error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = () => runTest(testGHLConnection, 'GHL Connection Test');
  const handleTestTaskCreation = () => runTest(testGHLTaskCreation, 'GHL Task Creation Test');

  // Check configuration
  const configValidation = validateGHLConfig();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Test Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleTestConnection}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Testing...' : 'Test GHL Connection'}
          </button>

          <button
            onClick={handleTestTaskCreation}
            disabled={isLoading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Testing...' : 'Test Task Creation'}
          </button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-2">
              {testResults.testName}
            </h4>

            <div className="text-sm">
              <div className="mb-2">
                <strong>Status:</strong>{' '}
                <span className={testResults.result?.success ? 'text-green-600' : 'text-red-600'}>
                  {testResults.result?.success ? 'SUCCESS' : 'FAILED'}
                </span>
              </div>

              <div className="mb-2">
                <strong>Message:</strong>{' '}
                <span className="text-gray-700">
                  {testResults.result?.message || testResults.error}
                </span>
              </div>

              {testResults.result?.error && (
                <div className="mb-2">
                  <strong>Error:</strong>{' '}
                  <span className="text-red-600 text-xs">
                    {testResults.result.error}
                  </span>
                </div>
              )}

              <div className="text-xs text-gray-500">
                {testResults.timestamp}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Status */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-900 mb-2">GHL Configuration</h4>
          <div className="text-sm space-y-1">
            <div>
              <strong>Status:</strong>{' '}
              <span className={configValidation.isValid ? 'text-green-600' : 'text-red-600'}>
                {configValidation.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            {!configValidation.isValid && (
              <div className="text-red-600 text-xs">
                <strong>Issues:</strong>
                <ul className="list-disc list-inside mt-1">
                  {configValidation.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            <div><strong>Base URL:</strong> {GHL_CONFIG.baseUrl}</div>
            <div><strong>Token:</strong> {GHL_CONFIG.token.substring(0, 20)}...</div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-900 mb-2">Environment</h4>
          <div className="text-sm space-y-1">
            <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Build Time:</strong> {new Date().toLocaleString()}</div>
            <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</div>
          </div>
        </div>

        {/* Token Instructions */}
        {!configValidation.isValid && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
            <h4 className="font-semibold text-yellow-800 mb-2">How to Fix</h4>
            <div className="text-xs text-yellow-700 whitespace-pre-line">
              {GHL_TOKEN_INSTRUCTIONS}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;
