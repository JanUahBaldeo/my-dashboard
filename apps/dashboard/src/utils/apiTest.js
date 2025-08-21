// ========================================
// 🧪 API TEST UTILITY
// ========================================
// Quick test to verify if the GHL API endpoints are working
// Run this to check if the 404 error is resolved

import { fetchAppointments, fetchCalendarEvents, getGhlCalendarList } from '@shared/services/api/calendarApi';

// Test function to check if the API is working
export const testGhlApi = async () => {
  console.log('🧪 Testing GHL API endpoints...');

  try {
    // Test 1: Calendar List
    console.log('📅 Testing calendar list...');
    const calendarResponse = await getGhlCalendarList();
    console.log('Calendar List Result:', calendarResponse);

    // Test 2: Calendar Events
    console.log('📆 Testing calendar events...');
    const now = new Date();
    const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ahead

    const eventsResponse = await fetchCalendarEvents({
      locationId: 'b7vHWUGVUNQGoIlAXabY',
      calendarId: 'sV3BiXrjzbfo1tSUdyHO',
      startTime,
      endTime,
    });
    console.log('Calendar Events Result:', eventsResponse);

    // Test 3: Appointments (Fixed Function)
    console.log('📋 Testing appointments...');
    const appointmentsResponse = await fetchAppointments({
      startTime,
      endTime,
    });
    console.log('Appointments Result:', appointmentsResponse);

    // Summary
    const results = {
      calendars: calendarResponse.success,
      events: eventsResponse.success,
      appointments: appointmentsResponse.success,
    };

    console.log('🎯 API Test Summary:', results);

    if (results.calendars && results.events && results.appointments) {
      console.log('✅ All API endpoints are working! 404 error should be resolved.');
    } else {
      console.log('❌ Some API endpoints are still failing.');
    }

    return results;

  } catch (error) {
    console.error('🚨 API Test Failed:', error);
    return { error: error.message };
  }
};

// Auto-run test if in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to auto-test on import
  // testGhlApi();
}

export default testGhlApi;
