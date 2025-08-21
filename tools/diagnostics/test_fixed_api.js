// ========================================
// 🔍 TEST FIXED FREE SLOTS API
// ========================================

// Simple test of the fixed API
const GHL_CONFIG = {
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
  version: '2021-04-15',
};

// Copy the fixed logic here for testing
async function testFixedFreeSlotsAPI() {
  console.log('🔍 Testing FIXED Free Slots API...\n');

  const calendarId = 'U9qdnx6IVYmZTS1ccbiY'; // From your curl
  const startDate = 1754774400000; // From your curl 
  const endDate = 1755628800000;   // From your curl

  console.log('📅 Calendar ID:', calendarId);
  console.log('📅 Start Date:', startDate, '→', new Date(startDate).toISOString());
  console.log('📅 End Date:', endDate, '→', new Date(endDate).toISOString());

  try {
    const params = new URLSearchParams();
    params.append('startDate', startDate.toString());
    params.append('endDate', endDate.toString());
    params.append('timezone', 'America/Los_Angeles');

    const apiUrl = `https://services.leadconnectorhq.com/calendars/${calendarId}/free-slots?${params.toString()}`;
    console.log('🔗 API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': GHL_CONFIG.version,
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Raw response keys:', Object.keys(data));

      // Apply the new parsing logic
      let normalizedSlots = [];

      // Check if response has date-organized structure  
      const dateKeys = Object.keys(data).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/));
      
      if (dateKeys.length > 0) {
        console.log('🎯 Found date-organized structure with dates:', dateKeys);
        
        dateKeys.forEach(dateKey => {
          const dayData = data[dateKey];
          if (dayData && dayData.slots && Array.isArray(dayData.slots)) {
            console.log(`   📅 ${dateKey}: ${dayData.slots.length} slots`);
            normalizedSlots.push(...dayData.slots);
          }
        });
        
        console.log('🎉 TOTAL NORMALIZED SLOTS:', normalizedSlots.length);
        console.log('📋 First 5 slots:', normalizedSlots.slice(0, 5));
        
        if (normalizedSlots.length > 0) {
          console.log('✅ SUCCESS! Real GHL slots successfully parsed!');
        }
        
      } else {
        console.log('⚠️ No date-organized structure found');
        console.log('📋 Raw response:', JSON.stringify(data, null, 2));
      }

    } else {
      const errorText = await response.text();
      console.log('❌ Error:', response.status, errorText);
    }

  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

// Run the test
testFixedFreeSlotsAPI().catch(console.error);
