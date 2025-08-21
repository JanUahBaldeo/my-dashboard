// ========================================
// 🧪 GHL APPOINTMENTS API TEST
// ========================================
// Test script to verify the GHL appointments endpoint

const testGHLAppointments = async () => {
  console.log('🧪 Testing GHL Appointments API...');
  
  const locationId = 'b7vHWUGVUNQGoIlAXabY';
  const calendarIds = [
    'FIt5F2PbZVrK846aJeJF', // Book With Jonathan Ferrell
    'U9qdnx6IVYmZTS1ccbiY', // Partner Consultation
    'cF0lnbb4A2vCVdKQLrJp', // Book Now With Gmail
    'sV3BiXrjzbfo1tSUdyHO', // Ricky's Personal Calendar
  ];

  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
    'Version': '2021-04-15',
  };

  console.log('📋 Available calendars to test:', calendarIds);

  // Test each calendar
  for (const calendarId of calendarIds) {
    console.log(`\n🔍 Testing calendar: ${calendarId}`);
    
    try {
      // Test calendar events endpoint
      const params = new URLSearchParams();
      params.append('locationId', locationId);
      params.append('calendarId', calendarId);
      params.append('startTime', '2024-01-01T00:00:00.000Z');
      params.append('endTime', '2025-12-31T23:59:59.999Z');

      const response = await fetch(
        `https://services.leadconnectorhq.com/calendars/events?${params.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        console.error(`❌ HTTP error for calendar ${calendarId}:`, response.status);
        continue;
      }

      const data = await response.json();
      console.log(`📊 Calendar ${calendarId} events:`, data.events?.length || 0);
      
      if (data.events?.length > 0) {
        console.log('📅 Sample events:', data.events.slice(0, 2));
      }

    } catch (error) {
      console.error(`💥 Error testing calendar ${calendarId}:`, error);
    }
  }

  // Test if we can create a test appointment
  console.log('\n🧪 Testing appointment creation...');
  
  try {
    const testAppointment = {
      title: 'Test Appointment from API',
      calendarId: 'sV3BiXrjzbfo1tSUdyHO', // Ricky's calendar
      locationId: locationId,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // +30 minutes
      appointmentStatus: 'confirmed',
      assignedUserId: 'YViATxxzc33Qe2ppDZmz', // From calendar config
      address: 'Test Virtual Meeting',
      ignoreDateRange: false,
      toNotify: false, // Don't send notifications for test
      ignoreFreeSlotValidation: true, // Skip validation for test
    };

    console.log('📝 Creating test appointment:', testAppointment);

    const createResponse = await fetch(
      'https://services.leadconnectorhq.com/calendars/events/appointments',
      {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testAppointment),
      }
    );

    if (createResponse.ok) {
      const createdAppointment = await createResponse.json();
      console.log('✅ Test appointment created:', createdAppointment.id);
      
      // Try to fetch it back
      const fetchResponse = await fetch(
        `https://services.leadconnectorhq.com/calendars/events/appointments/${createdAppointment.id}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (fetchResponse.ok) {
        const fetchedAppointment = await fetchResponse.json();
        console.log('📋 Fetched appointment back:', fetchedAppointment.title);
        
        // Clean up - delete the test appointment
        const deleteResponse = await fetch(
          `https://services.leadconnectorhq.com/calendars/events/appointments/${createdAppointment.id}`,
          {
            method: 'DELETE',
            headers,
          }
        );

        if (deleteResponse.ok) {
          console.log('🗑️ Test appointment cleaned up successfully');
        }
      }
    } else {
      const errorText = await createResponse.text();
      console.error('❌ Failed to create test appointment:', errorText);
    }

  } catch (error) {
    console.error('💥 Error in appointment creation test:', error);
  }
};

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  window.testGHLAppointments = testGHLAppointments;
} else {
  module.exports = { testGHLAppointments };
}

console.log('🎯 GHL Appointments Test Script Loaded!');
console.log('📝 Run testGHLAppointments() to start testing');
