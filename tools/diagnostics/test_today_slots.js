// ========================================
// 🔍 TEST TODAY'S SLOTS
// ========================================

const GHL_CONFIG = {
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
  version: '2021-04-15',
};

async function testTodaysSlots() {
  console.log('🔍 Testing slots for TODAY...\n');

  const calendarId = 'U9qdnx6IVYmZTS1ccbiY';
  const today = new Date(); // Today's date
  
  console.log('📅 Testing date:', today.toISOString().split('T')[0]);
  console.log('📅 Calendar ID:', calendarId);

  // Calculate start and end of today
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const startDate = startOfDay.getTime();
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  const endDate = endOfDay.getTime();

  console.log('📅 Start (ms):', startDate, '→', new Date(startDate).toISOString());
  console.log('📅 End (ms):', endDate, '→', new Date(endDate).toISOString());

  try {
    const params = new URLSearchParams();
    params.append('startDate', startDate.toString());
    params.append('endDate', endDate.toString());
    params.append('timezone', 'America/Los_Angeles');

    const apiUrl = `https://services.leadconnectorhq.com/calendars/${calendarId}/free-slots?${params.toString()}`;
    console.log('🔗 URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': GHL_CONFIG.version,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response keys:', Object.keys(data));

      const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
      console.log('📅 Date keys found:', dateKeys);

      let todaySlots = [];
      const todayStr = today.toISOString().split('T')[0];
      
      if (data[todayStr] && data[todayStr].slots) {
        todaySlots = data[todayStr].slots;
        console.log('🎉 Found', todaySlots.length, 'slots for TODAY:', todayStr);
        console.log('📋 First 5 slots:', todaySlots.slice(0, 5));
      } else {
        console.log('⚠️ No slots found for today:', todayStr);
        console.log('📋 Available dates:', dateKeys);
      }

    } else {
      const errorText = await response.text();
      console.log('❌ Error:', response.status, errorText);
    }

  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

testTodaysSlots().catch(console.error);
