// Quick test of the slot parameters and check what's happening
import { fetchFreeSlots } from '../../apps/dashboard/src/shared/services/api/freeSlotsApi.js';

async function quickTest() {
  console.warn('🔍 Quick Test - Why No Slots?');

  // Test with a much wider date range - next 60 days
  const today = new Date();
  const startDate = Math.floor(today.getTime() / 1000);
  const endDate = Math.floor((today.getTime() + 60 * 24 * 60 * 60 * 1000) / 1000); // 60 days

  console.warn('📅 Testing 60-day range:');
  console.warn('  From:', new Date(startDate * 1000).toISOString());
  console.warn('  To:', new Date(endDate * 1000).toISOString());

  try {
    const result = await fetchFreeSlots({
      calendarId: 'U9qdnx6IVYmZTS1ccbiY', // Partner Consultation
      startDate: startDate * 1000, // Convert to milliseconds
      endDate: endDate * 1000, // Convert to milliseconds
      timeZone: 'America/Los_Angeles',
    });

    console.warn('📊 Result:', result.rawResponse);

    // The issue might be that this calendar has no working hours configured
    // Let's check what happens if we try a different approach

    if (Object.keys(result.rawResponse).length === 1 && result.rawResponse.traceId) {
      console.warn('');
      console.warn('🎯 DIAGNOSIS: Calendar returns only traceId');
      console.warn('📝 This means:');
      console.warn('   1. Calendar exists (no 404 error)');
      console.warn('   2. API call is authorized (no 401/403 error)');
      console.warn('   3. BUT: Calendar has NO AVAILABLE SLOTS configured');
      console.warn('');
      console.warn('🔧 POSSIBLE CAUSES:');
      console.warn('   • Calendar has no working hours set up');
      console.warn('   • Calendar has no team members assigned');
      console.warn('   • Calendar availability is set to "no slots available"');
      console.warn('   • Calendar is configured but not activated for booking');
      console.warn('');
      console.warn('💡 SOLUTION:');
      console.warn('   1. Go to your GHL account');
      console.warn('   2. Navigate to Calendar → Calendar Settings');
      console.warn('   3. Find "Partner Consultation" calendar');
      console.warn('   4. Set up Working Hours (e.g., Mon-Fri 9AM-5PM)');
      console.warn('   5. Assign team members to the calendar');
      console.warn('   6. Make sure calendar is Active');
      console.warn('   7. Set slot duration (e.g., 30 minutes)');
      console.warn('');
      console.warn('📋 VERIFICATION: After setup, slots should appear like:');
      console.warn('   { dates: { "2025-08-14": [{ startTime: "...", endTime: "..." }] } }');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
