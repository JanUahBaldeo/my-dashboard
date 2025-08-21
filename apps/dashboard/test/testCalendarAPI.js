/**
 * Test script to verify the GHL Calendar Events API fix
 * This tests the corrected parameters for the calendar events API
 */

// Set environment variable for testing
process.env.GHL_API_TOKEN = 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';

const { fetchCalendarEvents } = require('./src/shared/services/api/calendarApi');

async function testCalendarEventsAPI() {
  try {
    console.log('🧪 Testing GHL Calendar Events API with corrected parameters...');

    // Test with correct parameters
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 7); // 7 days from now

    const response = await fetchCalendarEvents({
      calendarId: 'sV3BiXrjzbfo1tSUdyHO', // Your specific calendar ID
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });

    console.log('✅ API call successful!');
    console.log('📊 Response summary:');
    console.log(`   - Success: ${response.success}`);
    console.log(`   - Events count: ${response.events ? response.events.length : 0}`);
    console.log(`   - Has events array: ${!!response.events}`);

    if (response.events && response.events.length > 0) {
      console.log('📅 Sample event:');
      console.log(JSON.stringify(response.events[0], null, 2));
    }

    return response;

  } catch (error) {
    console.error('❌ API call failed:', error.message);

    // Check if it's still the same 422 error
    if (error.message.includes('422')) {
      console.log('🚨 Still getting 422 error - parameters may need further adjustment');
      console.log('📝 Error details:', error.message);
    }

    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testCalendarEventsAPI()
    .then(result => {
      console.log('\n🎯 Test completed');
      if (result.success) {
        console.log('✅ API parameters are now correct!');
      }
    })
    .catch(console.error);
}

module.exports = { testCalendarEventsAPI };
