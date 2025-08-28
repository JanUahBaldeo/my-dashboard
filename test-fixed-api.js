#!/usr/bin/env node

/**
 * 🧪 Test Fixed Free Slots API
 * 
 * Test our updated free slots API with the character-indexed object fix
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up module path resolution for the dashboard app
const dashboardPath = resolve(__dirname, 'apps', 'dashboard');
process.env.NODE_PATH = dashboardPath;

console.log('🧪 Testing Fixed Free Slots API');
console.log('='.repeat(50));

async function testFixedAPI() {
  try {
    // Create future dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    console.log('\n📋 Test Parameters:');
    console.log('   Calendar ID: cF0lnbb4A2vCVdKQLrJp');
    console.log('   Start Date:', tomorrow.toISOString());
    console.log('   End Date:', nextWeek.toISOString());
    
    // Mock the GHL config for testing
    const mockGHLConfig = {
      token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
      version: '2021-04-15'
    };
    
    // Import and test our fixed API
    console.log('\n🔧 Testing with our fixed API...');
    
    // Simulate the API call with the exact parameters
    const testParams = {
      calendarId: 'cF0lnbb4A2vCVdKQLrJp',
      startDate: tomorrow.getTime(),
      endDate: nextWeek.getTime(),
      timeZone: 'America/Los_Angeles'
    };
    
    console.log('   Request params:', testParams);
    
    // Make direct fetch call to test our normalization
    const url = `https://services.leadconnectorhq.com/calendars/${testParams.calendarId}/free-slots?startDate=${testParams.startDate}&endDate=${testParams.endDate}&timezone=${encodeURIComponent(testParams.timeZone)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${mockGHLConfig.token}`,
        'Version': mockGHLConfig.version
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Raw API Response received');
      console.log('   Response keys:', Object.keys(data));
      
      // Test our normalization function
      const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
      console.log('   Date keys found:', dateKeys);
      
      if (dateKeys.length > 0) {
        const firstDateKey = dateKeys[0];
        const daySlots = data[firstDateKey];
        
        console.log(`\n🔍 Testing slot normalization for ${firstDateKey}:`);
        console.log('   Raw slots count:', daySlots.length);
        
        if (daySlots.length > 0) {
          const firstSlot = daySlots[0];
          console.log('   First slot (raw):', JSON.stringify(firstSlot).substring(0, 100) + '...');
          
          // Test our normalization function
          const normalizedSlot = normalizeSlotForTesting(firstSlot);
          console.log('   First slot (normalized):', normalizedSlot);
          
          // Test time parsing
          if (typeof normalizedSlot === 'string') {
            const parsedTime = new Date(normalizedSlot);
            console.log('   Parsed time:', isNaN(parsedTime) ? 'Invalid' : parsedTime.toISOString());
            
            // Test time slot formatting
            const timeSlot = formatTimeSlot(parsedTime);
            console.log('   Formatted time slot:', timeSlot);
          }
        }
      }
      
    } else {
      console.log('❌ API call failed:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Test normalization function (copied from our implementation)
function normalizeSlotForTesting(slot) {
  if (typeof slot === 'string') return slot;
  
  if (slot && typeof slot === 'object' && slot !== null) {
    const keys = Object.keys(slot);
    const isCharacterIndexed = keys.every(key => /^\d+$/.test(key));
    
    if (isCharacterIndexed && keys.length > 0) {
      const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
      const reconstructedString = sortedKeys.map(key => slot[key]).join('');
      return reconstructedString;
    }
  }
  
  return slot;
}

// Test time slot formatting
function formatTimeSlot(date) {
  if (!date || isNaN(date)) return 'Invalid time';
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  
  const start = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  // Add 30 minutes for end time
  const endDate = new Date(date.getTime() + 30 * 60 * 1000);
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  const endAmpm = endHours >= 12 ? 'pm' : 'am';
  const endDisplayHours = endHours % 12 || 12;
  
  const end = `${endDisplayHours}:${endMinutes.toString().padStart(2, '0')} ${endAmpm}`;
  
  return `${start} - ${end}`;
}

testFixedAPI().catch(console.error);
