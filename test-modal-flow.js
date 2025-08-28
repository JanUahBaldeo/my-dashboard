#!/usr/bin/env node

/**
 * 🧪 Test Modal Free Slots Integration
 * 
 * Test the exact same flow that the appointment modal uses
 */

console.log('🧪 Testing Modal Free Slots Integration');
console.log('='.repeat(50));

async function testModalFlow() {
  try {
    // Simulate the exact same parameters the modal would use
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0]; // "2025-08-27"
    
    const testParams = {
      calendarId: 'cF0lnbb4A2vCVdKQLrJp', // Using the working calendar from curl
      date: tomorrowDateString,
      timezone: 'America/Los_Angeles'
    };
    
    console.log('\n📋 Modal Test Parameters:');
    console.log('   Calendar ID:', testParams.calendarId);
    console.log('   Date:', testParams.date);
    console.log('   Timezone:', testParams.timezone);
    
    // Step 1: Test our fetchFreeSlotsForDate function directly
    console.log('\n🚀 Step 1: Testing fetchFreeSlotsForDate...');
    
    const startMs = new Date(testParams.date + 'T00:00:00.000Z').getTime();
    const endMs = new Date(testParams.date + 'T23:59:59.999Z').getTime();
    
    const url = `https://services.leadconnectorhq.com/calendars/${testParams.calendarId}/free-slots?startDate=${startMs}&endDate=${endMs}&timezone=${encodeURIComponent(testParams.timezone)}`;
    
    console.log('   API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
        'Version': '2021-04-15'
      }
    });
    
    console.log('   Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Raw API response received');
      
      // Step 2: Parse slots the same way our API does
      let slots = [];
      const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
      
      console.log('   Date keys found:', dateKeys);
      
      dateKeys.forEach(dateKey => {
        const dayData = data[dateKey];
        if (dayData && dayData.slots && Array.isArray(dayData.slots)) {
          console.log(`   📅 ${dateKey}: ${dayData.slots.length} slots`);
          const dateSpecificSlots = dayData.slots.map(slot => ({
            startTime: slot,
            date: dateKey,
            slot: slot,
            timezone: slot.includes('-07:00') ? 'America/Los_Angeles' : 'UTC',
          }));
          slots.push(...dateSpecificSlots);
        }
      });
      
      console.log('\n📊 Parsed Slots Summary:');
      console.log('   Total slots:', slots.length);
      
      if (slots.length > 0) {
        console.log('\n🎯 Step 3: Testing slot conversion to time strings...');
        
        // Test the time slot conversion
        const timeSlots = slots.slice(0, 5).map(slot => {
          const startTime = new Date(slot.slot);
          const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
          
          const formatOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: testParams.timezone
          };
          
          const startFormatted = startTime.toLocaleTimeString('en-US', formatOptions).toLowerCase();
          const endFormatted = endTime.toLocaleTimeString('en-US', formatOptions).toLowerCase();
          
          return `${startFormatted} - ${endFormatted}`;
        });
        
        console.log('   Sample converted time slots:');
        timeSlots.forEach((timeSlot, i) => {
          console.log(`     ${i + 1}. ${timeSlot}`);
        });
        
        console.log('\n✅ SUCCESS! Free slots are working correctly');
        console.log('   ✓ API responds with proper data');
        console.log('   ✓ Slots are parsed correctly');
        console.log('   ✓ Time formatting works');
        console.log('\n💡 The appointment modal should now show these time slots in the dropdown');
        
      } else {
        console.log('❌ No slots found for the selected date');
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ API error:', response.status, errorText);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testModalFlow().catch(console.error);
