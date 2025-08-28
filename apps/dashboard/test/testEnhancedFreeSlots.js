/**
 * Test Enhanced Free Slots with Calendar Timezone
 *
 * This script tests the enhanced free slots API that automatically
 * detects and uses the correct timezone for each calendar.
 */

import { fetchFreeSlotsForDate } from '../src/shared/services/api/freeSlotsApi.js';
import { getCalendarsList } from '../src/shared/services/api/ghlCalendarService.js';
import { GHL_CONFIG } from '../src/config/ghlConfig.js';

async function testEnhancedFreeSlots() {
  console.log('🧪 Testing Enhanced Free Slots with Calendar Timezone...\n');

  try {
    // Get calendar list first
    console.log('1️⃣ Getting calendar list...');
    const calendarsResponse = await getCalendarsList(GHL_CONFIG.locationId);

    if (!calendarsResponse.calendars || calendarsResponse.calendars.length === 0) {
      console.log('❌ No calendars found');
      return;
    }

    const activeCalendars = calendarsResponse.calendars.filter(cal => cal.isActive !== false);
    console.log(`✅ Found ${activeCalendars.length} active calendars`);

    // Test with the first active calendar
    const testCalendar = activeCalendars[0];
    console.log(`\n2️⃣ Testing free slots with calendar: ${testCalendar.name || testCalendar.id}`);
    console.log(`   Calendar ID: ${testCalendar.id}`);
    console.log(`   Calendar Timezone: ${testCalendar.timezone || 'Not specified'}`);

    // Test date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(`   Test Date: ${tomorrow.toDateString()}`);

    // Test 1: Without providing timezone (auto-detect)
    console.log('\n3️⃣ Testing auto-detection of calendar timezone...');
    const autoDetectResponse = await fetchFreeSlotsForDate(testCalendar.id, tomorrow);

    console.log('✅ Auto-detect response:');
    console.log('   Success:', autoDetectResponse.success);
    console.log('   Total Slots:', autoDetectResponse.totalSlots);
    console.log('   Detected Timezone:', autoDetectResponse.meta?.detectedTimezone);
    console.log('   Timezone Source:', autoDetectResponse.meta?.timezoneSource);

    if (autoDetectResponse.slots.length > 0) {
      console.log('   Sample Slots:', autoDetectResponse.slots.slice(0, 3));
    }

    // Test 2: With manually provided timezone
    console.log('\n4️⃣ Testing with manually provided timezone...');
    const manualTimezone = 'America/New_York';
    const manualResponse = await fetchFreeSlotsForDate(testCalendar.id, tomorrow, manualTimezone);

    console.log('✅ Manual timezone response:');
    console.log('   Success:', manualResponse.success);
    console.log('   Total Slots:', manualResponse.totalSlots);
    console.log('   Used Timezone:', manualResponse.meta?.timeZone || manualTimezone);
    console.log('   Timezone Source:', manualResponse.meta?.timezoneSource);

    // Compare results
    console.log('\n5️⃣ Comparing results...');
    console.log('   Auto-detect slots:', autoDetectResponse.totalSlots);
    console.log('   Manual timezone slots:', manualResponse.totalSlots);

    if (autoDetectResponse.meta?.detectedTimezone) {
      console.log('   Auto-detected timezone:', autoDetectResponse.meta.detectedTimezone);
      console.log('   Manual timezone:', manualTimezone);

      if (autoDetectResponse.meta.detectedTimezone === manualTimezone) {
        console.log('   ✅ Timezones match - results should be similar');
      } else {
        console.log('   ⚠️ Different timezones - slot counts may differ');
      }
    }

    console.log('\n🎉 Enhanced free slots test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testEnhancedFreeSlots();
