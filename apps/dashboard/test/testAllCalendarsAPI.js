#!/usr/bin/env node

/**
 * 🧪 GHL ALL CALENDARS API DIAGNOSTIC SCRIPT
 * Tests the new endpoint that fetches events from ALL calendars in the group
 * Based on your provided cURL command
 */

const https = require('https');
const util = require('util');

// Configuration from your cURL command
const API_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
  version: '2021-04-15',
  locationId: 'b7vHWUGVUNQGoIlAXabY',
  groupId: 'FIt5F2PbZVrK846aJeJF',
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
            headers: res.headers,
            data: parsedData,
            rawData: data,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
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

// Format and display results
function displayResults(title, result) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎯 ${title}`);
  console.log(`${'='.repeat(60)}`);
  
  console.log(`\n📊 Response Status: ${result.status}`);
  console.log(`📏 Response Size: ${result.rawData ? result.rawData.length : 0} characters`);
  
  if (result.parseError) {
    console.log(`❌ JSON Parse Error: ${result.parseError}`);
    console.log(`📄 Raw Response:`, result.rawData);
    return;
  }
  
  if (result.data) {
    console.log(`\n📋 Response Structure:`);
    
    // Show the main structure
    if (typeof result.data === 'object') {
      const keys = Object.keys(result.data);
      console.log(`   Keys: [${keys.join(', ')}]`);
      
      // Show events if present
      if (result.data.events) {
        console.log(`\n🎪 Events Found: ${result.data.events.length}`);
        
        if (result.data.events.length > 0) {
          console.log(`\n📅 Sample Events (first 3):`);
          result.data.events.slice(0, 3).forEach((event, index) => {
            console.log(`\n   Event ${index + 1}:`);
            console.log(`     ID: ${event.id || 'N/A'}`);
            console.log(`     Title: ${event.title || 'N/A'}`);
            console.log(`     Start: ${event.startTime || 'N/A'}`);
            console.log(`     End: ${event.endTime || 'N/A'}`);
            console.log(`     Calendar ID: ${event.calendarId || 'N/A'}`);
            console.log(`     Status: ${event.appointmentStatus || 'N/A'}`);
            console.log(`     Contact ID: ${event.contactId || 'N/A'}`);
          });
          
          // Show all event IDs for debugging
          console.log(`\n🆔 All Event IDs:`);
          result.data.events.forEach((event, index) => {
            console.log(`   ${index + 1}. ${event.id || 'NO-ID'} - ${event.title || 'NO-TITLE'}`);
          });
        }
      }
      
      // Show metadata if present
      if (result.data.meta) {
        console.log(`\n📊 Metadata:`, util.inspect(result.data.meta, { colors: true, depth: 2 }));
      }
      
      // Show pagination info if present
      if (result.data.pagination) {
        console.log(`\n📖 Pagination:`, util.inspect(result.data.pagination, { colors: true, depth: 1 }));
      }
      
    } else {
      console.log(`📄 Response Data:`, util.inspect(result.data, { colors: true, depth: 3 }));
    }
  }
}

// Main diagnostic function
async function runAllCalendarsDiagnostics() {
  console.log(`\n🚀 STARTING GHL ALL CALENDARS API DIAGNOSTICS`);
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🎯 Endpoint: ${API_CONFIG.baseUrl}/calendars/events`);
  console.log(`🔑 Location ID: ${API_CONFIG.locationId}`);
  console.log(`👥 Group ID: ${API_CONFIG.groupId}`);
  
  try {
    // Test 1: Basic request with just locationId and groupId (your exact cURL)
    const params1 = new URLSearchParams({
      locationId: API_CONFIG.locationId,
      groupId: API_CONFIG.groupId,
    });
    
    const url1 = `${API_CONFIG.baseUrl}/calendars/events?${params1.toString()}`;
    console.log(`\n🧪 Test 1 URL: ${url1}`);
    
    const result1 = await makeRequest(url1);
    displayResults('ALL CALENDARS EVENTS (Basic Request)', result1);
    
    // Test 2: With date range (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const params2 = new URLSearchParams({
      locationId: API_CONFIG.locationId,
      groupId: API_CONFIG.groupId,
      startTime: startOfMonth.toISOString(),
      endTime: endOfMonth.toISOString(),
    });
    
    const url2 = `${API_CONFIG.baseUrl}/calendars/events?${params2.toString()}`;
    console.log(`\n🧪 Test 2 URL: ${url2}`);
    console.log(`📅 Date Range: ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`);
    
    const result2 = await makeRequest(url2);
    displayResults('ALL CALENDARS EVENTS (With Date Range)', result2);
    
    // Test 3: With extended date range (last 30 days to next 30 days)
    const past30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const future30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const params3 = new URLSearchParams({
      locationId: API_CONFIG.locationId,
      groupId: API_CONFIG.groupId,
      startTime: past30Days.toISOString(),
      endTime: future30Days.toISOString(),
    });
    
    const url3 = `${API_CONFIG.baseUrl}/calendars/events?${params3.toString()}`;
    console.log(`\n🧪 Test 3 URL: ${url3}`);
    console.log(`📅 Extended Range: ${past30Days.toISOString()} to ${future30Days.toISOString()}`);
    
    const result3 = await makeRequest(url3);
    displayResults('ALL CALENDARS EVENTS (Extended Date Range)', result3);
    
    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 DIAGNOSTIC SUMMARY`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Test 1 (Basic): ${result1.status} - ${result1.data?.events?.length || 0} events`);
    console.log(`✅ Test 2 (Month): ${result2.status} - ${result2.data?.events?.length || 0} events`);
    console.log(`✅ Test 3 (Extended): ${result3.status} - ${result3.data?.events?.length || 0} events`);
    
    // Recommendations
    console.log(`\n💡 RECOMMENDATIONS:`);
    const totalEvents = [result1, result2, result3]
      .map(r => r.data?.events?.length || 0)
      .reduce((max, current) => Math.max(max, current), 0);
    
    if (totalEvents === 0) {
      console.log(`❌ No events found in any test. This could mean:`);
      console.log(`   • No appointments exist in the date ranges tested`);
      console.log(`   • The groupId may not contain any calendars with events`);
      console.log(`   • Check if appointments exist in the GHL backend`);
      console.log(`   • Verify the locationId and groupId are correct`);
    } else {
      console.log(`✅ Found events! Use the extended date range for better coverage.`);
      console.log(`✅ The API is working correctly with your credentials.`);
    }
    
  } catch (error) {
    console.error(`\n❌ DIAGNOSTIC ERROR:`, error);
  }
}

// Run diagnostics
if (require.main === module) {
  runAllCalendarsDiagnostics()
    .then(() => {
      console.log(`\n🎉 All Calendars Diagnostics Complete!`);
      process.exit(0);
    })
    .catch(error => {
      console.error(`\n💥 Fatal Error:`, error);
      process.exit(1);
    });
}

module.exports = { runAllCalendarsDiagnostics, makeRequest, API_CONFIG };
