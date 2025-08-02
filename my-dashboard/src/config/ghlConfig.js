// ========================================
// 🎯 GHL API CONFIGURATION
// ========================================

// GoHighLevel API Configuration
export const GHL_CONFIG = {
  // Base URL for your GHL location
  baseUrl: 'https://services.leadconnectorhq.com/locations/b7vHWUGVUNQGoIlAXabY',

  // API Token - Update this with your valid token
  // Get this from: GoHighLevel Dashboard → Settings → API → Private App Tokens
  // ⚠️  REPLACE THIS TOKEN WITH YOUR NEW ONE ⚠️
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',

  // API Version
  version: '2021-07-28',

  // Location ID (extracted from baseUrl)
  locationId: 'b7vHWUGVUNQGoIlAXabY',
};

// Environment-specific overrides
const ENV_CONFIG = {
  development: {
    // Add any development-specific settings here
    debugMode: true,
    logLevel: 'debug',
  },
  production: {
    // Add any production-specific settings here
    debugMode: false,
    logLevel: 'error',
  },
};

// Get current environment config
export const getEnvConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// Validate GHL configuration
export const validateGHLConfig = () => {
  const issues = [];

  if (!GHL_CONFIG.token || GHL_CONFIG.token === 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f') {
    issues.push('GHL API token needs to be updated with a valid token');
  }

  if (!GHL_CONFIG.baseUrl.includes('leadconnectorhq.com')) {
    issues.push('GHL base URL appears to be invalid');
  }

  if (!GHL_CONFIG.locationId) {
    issues.push('GHL location ID is missing');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};

// Get API headers for requests
export const getGHLHeaders = () => ({
  Accept: 'application/json',
  Authorization: `Bearer ${GHL_CONFIG.token}`,
  'Content-Type': 'application/json',
  Version: GHL_CONFIG.version,
});

// Instructions for getting a new token
export const GHL_TOKEN_INSTRUCTIONS = `
To get a new GHL API token:

1. Log into your GoHighLevel account
2. Go to Settings → API → Private App Tokens
3. Click "Create New Token"
4. Give it a name (e.g., "Dashboard Integration")
5. Select the necessary permissions:
   - Tasks: Read, Write
   - Contacts: Read
   - Users: Read
6. Copy the generated token
7. Update the 'token' field in src/config/ghlConfig.js
8. Restart the application

Note: Tokens can expire, so you may need to regenerate them periodically.
`;

export default GHL_CONFIG;
