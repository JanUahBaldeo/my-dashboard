// ========================================
// 🔍 TEST YOUR EXACT CURL COMMAND
// ========================================

async function testYourCurlCommand() {
  console.log('🔍 Testing your exact curl command...\n');

  const url = 'https://services.leadconnectorhq.com/calendars/U9qdnx6IVYmZTS1ccbiY/free-slots?startDate=1754774400000&endDate=1755628800000';
  const token = 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';
  
  console.log('🎯 URL:', url);
  console.log('🔑 Token:', token.substring(0, 15) + '...');
  console.log('📅 Start Date (ms):', 1754774400000, '→', new Date(1754774400000).toISOString());
  console.log('📅 End Date (ms):', 1755628800000, '→', new Date(1755628800000).toISOString());
  console.log('');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Version': '2021-04-15',
      },
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('');

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Response received:');
      console.log('🔍 Response keys:', Object.keys(data));
      
      // Check for slots in different locations
      let slots = [];
      if (data.slots) slots = data.slots;
      else if (data.freeSlots) slots = data.freeSlots;
      else if (data.data) slots = data.data;
      else if (Array.isArray(data)) slots = data;
      
      console.log('🎯 Slots found:', slots.length);
      
      if (slots.length > 0) {
        console.log('🎉 REAL FREE SLOTS FOUND!');
        console.log('📋 First few slots:');
        slots.slice(0, 5).forEach((slot, i) => {
          console.log(`   ${i + 1}. ${JSON.stringify(slot)}`);
        });
      } else {
        console.log('⚠️ No slots in response');
        console.log('📋 Full response:');
        console.log(JSON.stringify(data, null, 2));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', response.status, response.statusText);
      console.log('📋 Error body:', errorText);
      
      try {
        const parsedError = JSON.parse(errorText);
        console.log('📋 Parsed error:', parsedError);
      } catch (e) {
        console.log('📋 Could not parse error as JSON');
      }
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

// Run the test
testYourCurlCommand().catch(console.error);
