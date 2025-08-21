// ========================================
// 🔍 SIMPLE GHL FREE SLOTS TEST
// ========================================

// Simple test without complex imports
const GHL_CONFIG = {
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
  version: '2021-04-15',
};

async function testGHLFreeSlots() {
  console.log('🔍 Testing GHL Free Slots API...\n');

  // Step 1: Test calendars list
  console.log('1️⃣ Testing Calendars Endpoint...');
  try {
    const response = await fetch('https://services.leadconnectorhq.com/calendars/', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': GHL_CONFIG.version,
      },
    });

    console.log('   Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Success! Found calendars:', data.calendars?.length || 0);
      
      if (data.calendars?.length > 0) {
        const calendar = data.calendars[0];
        console.log('   📅 First calendar:');
        console.log('      ID:', calendar.id);
        console.log('      Name:', calendar.name);
        console.log('      Active:', calendar.isActive);
        
        // Step 2: Test free slots for this calendar
        await testFreeSlotsForCalendar(calendar.id, calendar.name);
      }
    } else {
      const errorText = await response.text();
      console.log('   ❌ Error:', errorText);
      
      if (response.status === 401) {
        console.log('   🔑 Authentication failed - token may be expired or invalid');
      }
    }
  } catch (error) {
    console.log('   ❌ Request failed:', error.message);
  }
}

async function testFreeSlotsForCalendar(calendarId, calendarName) {
  console.log(`\n2️⃣ Testing Free Slots for: ${calendarName} (${calendarId})`);
  
  try {
    // Get today's timestamp in seconds (GHL format)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = Math.floor(today.getTime() / 1000);
    
    // Get tomorrow's timestamp
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    const endDate = Math.floor(tomorrow.getTime() / 1000);
    
    console.log('   📅 Date range (seconds):', startDate, '-', endDate);
    console.log('   📅 Date range (readable):', new Date(startDate * 1000).toISOString(), 'to', new Date(endDate * 1000).toISOString());
    
    const url = `https://services.leadconnectorhq.com/calendars/${calendarId}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=America/Los_Angeles`;
    console.log('   🔗 URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': GHL_CONFIG.version,
      },
    });
    
    console.log('   📊 Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Free slots response received!');
      console.log('   🔍 Response keys:', Object.keys(data));
      
      // Check different possible slot locations
      let slots = [];
      if (data.slots) slots = data.slots;
      else if (data.freeSlots) slots = data.freeSlots;
      else if (data.data) slots = data.data;
      else if (Array.isArray(data)) slots = data;
      
      console.log('   🎯 Slots found:', slots.length);
      
      if (slots.length > 0) {
        console.log('   🎉 SUCCESS! Real slots found:');
        slots.slice(0, 3).forEach((slot, i) => {
          console.log(`      ${i + 1}. ${JSON.stringify(slot)}`);
        });
      } else {
        console.log('   ⚠️ No slots returned - calendar may have no availability configured');
        console.log('   📋 Full response:', JSON.stringify(data, null, 2));
      }
    } else {
      const errorText = await response.text();
      console.log('   ❌ Error response:', errorText);
      
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
        console.log('   📋 Parsed error:', parsedError);
      } catch (e) {
        console.log('   📋 Raw error text:', errorText);
      }
    }
  } catch (error) {
    console.log('   ❌ Request failed:', error.message);
  }
}

// Run the test
testGHLFreeSlots().catch(console.error);
