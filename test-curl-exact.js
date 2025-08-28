#!/usr/bin/env node

/**
 * 🧪 Test Free Slots API - Exact cURL Replication
 * 
 * This script replicates your exact curl command to test the free slots API
 * and compares it with our current implementation.
 */

// Your exact cURL parameters
const CURL_PARAMS = {
  calendarId: 'cF0lnbb4A2vCVdKQLrJp',
  startDate: '1756159200000', // milliseconds
  endDate: '1756161000000',   // milliseconds  
  timezone: 'America/Los_Angeles',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
  version: '2021-04-15'
};

console.log('🧪 Testing Free Slots API - Exact cURL Replication');
console.log('='.repeat(60));
console.log('\n📋 Test Parameters:');
console.log('   Calendar ID:', CURL_PARAMS.calendarId);
console.log('   Start Date:', new Date(parseInt(CURL_PARAMS.startDate)).toISOString());
console.log('   End Date:', new Date(parseInt(CURL_PARAMS.endDate)).toISOString());
console.log('   Timezone:', CURL_PARAMS.timezone);
console.log('   Token:', CURL_PARAMS.token.substring(0, 15) + '...');
console.log('   Version:', CURL_PARAMS.version);

async function testExactCurl() {
  try {
    console.log('\n🌐 Test 1: Direct cURL Replication');
    console.log('-'.repeat(40));
    
    // Build the exact URL from your curl command
    const url = `https://services.leadconnectorhq.com/calendars/${CURL_PARAMS.calendarId}/free-slots?startDate=${CURL_PARAMS.startDate}&endDate=${CURL_PARAMS.endDate}&timezone=${encodeURIComponent(CURL_PARAMS.timezone)}`;
    
    console.log('📡 Request URL:', url);
    
    // Make the exact same request as your curl
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${CURL_PARAMS.token}`,
        'Version': CURL_PARAMS.version
      }
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS! Response received:');
      console.log('🔍 Response keys:', Object.keys(data));
      console.log('🔍 Full response:', JSON.stringify(data, null, 2));
      
      // Check for slots in different possible locations
      let slots = [];
      if (data.slots) {
        slots = data.slots;
        console.log('📍 Found slots in "slots" property');
      } else if (data._dates_) {
        console.log('📍 Found "_dates_" property, extracting slots...');
        Object.keys(data._dates_).forEach(dateKey => {
          const dayData = data._dates_[dateKey];
          if (dayData && dayData.slots) {
            slots.push(...dayData.slots);
          }
        });
      } else if (Array.isArray(data)) {
        slots = data;
        console.log('📍 Response is array of slots');
      }
      
      console.log('\n🎯 Slots Summary:');
      console.log('   Total slots found:', slots.length);
      
      if (slots.length > 0) {
        console.log('\n🎉 SLOTS FOUND! First few slots:');
        slots.slice(0, 5).forEach((slot, i) => {
          console.log(`   ${i + 1}. ${JSON.stringify(slot)}`);
        });
      } else {
        console.log('\n⚠️ No slots found in response');
      }
      
    } else {
      const errorText = await response.text();
      console.log('\n❌ ERROR Response:');
      console.log('   Status:', response.status);
      console.log('   Error:', errorText);
      
      // Common error interpretations
      if (response.status === 401) {
        console.log('   💡 Likely cause: Invalid or expired API token');
      } else if (response.status === 403) {
        console.log('   💡 Likely cause: Insufficient permissions');
      } else if (response.status === 404) {
        console.log('   💡 Likely cause: Calendar not found or invalid calendar ID');
      }
    }
    
  } catch (error) {
    console.log('\n❌ Request failed:', error.message);
  }
}

async function testWithOurAPI() {
  try {
    console.log('\n🔧 Test 2: Using Our Current Implementation');
    console.log('-'.repeat(40));
    
    // Import our API
    const { fetchFreeSlots } = await import('./apps/dashboard/src/shared/services/api/freeSlotsApi.js');
    
    const result = await fetchFreeSlots({
      calendarId: CURL_PARAMS.calendarId,
      startDate: parseInt(CURL_PARAMS.startDate),
      endDate: parseInt(CURL_PARAMS.endDate),
      timeZone: CURL_PARAMS.timezone
    });
    
    console.log('📡 Our API Response:');
    console.log('   Success:', result.success);
    console.log('   Total slots:', result.totalSlots);
    console.log('   Error:', result.error || 'None');
    
    if (result.success && result.slots.length > 0) {
      console.log('\n✅ Our API found slots:');
      result.slots.slice(0, 3).forEach((slot, i) => {
        console.log(`   ${i + 1}. ${JSON.stringify(slot)}`);
      });
    } else if (result.error) {
      console.log('\n❌ Our API error:', result.error);
    }
    
  } catch (error) {
    console.log('\n❌ Our API test failed:', error.message);
  }
}

async function compareDateRanges() {
  console.log('\n📅 Test 3: Date Range Analysis');
  console.log('-'.repeat(40));
  
  const startMs = parseInt(CURL_PARAMS.startDate);
  const endMs = parseInt(CURL_PARAMS.endDate);
  
  const startDate = new Date(startMs);
  const endDate = new Date(endMs);
  const duration = (endMs - startMs) / 1000; // seconds
  const hours = duration / 3600;
  const days = duration / 86400;
  
  console.log('🕐 Date Range Details:');
  console.log('   Start:', startDate.toISOString());
  console.log('   End:', endDate.toISOString());
  console.log('   Duration:', `${duration} seconds (${hours.toFixed(2)} hours, ${days.toFixed(2)} days)`);
  console.log('   Date difference:', endDate.toDateString() === startDate.toDateString() ? 'Same day' : 'Different days');
  
  // Check if dates are in the future
  const now = new Date();
  console.log('   Current time:', now.toISOString());
  console.log('   Start is future:', startDate > now ? '✅ Yes' : '❌ No (past)');
  console.log('   End is future:', endDate > now ? '✅ Yes' : '❌ No (past)');
  
  if (startDate < now) {
    console.log('\n⚠️ WARNING: The date range is in the past!');
    console.log('   This might explain why no slots are returned.');
    console.log('   Try using future dates for testing.');
  }
}

// Run all tests
async function main() {
  await testExactCurl();
  await testWithOurAPI();
  await compareDateRanges();
  
  console.log('\n🎯 SUMMARY & RECOMMENDATIONS:');
  console.log('='.repeat(60));
  console.log('1. Check if the exact cURL command returns slots');
  console.log('2. Verify the calendar ID exists and is accessible');
  console.log('3. Ensure the API token has calendar permissions');
  console.log('4. Try with future dates if current dates are in the past');
  console.log('5. Compare response formats between direct cURL and our API');
}

main().catch(console.error);
