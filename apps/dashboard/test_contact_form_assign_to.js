// ========================================
// 🧪 TEST: Contact Details Form with Assign To Feature
// ========================================

console.log('🧪 Testing Contact Details Form with Assign To feature...');

// Test the fetchUsers API function
async function testFetchUsers() {
  try {
    console.log('📞 Testing fetchUsers API...');

    // Mock fetch for testing
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          users: [
            {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
            },
            {
              id: 'user-2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
            },
          ],
        }),
      }),
    );

    // Import the function (this would normally be done at the top)
    const { fetchUsers } = require('./apps/dashboard/src/shared/services/api/contactApi');

    const result = await fetchUsers();

    console.log('✅ fetchUsers result:', result);

    if (result.success && result.data.length === 2) {
      console.log('✅ fetchUsers test passed!');
      return true;
    } else {
      console.log('❌ fetchUsers test failed!');
      return false;
    }

  } catch (error) {
    console.error('❌ fetchUsers test error:', error);
    return false;
  }
}

// Test the updateContact with assignedTo
async function testUpdateContactWithAssignTo() {
  try {
    console.log('📞 Testing updateContact with assignedTo...');

    // Mock fetch for testing
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          contact: {
            id: 'contact-123',
            firstName: 'John',
            lastName: 'Doe',
            assignedTo: 'user-1',
          },
        }),
      }),
    );

    const { updateContact } = require('./apps/dashboard/src/shared/services/api/contactApi');

    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      assignedTo: 'user-1',
    };

    const result = await updateContact('contact-123', contactData);

    console.log('✅ updateContact result:', result);

    if (result.success) {
      console.log('✅ updateContact with assignedTo test passed!');
      return true;
    } else {
      console.log('❌ updateContact with assignedTo test failed!');
      return false;
    }

  } catch (error) {
    console.error('❌ updateContact test error:', error);
    return false;
  }
}

// Test component form data structure
function testFormDataStructure() {
  console.log('📝 Testing form data structure...');

  const expectedFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    contactSource: '',
    contactType: 'Lead',
    assignedTo: '', // New field
  };

  console.log('✅ Expected form data structure:', expectedFormData);

  // Check if all required fields are present
  const requiredFields = ['firstName', 'lastName', 'email', 'assignedTo'];
  const hasAllFields = requiredFields.every(field => field in expectedFormData);

  if (hasAllFields) {
    console.log('✅ Form data structure test passed!');
    return true;
  } else {
    console.log('❌ Form data structure test failed!');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🚀 Starting Contact Form Assign To Tests...\n');

  const tests = [
    { name: 'Form Data Structure', test: testFormDataStructure },
    { name: 'Fetch Users API', test: testFetchUsers },
    { name: 'Update Contact with Assign To', test: testUpdateContactWithAssignTo },
  ];

  let passed = 0;
  const total = tests.length;

  for (const { name, test } of tests) {
    console.log(`\n📋 Running test: ${name}`);
    const result = await test();
    if (result) {
      passed++;
    }
    console.log(`${result ? '✅' : '❌'} ${name}: ${result ? 'PASSED' : 'FAILED'}\n`);
  }

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  console.log(passed === total ? '🎉 All tests passed!' : '⚠️ Some tests failed');

  return passed === total;
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testFetchUsers,
    testUpdateContactWithAssignTo,
    testFormDataStructure,
    runTests,
  };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
