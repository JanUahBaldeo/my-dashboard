const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Helper function to determine online status
const isUserOnline = (user) => {
  if (!user.lastActive && !user.lastLogin) return false;
  
  const lastActivityTime = user.lastActive || user.lastLogin;
  const lastActivity = new Date(lastActivityTime);
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  return lastActivity > fiveMinutesAgo;
};

// Helper function to determine user plan
const getUserPlan = (user) => {
  // This logic can be customized based on actual API response structure
  if (user.subscription && user.subscription.plan) {
    return user.subscription.plan;
  }
  if (user.plan) {
    return user.plan;
  }
  if (user.permissions && Array.isArray(user.permissions) && user.permissions.includes('admin')) {
    return 'Premium';
  }
  return 'Free';
};

// Helper function to get user role
const getUserRole = (user) => {
  if (user.role) return user.role;
  if (user.type) return user.type;
  if (user.permissions && Array.isArray(user.permissions) && user.permissions.includes('admin')) return 'Admin';
  return 'Loan Officer';
};

// Helper function to map API response to profile object
const mapUserToProfile = (user, locationId) => {
  const online = isUserOnline(user);
  const plan = getUserPlan(user);
  const role = getUserRole(user);
  
  return {
    id: user.id || user.userId,
    name: user.name || user.firstName + ' ' + user.lastName || user.email,
    email: user.email,
    avatar: user.profilePhoto || user.avatar || user.photo || null,
    role: role,
    online: online,
    plan: plan,
    labels: {
      planBadge: plan,
      presenceBadge: online ? 'online' : 'offline'
    },
    phone: user.phone || user.phoneNumber || null,
    locationId: locationId,
    _raw: user
  };
};

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main API endpoint
app.get('/v2/location/:locationId/settings/staff/team', async (req, res) => {
  try {
    // Extract parameters
    const { locationId } = req.params;
    const { userid } = req.query;

    // Validate required parameters
    if (!userid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'userid query parameter is required'
      });
    }

    // Check if API key is configured
    const apiKey = process.env.LC_API_KEY || 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';
    if (!apiKey || apiKey === 'your_leadconnector_api_key_here') {
      console.log(`🔧 No valid API key configured, returning mock data for userid: ${userid}`);
      
      // Return mock profile data for testing
      const mockProfile = mapUserToProfile({
        id: userid,
        name: `Demo User ${userid.slice(-4)}`,
        firstName: 'Demo',
        lastName: `User ${userid.slice(-4)}`,
        email: `demo.user${userid.slice(-4)}@example.com`,
        phone: '+1-555-0123',
        profilePhoto: 'https://i.pravatar.cc/150?img=3',
        role: 'Loan Officer',
        plan: 'Premium',
        lastActive: new Date().toISOString(),
        permissions: ['admin']
      }, locationId);

      return res.json({ 
        profile: mockProfile,
        _demo: true,
        _message: 'Using mock data - set LC_API_KEY environment variable for real data'
      });
    }

    // Call LeadConnector API
    const apiUrl = `https://services.leadconnectorhq.com/users/${userid}`;
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28'
    };

    console.log(`Fetching user data for userid: ${userid}, locationId: ${locationId}`);
    
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LeadConnector API error: ${response.status} - ${errorText}`);
      
      return res.status(502).json({
        error: 'Bad Gateway',
        message: `LeadConnector API error: ${response.status}`,
        details: response.status === 401 ? 'Invalid API key' : 'API request failed'
      });
    }

    const userData = await response.json();
    console.log('Successfully fetched user data from LeadConnector API');

    // Map the response to our profile format
    const profile = mapUserToProfile(userData, locationId);

    res.json({ profile });

  } catch (error) {
    console.error('Server error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(502).json({
        error: 'Bad Gateway',
        message: 'Failed to connect to LeadConnector API',
        details: 'Network or DNS error'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  const apiKey = process.env.LC_API_KEY || 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f';
  const hasValidApiKey = apiKey && apiKey !== 'your_leadconnector_api_key_here';
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/healthz`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/v2/location/:locationId/settings/staff/team?userid=USER_ID`);
  console.log(`🔑 LC_API_KEY configured: ${hasValidApiKey ? '✅ Yes (real data)' : '❌ No (using mock data)'}`);
});

module.exports = app;
