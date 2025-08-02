// ========================================
// 🌍 ENVIRONMENT CONFIGURATION
// ========================================

// API Configuration
export const API_CONFIG = {
  LEAD_CONNECTOR: {
    baseUrl: 'https://services.leadconnectorhq.com',
    token: import.meta.env.VITE_LEAD_CONNECTOR_TOKEN || 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
    locationId: import.meta.env.VITE_LEAD_CONNECTOR_LOCATION_ID || 'b7vHWUGVUNQGoIlAXabY',
    version: '2021-07-28',
  },
};

// Environment detection
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_CONSOLE_LOGGING: isDevelopment,
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_AUTO_REFRESH: false,
  ENABLE_ERROR_BOUNDARIES: true,
};

// API endpoints
export const API_ENDPOINTS = {
  CONTACTS: '/contacts/',
  TAGS: '/tags/',
  CUSTOM_FIELDS: '/custom-fields/',
};

// Pipeline configuration
export const PIPELINE_CONFIG = {
  STAGES: [
    { title: 'New Lead', color: 'bg-teal-600', icon: '👤' },
    { title: 'Contacted', color: 'bg-gray-500', icon: '📞' },
    { title: 'Application Started', color: 'bg-blue-500', icon: '📝' },
    { title: 'Pre-Approved', color: 'bg-red-500', icon: '✅' },
    { title: 'In Underwriting', color: 'bg-orange-500', icon: '🔍' },
    { title: 'Closed', color: 'bg-green-500', icon: '🎯' },
  ],
  STAGE_TAGS: {
    'New Lead': ['New Lead'],
    'Contacted': ['Contacted'],
    'Application Started': ['Application Started'],
    'Pre-Approved': ['Pre-Approved'],
    'In Underwriting': ['In Underwriting'],
    'Closed': ['Closed'],
  },
  REFRESH_INTERVAL: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};
