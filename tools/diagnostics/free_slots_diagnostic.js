// ========================================
// 🔍 FREE SLOTS DIAGNOSTIC SCRIPT
// ========================================
// This script will help debug why real GHL slots aren't being fetched

import { fetchFreeSlots } from '../../apps/dashboard/src/shared/services/api/freeSlotsApi.js';
import { GHL_CONFIG } from '../../apps/dashboard/src/config/ghlConfig.js';

async function diagnoseFreeSlots() {
  console.log('🔍 Starting Free Slots Diagnostic...\n');

  // Step 1: Check GHL configuration
  console.log('1️⃣ GHL Configuration Check:');
  console.log('   📋 Token:', GHL_CONFIG.token.substring(0, 15) + '...');
  console.log('   📋 Location ID:', GHL_CONFIG.locationId);
  console.log('   📋 Base URL:', GHL_CONFIG.baseUrl);
  console.log('   📋 Version:', GHL_CONFIG.version);
  console.log('');

  // Step 2: Test calendars endpoint first
  console.log('2️⃣ Testing Calendars List Endpoint...');
  try {
    const calendarsResponse = await fetch('https://services.leadconnectorhq.com/calendars/', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': GHL_CONFIG.version,
      },
    });

    if (calendarsResponse.ok) {
      const calendarsData = await calendarsResponse.json();
      console.log('   ✅ Calendars endpoint works!');
      console.log('   📅 Found calendars:', calendarsData.calendars?.length || 0);
      
      if (calendarsData.calendars?.length > 0) {
        console.log('   📋 First calendar:');
        const firstCalendar = calendarsData.calendars[0];
        console.log('      ID:', firstCalendar.id);
        console.log('      Name:', firstCalendar.name);
        console.log('      Active:', firstCalendar.isActive);
        
        // Step 3: Test free slots with the first calendar
        console.log('\n3️⃣ Testing Free Slots for First Calendar...');
        await testFreeSlots(firstCalendar.id, firstCalendar.name);
      }
    } else {
      const errorText = await calendarsResponse.text();
      console.log('   ❌ Calendars endpoint failed:', calendarsResponse.status);
      console.log('   📋 Error:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Error testing calendars endpoint:', error.message);
  }

  // Step 4: Test with a known calendar ID if provided
  console.log('\n4️⃣ Testing with Common Calendar IDs...');
  const commonCalendarIds = [
    'sV3BiXrjzbfo1tSUdyHO', // From examples
    'U9qdnx6IVYmZTS1ccbiY', // From examples
  ];

  for (const calendarId of commonCalendarIds) {
    console.log(`\n   📅 Testing calendar: ${calendarId}`);
    await testFreeSlots(calendarId, `Test-${calendarId}`);
  }
}

async function testFreeSlots(calendarId, calendarName) {
  try {
    // Get today and tomorrow for testing
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log(`   🎯 Testing free slots for "${calendarName}" (${calendarId})`);
    console.log(`      📅 Date range: ${today.toDateString()} - ${tomorrow.toDateString()}`);

    const result = await fetchFreeSlots({
      calendarId,
      startDate: today,
      endDate: tomorrow,
      timeZone: 'America/Los_Angeles',
    });

    console.log(`      ✅ API call completed`);
    console.log(`      📊 Success:`, result.success);
    console.log(`      🔢 Slots found:`, result.slots?.length || 0);
    
    if (result.error) {
      console.log(`      ⚠️ Error:`, result.error);
    }

    if (result.rawResponse) {
      console.log(`      🔍 Raw response keys:`, Object.keys(result.rawResponse));
      if (result.rawResponse.message) {
        console.log(`      💬 API message:`, result.rawResponse.message);
      }
    }

    // Show first few slots if any
    if (result.slots?.length > 0) {
      console.log(`      🎉 REAL SLOTS FOUND! First 3:`);
      result.slots.slice(0, 3).forEach((slot, index) => {
        console.log(`         ${index + 1}. ${JSON.stringify(slot)}`);
      });
    }

  } catch (error) {
    console.log(`      ❌ Error testing ${calendarName}:`, error.message);
  }
}

// Run the diagnostic
diagnoseFreeSlots().catch(console.error);
