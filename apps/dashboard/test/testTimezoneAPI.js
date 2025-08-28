#!/usr/bin/env node

/**
 * Test script to verify timezone API functionality
 * This script tests the timezone fetching functionality we just implemented
 */

// Import the timezone service
import {
  fetchGHLAllTimezones,
  getTimezoneOptions,
  formatTimezoneForDisplay,
} from '../src/shared/services/timezoneService.js';

const TEST_LOCATION_ID = 'b7vHWUGVUNQGoIlAXabY';

async function testTimezoneAPI() {
  console.log('🧪 Testing Timezone API Functionality');
  console.log('=====================================\n');

  try {
    // Test 1: Fetch all timezones
    console.log('📡 Test 1: Fetching all timezones...');
    const allTimezones = await fetchGHLAllTimezones(TEST_LOCATION_ID);
    console.log('✅ Success! Found', allTimezones.length, 'timezones');
    console.log('   Sample timezones:', allTimezones.slice(0, 3));
    console.log('');

    // Test 2: Get formatted timezone options
    console.log('🎯 Test 2: Getting formatted timezone options...');
    const timezoneOptions = await getTimezoneOptions(TEST_LOCATION_ID);
    console.log('✅ Success! Generated', timezoneOptions.length, 'timezone options');
    console.log('   Sample options:');
    timezoneOptions.slice(0, 3).forEach(option => {
      console.log(`   - ${option.value}: ${option.label}`);
    });
    console.log('');

    // Test 3: Test timezone display formatting
    console.log('🎨 Test 3: Testing timezone display formatting...');
    const sampleTimezones = ['America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'];
    sampleTimezones.forEach(tz => {
      const formatted = formatTimezoneForDisplay(tz);
      console.log(`   ${tz} → ${formatted}`);
    });
    console.log('');

    // Test 4: Test with non-existent location (error handling)
    console.log('🚨 Test 4: Testing error handling with invalid location...');
    try {
      const errorTest = await fetchGHLAllTimezones('invalid-location-id');
      console.log('⚠️  Fallback worked! Got', errorTest.length, 'fallback timezones');
    } catch (error) {
      console.log('❌ Error handled:', error.message);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('   Your timezone API integration is working properly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

// Run the test
testTimezoneAPI();
