const https = require('https');
const url = require('url');

const apiUrl = 'https://services.leadconnectorhq.com/calendars/?locationId=b7vHWUGVUNQGoIlAXabY&groupId=FIt5F2PbZVrK846aJeJF';

const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
    'Version': '2021-04-15'
  }
};

const parsedUrl = url.parse(apiUrl);
const requestOptions = {
  ...options,
  hostname: parsedUrl.hostname,
  port: parsedUrl.port || 443,
  path: parsedUrl.path
};

const req = https.request(requestOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response Headers:`, res.headers);
    console.log('Raw Response:', data);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('\n📋 Full API Response:');
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (jsonData.calendars && Array.isArray(jsonData.calendars)) {
        if (jsonData.calendars.length > 0) {
          console.log('\n📅 Calendar List (ID | Name):');
          console.log('=' .repeat(50));
          
          jsonData.calendars.forEach((calendar, index) => {
            console.log(`${index + 1}. ID: ${calendar.id}`);
            console.log(`   Name: ${calendar.name || 'Unnamed Calendar'}`);
            console.log('');
          });
          
          // Also create a simplified JSON output
          const simplifiedCalendars = jsonData.calendars.map(cal => ({
            id: cal.id,
            name: cal.name || 'Unnamed Calendar'
          }));
          
          console.log('\n📋 Simplified JSON format:');
          console.log(JSON.stringify(simplifiedCalendars, null, 2));
        } else {
          console.log('\n⚠️  No calendars found in the response.');
        }
      }
      
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
});

req.setTimeout(10000); // 10 second timeout
req.end();
