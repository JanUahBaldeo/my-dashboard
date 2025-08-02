// ========================================
// 🎯 TASK CREATION TEST SCRIPT
// ========================================

// Test script to verify task creation works
// Run this after updating your token: node test-task-creation.js

const GHL_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com/locations/b7vHWUGVUNQGoIlAXabY',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f', // ⚠️ UPDATE THIS TOKEN ⚠️
  version: '2021-07-28',
  locationId: 'b7vHWUGVUNQGoIlAXabY',
};

const getGHLHeaders = () => ({
  Accept: 'application/json',
  Authorization: `Bearer ${GHL_CONFIG.token}`,
  'Content-Type': 'application/json',
  Version: GHL_CONFIG.version,
});

async function testTaskCreation() {
  console.log('🔍 Testing GHL Task Creation...\n');

  try {
    // Test task creation
    console.log('📝 Creating test task...');
    const testTaskData = {
      title: 'Test Task from Dashboard',
      body: 'This is a test task created from the dashboard integration',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      isLocation: true,
      locationId: GHL_CONFIG.locationId,
    };

    const response = await fetch(`${GHL_CONFIG.baseUrl}/tasks`, {
      method: 'POST',
      headers: getGHLHeaders(),
      body: JSON.stringify(testTaskData),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Task created successfully!');
      console.log(`📊 Task ID: ${data._id || data.id}`);
      console.log(`📝 Title: ${data.title}`);
    } else {
      const errorText = await response.text();
      console.log('❌ Task creation failed!');
      console.log(`Error: ${errorText}`);
    }

  } catch (error) {
    console.log('❌ Task creation error:', error.message);
  }

  console.log('\n📝 Next steps:');
  console.log('1. If successful, your React app should now work!');
  console.log('2. If failed, check the error message above');
  console.log('3. Make sure your token has "Tasks: Write" permission');
}

testTaskCreation();
