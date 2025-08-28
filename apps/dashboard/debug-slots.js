#!/usr/bin/env node

/**
 * 🔍 Slot Debugging Script
 * This script helps diagnose why slots are not showing in the appointment modal
 */

import { fetchFreeSlotsForDate } from './src/shared/services/api/freeSlotsApi.js';
import { convertSlotsToTimeSlots } from './src/shared/utils/freeSlotsUtils.js';

const TEST_CALENDAR_ID = 'b7vHWUGVUNQGoIlAXabY'; // From your config
const TEST_DATE = '2024-08-26'; // Today's date
const TEST_TIMEZONE = 'America/Los_Angeles';

async function debugSlotFetching() {
  console.log('🔍 SLOT DEBUGGING SCRIPT');
  console.log('========================\n');

  console.log('📋 Test Parameters:');
  console.log(`   Calendar ID: ${TEST_CALENDAR_ID}`);
  console.log(`   Date: ${TEST_DATE}`);
  console.log(`   Timezone: ${TEST_TIMEZONE}`);
  console.log('');

  try {
    // Step 1: Fetch raw slots from API
    console.log('📡 Step 1: Fetching slots from GHL API...');
    const response = await fetchFreeSlotsForDate(
      TEST_CALENDAR_ID,
      TEST_DATE,
      TEST_TIMEZONE,
    );

    console.log('✅ API Response received:');
    console.log(`   Success: ${response.success}`);
    console.log(`   Total slots: ${response.slots?.length || 0}`);
    console.log(`   Error: ${response.error || 'None'}`);

    if (response.rawResponse) {
      console.log('📋 Raw API Response Structure:');
      console.log(`   Keys: ${Object.keys(response.rawResponse)}`);
      console.log(`   Type: ${typeof response.rawResponse}`);
      console.log('   Full Response:', JSON.stringify(response.rawResponse, null, 2));
    }

    if (response.slots && response.slots.length > 0) {
      console.log('\n🎯 Found Slots:');
      response.slots.forEach((slot, index) => {
        console.log(`   [${index}] Type: ${typeof slot}, Value:`, slot);
      });

      // Step 2: Convert slots to time format
      console.log('\n🔄 Step 2: Converting to time slot format...');
      const timeSlots = convertSlotsToTimeSlots(response.slots, TEST_TIMEZONE);

      console.log('✅ Converted Time Slots:');
      if (timeSlots.length > 0) {
        timeSlots.forEach((slot, index) => {
          console.log(`   [${index}] ${slot}`);
        });
      } else {
        console.log('   ❌ No time slots generated from raw slots');
      }
    } else {
      console.log('\n❌ No slots found in response');

      if (response.dates) {
        console.log('📅 Checking _dates_ object:');
        console.log('   Keys:', Object.keys(response.dates));
        console.log('   Content:', JSON.stringify(response.dates, null, 2));
      }
    }

    // Step 3: Test different date formats
    console.log('\n🧪 Step 3: Testing different date formats...');
    const testDates = [
      new Date().toISOString().split('T')[0], // Today
      new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], // Tomorrow
      '2024-08-27', // Specific future date
    ];

    for (const testDate of testDates) {
      console.log(`\n📅 Testing date: ${testDate}`);
      try {
        const testResponse = await fetchFreeSlotsForDate(
          TEST_CALENDAR_ID,
          testDate,
          TEST_TIMEZONE,
        );
        console.log(`   Success: ${testResponse.success}`);
        console.log(`   Slots: ${testResponse.slots?.length || 0}`);
        if (testResponse.error) {
          console.log(`   Error: ${testResponse.error}`);
        }
      } catch (error) {
        console.log(`   Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
    console.error('Stack trace:', error.stack);
  }

  console.log('\n🎯 DEBUGGING CHECKLIST:');
  console.log('1. ✅ Check if GHL API token is valid');
  console.log('2. ✅ Verify calendar ID exists and is accessible');
  console.log('3. ✅ Ensure calendar has availability configured in GHL');
  console.log('4. ✅ Check if selected date has available slots');
  console.log('5. ✅ Verify timezone parameter is correct');
  console.log('6. ✅ Check browser console for additional errors');
}

// Run the debug script
debugSlotFetching().catch(console.error);
