// GHL Calendar Events Diagnostic Tool
const https = require('https');
const url = require('url');

class GHLCalendarDiagnostic {
  constructor() {
    this.bearerToken = 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';
    this.locationId = 'b7vHWUGVUNQGoIlAXabY';
    this.baseUrl = 'https://services.leadconnectorhq.com';
  }

  async makeRequest(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams(params);
      const apiUrl = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;
      
      console.log(`🔍 Testing: ${apiUrl}`);
      
      const options = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.bearerToken}`,
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
          try {
            const jsonData = JSON.parse(data);
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: jsonData,
              success: res.statusCode === 200
            });
          } catch (error) {
            reject(new Error(`JSON Parse Error: ${error.message}. Raw response: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request error: ${error.message}`));
      });

      req.setTimeout(15000);
      req.end();
    });
  }

  async testAllCalendarEndpoints() {
    console.log('🚀 Starting GHL Calendar Events Diagnostic...\n');

    const calendars = [
      { id: 'FIt5F2PbZVrK846aJeJF', name: 'Book With Jonathan Ferrell' },
      { id: 'U9qdnx6IVYmZTS1ccbiY', name: 'Partner Consultation' },
      { id: 'cF0lnbb4A2vCVdKQLrJp', name: 'Book Now With MLO - USE FOR GMAIL' },
      { id: 'sV3BiXrjzbfo1tSUdyHO', name: 'Ricky Sanaphanh\'s Personal Calendar' }
    ];

    // Set up date ranges
    const now = new Date();
    const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
    const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);   // 90 days from now
    
    console.log(`📅 Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}\n`);

    // Test each calendar
    for (const calendar of calendars) {
      console.log(`\n🔍 Testing Calendar: ${calendar.name}`);
      console.log(`📋 Calendar ID: ${calendar.id}`);
      console.log('=' .repeat(60));

      try {
        // Test 1: Events endpoint with wide date range
        console.log('🧪 Test 1: Calendar Events (Wide Date Range)');
        const eventsResponse = await this.makeRequest('/calendars/events', {
          locationId: this.locationId,
          calendarId: calendar.id,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString()
        });

        console.log(`   ✅ Status: ${eventsResponse.statusCode}`);
        console.log(`   📊 Events Found: ${eventsResponse.data?.events?.length || 0}`);
        
        if (eventsResponse.data?.events?.length > 0) {
          console.log('   📅 Sample Events:');
          eventsResponse.data.events.slice(0, 3).forEach((event, index) => {
            console.log(`      ${index + 1}. ${event.title || 'Untitled'} (${event.startTime})`);
          });
        }

        // Test 2: Events endpoint without date range
        console.log('\n🧪 Test 2: Calendar Events (No Date Range)');
        const allEventsResponse = await this.makeRequest('/calendars/events', {
          locationId: this.locationId,
          calendarId: calendar.id
        });

        console.log(`   ✅ Status: ${allEventsResponse.statusCode}`);
        console.log(`   📊 Events Found: ${allEventsResponse.data?.events?.length || 0}`);

        // Test 3: Try appointments endpoint (might not exist)
        console.log('\n🧪 Test 3: Appointments Endpoint');
        try {
          const appointmentsResponse = await this.makeRequest('/calendars/events/appointments', {
            locationId: this.locationId,
            calendarId: calendar.id,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString()
          });
          
          console.log(`   ✅ Status: ${appointmentsResponse.statusCode}`);
          console.log(`   📊 Appointments Found: ${appointmentsResponse.data?.length || 0}`);
        } catch (error) {
          console.log(`   ❌ Appointments endpoint failed: ${error.message}`);
        }

        // Test 4: All location events without calendar filter
        if (calendar.id === calendars[0].id) { // Only test once
          console.log('\n🧪 Test 4: All Location Events (No Calendar Filter)');
          const locationEventsResponse = await this.makeRequest('/calendars/events', {
            locationId: this.locationId,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString()
          });

          console.log(`   ✅ Status: ${locationEventsResponse.statusCode}`);
          console.log(`   📊 Total Location Events: ${locationEventsResponse.data?.events?.length || 0}`);
          
          if (locationEventsResponse.data?.events?.length > 0) {
            console.log('   📅 Sample Location Events:');
            locationEventsResponse.data.events.slice(0, 5).forEach((event, index) => {
              console.log(`      ${index + 1}. ${event.title || 'Untitled'} (Calendar: ${event.calendarId}) (${event.startTime})`);
            });
          }
        }

      } catch (error) {
        console.error(`❌ Error testing calendar ${calendar.name}:`, error.message);
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 DIAGNOSTIC SUMMARY');
    console.log('='.repeat(80));
    console.log('If you see events above but they\'re not showing in your calendar:');
    console.log('1. ✅ API is working - check event formatting in your app');
    console.log('2. ✅ Check date range filtering in your calendar component');
    console.log('3. ✅ Verify event transformation logic');
    console.log('');
    console.log('If you see no events but expect to see them:');
    console.log('1. 🔍 Check if events exist in your GHL backend');
    console.log('2. 🔍 Verify calendar IDs are correct');
    console.log('3. 🔍 Check date ranges in your requests');
    console.log('');
    console.log('Next steps:');
    console.log('- Check the calendar component\'s fetchCalendarEvents call');
    console.log('- Verify the date range being passed to the API');
    console.log('- Check the event formatting/transformation logic');
  }
}

// Run the diagnostic
const diagnostic = new GHLCalendarDiagnostic();
diagnostic.testAllCalendarEndpoints().catch(console.error);
