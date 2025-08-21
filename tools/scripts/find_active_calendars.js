// Test all calendars to find which ones are active
import { GHL_CONFIG } from './src/config/ghlConfig.js';

async function findActiveCalendars() {
  console.warn('🔍 Finding Active Calendars...\n');

  const locationId = 'b7vHWUGVUNQGoIlAXabY';
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${GHL_CONFIG.token}`,
    'Version': '2021-04-15',
  };

  try {
    // Get all calendars
    const response = await fetch(`https://services.leadconnectorhq.com/calendars/?locationId=${locationId}`, {
      method: 'GET',
      headers,
    });
    const data = await response.json();

    console.warn('📋 All Calendars Analysis:');
    console.warn(`Found ${data.calendars.length} calendars total\n`);

    data.calendars.forEach((calendar, index) => {
      console.warn(`${index + 1}. ${calendar.name} (${calendar.id})`);
      console.warn(`   Active: ${calendar.isActive}`);
      console.warn(`   Type: ${calendar.calendarType}`);
      console.warn(`   Slot Duration: ${calendar.slotDuration} ${calendar.slotDurationUnit}`);
      console.warn(`   Team Members: ${calendar.teamMembers.length}`);
      console.warn(`   Working Days: ${calendar.openHours.length} configured`);

      if (calendar.openHours.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const workingDays = calendar.openHours.map(oh =>
          oh.daysOfTheWeek.map(day => days[day]).join(','),
        ).join(' ');
        console.warn(`   Working Days: ${workingDays}`);
      }
      console.warn('');
    });

    // Find active calendars
    const activeCalendars = data.calendars.filter(cal => cal.isActive);
    const inactiveCalendars = data.calendars.filter(cal => !cal.isActive);

    console.warn('✅ ACTIVE CALENDARS:');
    if (activeCalendars.length > 0) {
      activeCalendars.forEach(cal => {
        console.warn(`   • ${cal.name} (${cal.id})`);
      });
    } else {
      console.warn('   ❌ NO ACTIVE CALENDARS FOUND!');
    }

    console.warn('\n❌ INACTIVE CALENDARS:');
    inactiveCalendars.forEach(cal => {
      console.warn(`   • ${cal.name} (${cal.id})`);
    });

    // Test free slots on active calendars
    if (activeCalendars.length > 0) {
      console.warn('\n🧪 Testing Free Slots on Active Calendars:');

      const today = new Date();
      const startDate = Math.floor(today.getTime() / 1000);
      const endDate = Math.floor((today.getTime() + 7 * 24 * 60 * 60 * 1000) / 1000);

      for (const calendar of activeCalendars) {
        console.warn(`\n📅 Testing: ${calendar.name}`);

        try {
          const url = `https://services.leadconnectorhq.com/calendars/${calendar.id}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=America%2FLos_Angeles`;
          const response = await fetch(url, { method: 'GET', headers });
          const slotData = await response.json();

          console.warn(`   Status: ${response.status}`);
          console.warn(`   Response Keys: ${Object.keys(slotData)}`);

          if (Object.keys(slotData).length > 1) {
            console.warn('   🎉 FOUND SLOT DATA!');
            console.warn('   Full Response:', JSON.stringify(slotData, null, 2));
          } else {
            console.warn(`   ⚠️ Only traceId returned: ${slotData.traceId}`);
          }

        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error fetching calendars:', error);
  }
}

findActiveCalendars();
