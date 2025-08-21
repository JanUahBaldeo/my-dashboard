// ========================================
// 🧪 GHL CALENDAR GROUPS API TEST
// ========================================
// Test script to verify the GHL calendar groups endpoint

const testGHLCalendarGroups = async () => {
  console.log('🧪 Testing GHL Calendar Groups API...');
  
  const locationId = 'b7vHWUGVUNQGoIlAXabY';

  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
    'Version': '2021-04-15',
  };

  try {
    console.log('🔍 Fetching calendar groups...');
    
    // Test calendar groups endpoint
    const groupsResponse = await fetch(
      `https://services.leadconnectorhq.com/calendars/groups?locationId=${locationId}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!groupsResponse.ok) {
      console.error(`❌ HTTP error for groups:`, groupsResponse.status);
      return;
    }

    const groupsData = await groupsResponse.json();
    console.log('📊 Calendar Groups Response:', groupsData);
    console.log(`📅 Found ${groupsData.groups?.length || 0} calendar groups`);
    
    if (groupsData.groups?.length > 0) {
      console.log('📋 Groups details:');
      groupsData.groups.forEach((group, index) => {
        console.log(`  ${index + 1}. ${group.name || group.id} (${group.id})`);
        if (group.calendars?.length > 0) {
          console.log(`     📅 Contains ${group.calendars.length} calendars`);
        }
      });

      // Test fetching events from the first group
      const firstGroup = groupsData.groups[0];
      console.log(`\\n🔍 Testing events from group: ${firstGroup.name || firstGroup.id}`);
      
      try {
        const params = new URLSearchParams();
        params.append('locationId', locationId);
        params.append('groupId', firstGroup.id);
        params.append('startTime', '2024-01-01T00:00:00.000Z');
        params.append('endTime', '2025-12-31T23:59:59.999Z');

        const eventsResponse = await fetch(
          `https://services.leadconnectorhq.com/calendars/events?${params.toString()}`,
          {
            method: 'GET',
            headers,
          }
        );

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          console.log(`✅ Group ${firstGroup.id} events: ${eventsData.events?.length || 0}`);
          
          if (eventsData.events?.length > 0) {
            console.log('📋 Sample events from group:');
            eventsData.events.slice(0, 3).forEach((event, index) => {
              console.log(`  ${index + 1}. ${event.title} (${event.startTime})`);
            });
          }
        } else {
          console.warn(`⚠️ Could not fetch events from group ${firstGroup.id}`);
        }
      } catch (groupEventError) {
        console.warn(`⚠️ Error fetching events from group:`, groupEventError.message);
      }
    } else {
      console.log('📝 No calendar groups found in location');
      console.log('💡 Groups are used to organize multiple calendars together');
    }

    // Test the API function approach
    console.log('\\n🧪 Testing via API functions...');
    
    // Import and test our new function (simulated)
    console.log('📝 API functions would be imported from calendarApi.js:');
    console.log('- fetchGHLCalendarGroups()');
    console.log('- fetchEventsByCalendarGroup()');

  } catch (error) {
    console.error('💥 Error testing calendar groups:', error);
  }
};

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  window.testGHLCalendarGroups = testGHLCalendarGroups;
} else {
  module.exports = { testGHLCalendarGroups };
}

console.log('🎯 GHL Calendar Groups Test Script Loaded!');
console.log('📝 Run testGHLCalendarGroups() to start testing');
