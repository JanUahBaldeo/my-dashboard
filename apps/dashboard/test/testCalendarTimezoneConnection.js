/**
 * Test Calendar-Timezone Connection
 *
 * This script tests the new calendar-timezone service to ensure
 * calendars are properly connected to their timezones.
 */

import { GHL_CONFIG } from '../src/config/ghlConfig.js';
import { getCalendarTimezone, getCalendarTimezones } from '../src/shared/services/calendarTimezoneService.js';
import { getCalendarsList } from '../src/shared/services/api/ghlCalendarService.js';

async function testCalendarTimezoneConnection() {
  console.log('🧪 Testing Calendar-Timezone Connection...\n');

  try {
    // Test 1: Get calendar list with timezone info
    console.log('1️⃣ Testing enhanced calendar list with timezone info...');
    const calendarsResponse = await getCalendarsList(GHL_CONFIG.locationId);

    if (calendarsResponse.calendars) {
      console.log('✅ Found calendars:', calendarsResponse.calendars.length);

      // Show first few calendars with their timezone info
      const sampleCalendars = calendarsResponse.calendars.slice(0, 3);
      sampleCalendars.forEach(calendar => {
        console.log(`   📅 ${calendar.name || calendar.id}:`);
        console.log(`       ID: ${calendar.id}`);
        console.log(`       Timezone: ${calendar.timezone || 'Not set'}`);
        console.log(`       Display: ${calendar.timezoneDisplay || 'Not formatted'}`);
        console.log(`       Status: ${calendar.isActive ? 'Active' : 'Inactive'}`);
        console.log('');
      });
    } else {
      console.log('❌ No calendars found in response');
    }

    // Test 2: Get timezone for specific calendar
    if (calendarsResponse.calendars && calendarsResponse.calendars.length > 0) {
      const testCalendar = calendarsResponse.calendars[0];
      console.log('2️⃣ Testing timezone fetch for specific calendar...');
      console.log(`   Testing with calendar: ${testCalendar.id}`);

      const timezoneInfo = await getCalendarTimezone(testCalendar.id);
      console.log('✅ Calendar timezone info:');
      console.log('   Timezone:', timezoneInfo.timezone);
      console.log('   Display:', timezoneInfo.display);
      console.log('   Source:', timezoneInfo.source);
      console.log('   Calendar ID:', timezoneInfo.calendarId);
      console.log('');

      // Test 3: Get multiple calendar timezones
      console.log('3️⃣ Testing bulk timezone fetch...');
      const calendarIds = calendarsResponse.calendars.slice(0, 3).map(cal => cal.id);
      console.log(`   Testing with ${calendarIds.length} calendars:`, calendarIds);

      const timezoneMap = await getCalendarTimezones(calendarIds);
      console.log('✅ Bulk timezone results:');

      Object.entries(timezoneMap).forEach(([calendarId, timezoneInfo]) => {
        console.log(`   📅 ${calendarId}:`);
        console.log(`       Timezone: ${timezoneInfo.timezone}`);
        console.log(`       Source: ${timezoneInfo.source}`);
        console.log(`       Display: ${timezoneInfo.display}`);
      });
    }

    console.log('\n🎉 Calendar-Timezone connection test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testCalendarTimezoneConnection();
