#!/usr/bin/env node

/**
 * 🧪 Test Free Slots API - With Future Dates
 * 
 * Testing the free slots API with proper future dates
 */

console.log('🧪 Testing Free Slots API - With Future Dates');
console.log('='.repeat(60));

async function testWithFutureDates() {
  try {
    // Create future dates - tomorrow and next week
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Start of day
    
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 7); // End of range
    
    const startMs = tomorrow.getTime();
    const endMs = nextWeek.getTime();
    
    console.log('\n📋 Test Parameters:');
    console.log('   Calendar ID: cF0lnbb4A2vCVdKQLrJp');
    console.log('   Start Date:', new Date(startMs).toISOString());
    console.log('   End Date:', new Date(endMs).toISOString());
    console.log('   Timezone: America/Los_Angeles');
    console.log('   Range: 7 days from tomorrow');
    
    // Test 1: Direct API call with future dates
    console.log('\n🌐 Test 1: Direct API Call (Future Dates)');
    console.log('-'.repeat(40));
    
    const url = `https://services.leadconnectorhq.com/calendars/cF0lnbb4A2vCVdKQLrJp/free-slots?startDate=${startMs}&endDate=${endMs}&timezone=${encodeURIComponent('America/Los_Angeles')}`;
    
    console.log('📡 Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
        'Version': '2021-04-15'
      }
    });
    
    console.log('📊 Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS! Response received:');
      console.log('🔍 Response keys:', Object.keys(data));
      
      // Parse slots from different possible locations
      let slots = [];
      let dates = {};
      
      if (data._dates_) {
        console.log('📍 Found "_dates_" property');
        dates = data._dates_;
        Object.keys(dates).forEach(dateKey => {
          const dayData = dates[dateKey];
          if (dayData && dayData.slots) {
            console.log(`   📅 Date ${dateKey}: ${dayData.slots.length} slots`);
            slots.push(...dayData.slots.map(slot => ({ ...slot, date: dateKey })));
          }
        });
      }
      
      if (data.slots && Array.isArray(data.slots)) {
        console.log('📍 Found direct "slots" array');
        slots.push(...data.slots);
      }
      
      // Check for date-formatted keys (YYYY-MM-DD)
      const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
      if (dateKeys.length > 0) {
        console.log('📍 Found date-formatted keys:', dateKeys);
        dateKeys.forEach(dateKey => {
          if (Array.isArray(data[dateKey])) {
            console.log(`   📅 Date ${dateKey}: ${data[dateKey].length} slots`);
            slots.push(...data[dateKey].map(slot => ({ ...slot, date: dateKey })));
          } else if (data[dateKey].slots) {
            console.log(`   📅 Date ${dateKey}: ${data[dateKey].slots.length} slots`);
            slots.push(...data[dateKey].slots.map(slot => ({ ...slot, date: dateKey })));
          }
        });
      }
      
      console.log('\n🎯 Slots Summary:');
      console.log('   Total slots found:', slots.length);
      
      if (slots.length > 0) {
        console.log('\n🎉 SLOTS FOUND! First few slots:');
        slots.slice(0, 5).forEach((slot, i) => {
          console.log(`   ${i + 1}. ${JSON.stringify(slot)}`);
        });
      } else {
        console.log('\n⚠️ No slots found. Full response:');
        console.log(JSON.stringify(data, null, 2));
      }
      
    } else {
      const errorText = await response.text();
      console.log('\n❌ ERROR Response:');
      console.log('   Status:', response.status);
      console.log('   Error:', errorText);
    }
    
  } catch (error) {
    console.log('\n❌ Request failed:', error.message);
  }
}

async function testCalendarList() {
  console.log('\n🗂️ Test 2: Get Calendar List');
  console.log('-'.repeat(40));
  
  try {
    const response = await fetch('https://services.leadconnectorhq.com/calendars/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
        'Version': '2021-04-15'
      }
    });
    
    console.log('📊 Calendar List Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Calendar list received');
      console.log('📅 Total calendars:', data.calendars?.length || 0);
      
      if (data.calendars?.length > 0) {
        console.log('\n📋 Available calendars:');
        data.calendars.slice(0, 5).forEach((cal, i) => {
          console.log(`   ${i + 1}. ${cal.name} (${cal.id}) - Active: ${cal.isActive}`);
        });
        
        // Check if our test calendar exists
        const ourCalendar = data.calendars.find(cal => cal.id === 'cF0lnbb4A2vCVdKQLrJp');
        if (ourCalendar) {
          console.log('\n✅ Test calendar found:', ourCalendar.name);
          console.log('   Active:', ourCalendar.isActive);
          console.log('   Timezone:', ourCalendar.timezone);
        } else {
          console.log('\n❌ Test calendar cF0lnbb4A2vCVdKQLrJp not found in calendar list');
          console.log('   This might explain why no slots are returned');
        }
      }
    } else {
      console.log('❌ Failed to get calendar list:', response.status);
    }
  } catch (error) {
    console.log('❌ Calendar list error:', error.message);
  }
}

async function testWithActiveCalendar() {
  console.log('\n🎯 Test 3: Test with First Active Calendar');
  console.log('-'.repeat(40));
  
  try {
    // First get the calendar list
    const calendarsResponse = await fetch('https://services.leadconnectorhq.com/calendars/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
        'Version': '2021-04-15'
      }
    });
    
    if (!calendarsResponse.ok) {
      console.log('❌ Could not get calendar list');
      return;
    }
    
    const calendarsData = await calendarsResponse.json();
    const activeCalendars = calendarsData.calendars?.filter(cal => cal.isActive !== false) || [];
    
    if (activeCalendars.length === 0) {
      console.log('❌ No active calendars found');
      return;
    }
    
    const testCalendar = activeCalendars[0];
    console.log('📅 Testing with calendar:', testCalendar.name);
    console.log('   ID:', testCalendar.id);
    console.log('   Timezone:', testCalendar.timezone);
    
    // Test free slots with this active calendar
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const startMs = tomorrow.getTime();
    const endMs = nextWeek.getTime();
    
    const url = `https://services.leadconnectorhq.com/calendars/${testCalendar.id}/free-slots?startDate=${startMs}&endDate=${endMs}&timezone=America%2FLos_Angeles`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
        'Version': '2021-04-15'
      }
    });
    
    console.log('📊 Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response received for active calendar');
      console.log('🔍 Response keys:', Object.keys(data));
      console.log('🔍 Full response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Error testing active calendar:', error.message);
  }
}

// Run all tests
async function main() {
  await testWithFutureDates();
  await testCalendarList();
  await testWithActiveCalendar();
  
  console.log('\n🎯 CONCLUSIONS:');
  console.log('='.repeat(60));
  console.log('1. Check if calendar cF0lnbb4A2vCVdKQLrJp exists and is active');
  console.log('2. If no slots found, the calendar may not have availability configured');
  console.log('3. Try with different active calendars from your account');
  console.log('4. Verify the calendar has availability rules set up in GHL');
}

main().catch(console.error);
