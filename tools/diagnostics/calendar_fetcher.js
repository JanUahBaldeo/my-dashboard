// GHL Calendar Fetcher Utility
const https = require('https');
const url = require('url');

class GHLCalendarFetcher {
  constructor(bearerToken, version = '2021-04-15') {
    this.bearerToken = bearerToken;
    this.version = version;
    this.baseUrl = 'https://services.leadconnectorhq.com';
  }

  async fetchCalendars(locationId, groupId = null) {
    const params = new URLSearchParams();
    params.append('locationId', locationId);
    if (groupId) {
      params.append('groupId', groupId);
    }

    const apiUrl = `${this.baseUrl}/calendars/?${params.toString()}`;
    
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.bearerToken}`,
          'Version': this.version
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

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.setTimeout(10000);
      req.end();
    });
  }

  formatCalendarList(calendars) {
    if (!Array.isArray(calendars) || calendars.length === 0) {
      return {
        formatted: '⚠️  No calendars found',
        simplified: [],
        count: 0
      };
    }

    const simplified = calendars.map(cal => ({
      id: cal.id,
      name: cal.name || 'Unnamed Calendar',
      isActive: cal.isActive || false,
      teamMembers: cal.teamMembers?.length || 0
    }));

    let formatted = '📅 Calendar List:\n';
    formatted += '=' .repeat(50) + '\n';
    
    simplified.forEach((calendar, index) => {
      formatted += `${index + 1}. ID: ${calendar.id}\n`;
      formatted += `   Name: ${calendar.name}\n`;
      formatted += `   Active: ${calendar.isActive ? '✅' : '❌'}\n`;
      formatted += `   Team Members: ${calendar.teamMembers}\n\n`;
    });

    return {
      formatted,
      simplified,
      count: simplified.length
    };
  }
}

// Usage example
async function main() {
  const fetcher = new GHLCalendarFetcher('pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f');
  
  try {
    console.log('🔄 Fetching calendars...\n');
    
    // Test with current parameters
    const result = await fetcher.fetchCalendars('b7vHWUGVUNQGoIlAXabY', 'FIt5F2PbZVrK846aJeJF');
    
    console.log(`📡 API Response Status: ${result.statusCode}`);
    console.log(`📊 Rate Limit Remaining: ${result.headers['x-ratelimit-remaining']}/${result.headers['x-ratelimit-max']}`);
    console.log(`🆔 Trace ID: ${result.data.traceId}\n`);
    
    const formatted = fetcher.formatCalendarList(result.data.calendars);
    console.log(formatted.formatted);
    
    if (formatted.count > 0) {
      console.log('📋 Simplified JSON format:');
      console.log(JSON.stringify(formatted.simplified, null, 2));
    } else {
      console.log('💡 Try testing without groupId parameter:');
      console.log('node calendar_fetcher.js --no-group');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check command line arguments
if (process.argv.includes('--no-group')) {
  // Test without groupId
  const fetcher = new GHLCalendarFetcher('pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f');
  fetcher.fetchCalendars('b7vHWUGVUNQGoIlAXabY')
    .then(result => {
      console.log('🔄 Testing without groupId parameter...\n');
      const formatted = fetcher.formatCalendarList(result.data.calendars);
      console.log(formatted.formatted);
      if (formatted.count > 0) {
        console.log('📋 Simplified JSON format:');
        console.log(JSON.stringify(formatted.simplified, null, 2));
      }
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
    });
} else {
  main();
}

module.exports = GHLCalendarFetcher;
