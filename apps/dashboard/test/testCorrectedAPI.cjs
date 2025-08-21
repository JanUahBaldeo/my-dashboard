#!/usr/bin/env node

/**
 * 🧪 QUICK TEST: Corrected GHL Calendar Events API
 * Tests the fixed API call that actually works
 */

const https = require('https');

// Configuration
const API_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
  version: '2021-04-15',
  locationId: 'b7vHWUGVUNQGoIlAXabY',
  calendarId: 'sV3BiXrjzbfo1tSUdyHO',
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.token}`,
        'Version': API_CONFIG.version,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            data: parsedData,
            rawData: data,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: null,
            rawData: data,
            parseError: error.message,
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Main test function
async function testCorrectedAPI() {
  console.log(`\n🚀 TESTING CORRECTED GHL CALENDAR EVENTS API`);
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  try {
    // Test the corrected API call with required startTime/endTime
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1); // 3 months ago
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0); // 3 months ahead
    
    const params = new URLSearchParams({
      locationId: API_CONFIG.locationId,
      calendarId: API_CONFIG.calendarId,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });
    
    const url = `${API_CONFIG.baseUrl}/calendars/events?${params.toString()}`;
    console.log(`\n🧪 Test URL: ${url}`);
    console.log(`📅 Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const result = await makeRequest(url);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 CORRECTED API TEST RESULTS`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📊 Response Status: ${result.status}`);
    console.log(`📏 Response Size: ${result.rawData ? result.rawData.length : 0} characters`);
    
    if (result.status === 200) {
      console.log(`✅ SUCCESS! API call is working correctly`);
      console.log(`🎪 Events Found: ${result.data?.events?.length || 0}`);
      
      if (result.data?.traceId) {
        console.log(`🔍 Trace ID: ${result.data.traceId}`);
      }
      
      if (result.data?.events?.length > 0) {
        console.log(`\n📅 Sample Events:`);
        result.data.events.slice(0, 3).forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.title || 'NO TITLE'} (${event.startTime})`);
        });
      } else {
        console.log(`\n📝 No events found in date range - this is expected if you haven't created any appointments yet`);
        console.log(`💡 The API is working correctly! Your calendar app will show mock events as fallback.`);
      }
    } else {
      console.log(`❌ API Error: ${result.status}`);
      console.log(`📄 Error Response:`, result.data);
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✨ SUMMARY`);
    console.log(`${'='.repeat(60)}`);
    
    if (result.status === 200) {
      console.log(`✅ Your cURL command has been CORRECTED and is now working!`);
      console.log(`✅ The calendar app will load real events when they exist.`);
      console.log(`✅ Mock events will show as fallback when no real events are found.`);
      console.log(`\n🎯 CORRECTED cURL command:`);
      console.log(`curl --request GET \\`);
      console.log(`  --url '${url}' \\`);
      console.log(`  --header 'Accept: application/json' \\`);
      console.log(`  --header 'Authorization: Bearer ${API_CONFIG.token}' \\`);
      console.log(`  --header 'Version: ${API_CONFIG.version}'`);
      console.log(`\n💡 KEY CHANGES MADE:`);
      console.log(`• ✅ Added REQUIRED startTime and endTime parameters`);
      console.log(`• ✅ Used specific calendarId instead of groupId (groupId approach had issues)`);
      console.log(`• ✅ Extended date range to 6 months for better event coverage`);
    } else {
      console.log(`❌ API call failed. Check your credentials and parameters.`);
    }
    
  } catch (error) {
    console.error(`\n💥 Test Error:`, error);
  }
}

// Run test
if (require.main === module) {
  testCorrectedAPI()
    .then(() => {
      console.log(`\n🎉 Test Complete!`);
      process.exit(0);
    })
    .catch(error => {
      console.error(`\n💥 Fatal Error:`, error);
      process.exit(1);
    });
}

module.exports = { testCorrectedAPI };
