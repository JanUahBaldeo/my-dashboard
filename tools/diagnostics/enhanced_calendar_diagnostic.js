// Enhanced GHL Calendar Events Diagnostic - Testing August 2025 specifically
const https = require('https');
const url = require('url');

class EnhancedGHLDiagnostic {
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
      
      const parsedUrl = url.parse(apiUrl);
      const requestOptions = {
        method: 'GET',
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.bearerToken}`,
          'Version': '2021-04-15'
        }
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
              rawData: data,
              success: res.statusCode >= 200 && res.statusCode < 300
            });
          } catch (error) {
            console.log('Raw response:', data);
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: { error: 'JSON Parse Error', rawResponse: data },
              rawData: data,
              success: false
            });
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

  async testAugust2025Events() {
    console.log('🚀 Enhanced GHL Calendar Events Diagnostic for August 2025...\n');

    // Based on your screenshot, test August 2025 specifically
    const august2025Start = new Date('2025-08-01T00:00:00.000Z');
    const august2025End = new Date('2025-08-31T23:59:59.999Z');
    
    console.log(`📅 Focusing on August 2025: ${august2025Start.toISOString()} to ${august2025End.toISOString()}\n`);

    const calendars = [
      { id: 'FIt5F2PbZVrK846aJeJF', name: 'Book With Jonathan Ferrell' },
      { id: 'U9qdnx6IVYmZTS1ccbiY', name: 'Partner Consultation' },
      { id: 'cF0lnbb4A2vCVdKQLrJp', name: 'Book Now With MLO - USE FOR GMAIL' },
      { id: 'sV3BiXrjzbfo1tSUdyHO', name: 'Ricky Sanaphanh\'s Personal Calendar' }
    ];

    // Test different combinations of parameters
    const testConfigurations = [
      {
        name: 'Standard with Calendar ID',
        params: {
          locationId: this.locationId,
          startTime: august2025Start.toISOString(),
          endTime: august2025End.toISOString()
        }
      },
      {
        name: 'With User ID instead of Calendar ID',
        params: {
          locationId: this.locationId,
          userId: 'sV3BiXrjzbfo1tSUdyHO',
          startTime: august2025Start.toISOString(),
          endTime: august2025End.toISOString()
        }
      },
      {
        name: 'With Group ID',
        params: {
          locationId: this.locationId,
          groupId: 'FIt5F2PbZVrK846aJeJF',
          startTime: august2025Start.toISOString(),
          endTime: august2025End.toISOString()
        }
      },
      {
        name: 'Minimal params with location only',
        params: {
          locationId: this.locationId,
          startTime: august2025Start.toISOString(),
          endTime: august2025End.toISOString()
        }
      },
      {
        name: 'Try different date format (YYYY-MM-DD)',
        params: {
          locationId: this.locationId,
          startDate: '2025-08-01',
          endDate: '2025-08-31'
        }
      },
      {
        name: 'Wide range - Full year 2025',
        params: {
          locationId: this.locationId,
          startTime: '2025-01-01T00:00:00.000Z',
          endTime: '2025-12-31T23:59:59.999Z'
        }
      }
    ];

    // Test each configuration
    for (let i = 0; i < testConfigurations.length; i++) {
      const config = testConfigurations[i];
      console.log(`\n🧪 Test Configuration ${i + 1}: ${config.name}`);
      console.log('=' .repeat(60));

      try {
        // Test primary calendar (Ricky's Personal Calendar)
        const testParams = { 
          ...config.params, 
          calendarId: 'sV3BiXrjzbfo1tSUdyHO' 
        };

        const response = await this.makeRequest('/calendars/events', testParams);
        
        console.log(`   📊 Status: ${response.statusCode}`);
        console.log(`   🔍 Success: ${response.success}`);
        console.log(`   📈 Events Found: ${response.data?.events?.length || 0}`);
        
        if (response.statusCode === 422) {
          console.log(`   ⚠️  Validation Error: ${JSON.stringify(response.data, null, 2)}`);
        }
        
        if (response.data?.events && response.data.events.length > 0) {
          console.log('   🎉 FOUND EVENTS! Sample events:');
          response.data.events.slice(0, 3).forEach((event, index) => {
            console.log(`      ${index + 1}. "${event.title}" on ${event.startTime}`);
          });
          
          // This configuration works! Let's test other calendars with it
          console.log(`\n   🔄 Testing other calendars with working configuration...`);
          
          for (const calendar of calendars) {
            if (calendar.id === 'sV3BiXrjzbfo1tSUdyHO') continue; // Already tested
            
            const calendarResponse = await this.makeRequest('/calendars/events', {
              ...config.params,
              calendarId: calendar.id
            });
            
            console.log(`      📋 ${calendar.name}: ${calendarResponse.data?.events?.length || 0} events`);
          }
          
          break; // Found working configuration, no need to test others
        }
        
        if (!response.success && response.rawData) {
          console.log(`   ❌ Raw response: ${response.rawData.substring(0, 200)}...`);
        }
        
      } catch (error) {
        console.error(`   ❌ Error with configuration "${config.name}":`, error.message);
      }
    }

    // Test alternative endpoints
    console.log('\n🔍 Testing Alternative Endpoints...');
    console.log('=' .repeat(60));

    const alternativeEndpoints = [
      '/calendars/appointments',
      '/appointments',
      '/events',
      '/calendar/events'
    ];

    for (const endpoint of alternativeEndpoints) {
      console.log(`\n🧪 Testing ${endpoint}`);
      try {
        const response = await this.makeRequest(endpoint, {
          locationId: this.locationId,
          startTime: august2025Start.toISOString(),
          endTime: august2025End.toISOString()
        });
        
        console.log(`   📊 Status: ${response.statusCode}`);
        console.log(`   📈 Results: ${response.data?.events?.length || response.data?.appointments?.length || response.data?.length || 0}`);
      } catch (error) {
        console.log(`   ❌ ${endpoint} failed: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎯 ENHANCED DIAGNOSTIC RESULTS');
    console.log('='.repeat(80));
    console.log('🔍 Based on the diagnostic above:');
    console.log('');
    console.log('1. If any configuration shows events > 0:');
    console.log('   ✅ Use that exact parameter combination in your app');
    console.log('   ✅ Check the date format and range that worked');
    console.log('');
    console.log('2. If all configurations show 0 events:');
    console.log('   🤔 The events in your GHL backend might be:');
    console.log('   - In a different location ID');
    console.log('   - Using different calendar IDs');
    console.log('   - In a different date range');
    console.log('   - Stored as a different type of event');
    console.log('');
    console.log('3. Next steps:');
    console.log('   - Check your GHL backend for the exact date/time of existing events');
    console.log('   - Verify the location ID and calendar IDs match');
    console.log('   - Try querying without date filters to see all events');
  }
}

// Run the enhanced diagnostic
const diagnostic = new EnhancedGHLDiagnostic();
diagnostic.testAugust2025Events().catch(console.error);
