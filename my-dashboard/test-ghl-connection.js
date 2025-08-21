// ========================================
// 🎯 GHL CONNECTION TEST SCRIPT
// ========================================

// Simple test script to verify GHL API connection
// Run this after updating your token: node test-ghl-connection.js

const GHL_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com/locations/b7vHWUGVUNQGoIlAXabY',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f', // ⚠️ UPDATE THIS TOKEN ⚠️
  version: '2021-07-28',
};

const getGHLHeaders = () => ({
  Accept: 'application/json',
  Authorization: `Bearer ${GHL_CONFIG.token}`,
  'Content-Type': 'application/json',
  Version: GHL_CONFIG.version,
});

async function testGHLConnection() {
  console.log('🔍 Testing GHL API Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...');
    const response = await fetch(`${GHL_CONFIG.baseUrl}/tasks/search`, {
      method: 'POST',
      headers: getGHLHeaders(),
      body: JSON.stringify({
        completed: false,
      }),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful!');
      console.log(`📊 Found ${data.length || 0} tasks`);
    } else {
      const errorText = await response.text();
      console.log('❌ Connection failed!');
      console.log(`Error: ${errorText}`);
    }

  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }

  console.log('\n📝 Next steps:');
  console.log('1. Update the token in this file');
  console.log('2. Update the token in src/config/ghlConfig.js');
  console.log('3. Run this script again to test');
  console.log('4. Restart your React app');
}

testGHLConnection();
