import { fetchFreeSlots } from '../../apps/dashboard/src/shared/services/api/freeSlotsApi.js';

// Test to examine the actual GHL API response structure
async function examineGHLResponse() {
  console.log('🔍 Examining GHL Free Slots API Response Structure...\n');

  try {
    const calendarId = 'U9qdnx6IVYmZTS1ccbiY'; // Known working calendar
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = Math.floor(today.getTime() / 1000);
    const endDate = Math.floor((today.getTime() + 7 * 24 * 60 * 60 * 1000) / 1000); // 7 days

    console.log('📅 Request Parameters:');
    console.log('  Calendar ID:', calendarId);
    console.log('  Start Date:', new Date(startDate * 1000).toISOString());
    console.log('  End Date:', new Date(endDate * 1000).toISOString());
    console.log('  Date Range: 7 days from today\n');

    const result = await fetchGHLCalendarFreeSlots(
      calendarId,
      startDate,
      endDate,
      'America/Los_Angeles',
    );

    console.log('🔍 DETAILED API RESPONSE ANALYSIS:');
    console.log('\n1️⃣ Raw Response Structure:');
    console.log('   Type:', typeof result.rawResponse);
    console.log('   Keys:', Object.keys(result.rawResponse));
    console.log('   Raw Response:', JSON.stringify(result.rawResponse, null, 2));

    console.log('\n2️⃣ Response Properties Check:');
    console.log('   Has "slots" property:', 'slots' in result.rawResponse);
    console.log('   Has "dates" property:', 'dates' in result.rawResponse);
    console.log('   Has "timeSlots" property:', 'timeSlots' in result.rawResponse);
    console.log('   Has "availableSlots" property:', 'availableSlots' in result.rawResponse);
    console.log('   Has "freeSlots" property:', 'freeSlots' in result.rawResponse);
    console.log('   Has "events" property:', 'events' in result.rawResponse);

    console.log('\n3️⃣ Deep Property Values:');
    if (result.rawResponse.slots) {
      console.log('   slots value:', result.rawResponse.slots);
      console.log('   slots type:', typeof result.rawResponse.slots);
      console.log('   slots length:', Array.isArray(result.rawResponse.slots) ? result.rawResponse.slots.length : 'N/A');
    }

    if (result.rawResponse.dates) {
      console.log('   dates value:', result.rawResponse.dates);
      console.log('   dates type:', typeof result.rawResponse.dates);
      console.log('   dates keys:', typeof result.rawResponse.dates === 'object' ? Object.keys(result.rawResponse.dates) : 'N/A');
    }

    // Check for other possible property names
    const possibleSlotProperties = ['slots', 'timeSlots', 'availableSlots', 'freeSlots', 'events', 'data', 'results'];

    console.log('\n4️⃣ Searching for Slot Data in All Properties:');
    possibleSlotProperties.forEach(prop => {
      if (result.rawResponse[prop] !== undefined) {
        console.log(`   Found "${prop}":`, result.rawResponse[prop]);
        if (Array.isArray(result.rawResponse[prop])) {
          console.log(`   "${prop}" is array with ${result.rawResponse[prop].length} items`);
          if (result.rawResponse[prop].length > 0) {
            console.log(`   First item in "${prop}":`, result.rawResponse[prop][0]);
          }
        }
      }
    });

    console.log('\n5️⃣ Our Current Mapping Result:');
    console.log('   Mapped totalSlots:', result.totalSlots);
    console.log('   Mapped slots length:', result.slots.length);
    console.log('   Mapped dates keys:', Object.keys(result.dates));

    // Try to find slots in a different structure
    console.log('\n6️⃣ Alternative Slot Detection:');

    // Check if the response has nested structures
    for (const [key, value] of Object.entries(result.rawResponse)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        console.log(`   Checking nested object "${key}":`, Object.keys(value));
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (Array.isArray(nestedValue) && nestedValue.length > 0) {
            console.log(`   Found array in "${key}.${nestedKey}" with ${nestedValue.length} items:`, nestedValue[0]);
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Failed to examine GHL response:', error);
  }
}

examineGHLResponse();
