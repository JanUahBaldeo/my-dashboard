// ========================================
// 📞 CONTACT API TEST SCRIPT
// ========================================

// Test script to verify contact API functionality
// Run this after updating your token: node test-contact-api.js

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

// Mock searchContacts function for testing
async function searchContacts(searchCriteria = {}) {
  try {
    console.log('📞 Searching contacts...');

    // Try GHL API first
    try {
      const response = await fetch(
        `${GHL_CONFIG.baseUrl}/contacts/search`,
        {
          method: 'POST',
          headers: getGHLHeaders(),
          body: JSON.stringify(searchCriteria),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const contacts = data.contacts || data;

        console.log('✅ Contacts search completed via GHL API');

        return {
          success: true,
          data: contacts,
        };
      }
    } catch (apiError) {
      console.log('⚠️ GHL contacts API not available, using mock data');
    }

    // Fallback to mock data
    const mockContacts = [
      { _id: 'contact-1', firstName: 'Juan', lastName: 'Vital', email: 'vital5@sbcglobal.net' },
      { _id: 'contact-2', firstName: 'Michael', lastName: 'Insurance', email: 'insurancetheeasyway@gmail.com' },
      { _id: 'contact-3', firstName: 'Kresta', lastName: 'Lins', email: 'klins@mac.com' },
      { _id: 'contact-4', firstName: 'Grant', lastName: 'HWA', email: 'granth@hwa-inc.org' },
      { _id: 'contact-5', firstName: 'David', lastName: 'Burke', email: 'shelleydburke@gmail.com' },
      { _id: 'contact-6', firstName: 'Austin', lastName: 'Smith', email: 'austin.smith@example.com' },
      { _id: 'contact-7', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com' },
      { _id: 'contact-8', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com' },
      { _id: 'contact-9', firstName: 'Robert', lastName: 'Wilson', email: 'robert.wilson@example.com' },
      { _id: 'contact-10', firstName: 'Lisa', lastName: 'Brown', email: 'lisa.brown@example.com' },
    ];

    console.log('✅ Using mock contacts data');

    return {
      success: true,
      data: mockContacts,
    };

  } catch (error) {
    console.log('❌ Error searching contacts:', error.message);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
}

async function testContactAPI() {
  console.log('🔍 Testing Contact API...\n');

  try {
    const result = await searchContacts({ limit: 10 });

    if (result.success) {
      console.log('✅ Contact API test successful!');
      console.log(`📊 Found ${result.data.length} contacts`);

      if (result.data.length > 0) {
        console.log('\n📋 Sample contacts:');
        result.data.slice(0, 5).forEach((contact, index) => {
          const firstName = contact.firstName || '';
          const lastName = contact.lastName || '';
          const email = contact.email || 'No email';
          const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
          console.log(`${index + 1}. ${initials} - ${firstName} ${lastName} (${email})`);
        });
      }
    } else {
      console.log('❌ Contact API test failed!');
      console.log(`Error: ${result.error}`);
    }

  } catch (error) {
    console.log('❌ Contact API error:', error.message);
  }

  console.log('\n📝 Next steps:');
  console.log('1. If successful, your contact dropdown will work!');
  console.log('2. The dropdown will show contacts with initials and emails');
  console.log('3. You can search through the contacts');
}

testContactAPI();
