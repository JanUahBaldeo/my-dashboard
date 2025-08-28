#!/usr/bin/env node

/**
 * 🔍 Debug API Response Structure
 */

console.log('🔍 Debugging API Response Structure');
console.log('='.repeat(50));

async function debugResponse() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const url = `https://services.leadconnectorhq.com/calendars/cF0lnbb4A2vCVdKQLrJp/free-slots?startDate=${tomorrow.getTime()}&endDate=${nextWeek.getTime()}&timezone=America%2FLos_Angeles`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
        'Version': '2021-04-15'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n📊 Full Response Structure:');
      console.log(JSON.stringify(data, null, 2));
      
      // Check each date key
      const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
      
      for (const dateKey of dateKeys) {
        console.log(`\n📅 Date: ${dateKey}`);
        console.log('   Type:', typeof data[dateKey]);
        console.log('   Is Array:', Array.isArray(data[dateKey]));
        
        if (Array.isArray(data[dateKey])) {
          console.log('   Length:', data[dateKey].length);
          if (data[dateKey].length > 0) {
            console.log('   First item type:', typeof data[dateKey][0]);
            console.log('   First item keys:', Object.keys(data[dateKey][0]));
            console.log('   First item (sample):', JSON.stringify(data[dateKey][0]).substring(0, 200));
          }
        } else {
          console.log('   Keys:', Object.keys(data[dateKey] || {}));
          console.log('   Value:', JSON.stringify(data[dateKey]).substring(0, 200));
        }
      }
      
    } else {
      console.log('❌ API failed:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugResponse().catch(console.error);
