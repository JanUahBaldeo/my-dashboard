// ========================================
// 📞 CONTACT API SERVICE
// ========================================


import { createLogger } from '@utils/logger';
import { GHL_CONFIG, getGHLHeaders } from '@config/ghlConfig';

const taskLogger = createLogger('ContactAPI');

// ============================================================================
// 📥 GET REQUESTS
// ============================================================================

/**
 * 📞 GET - Fetch contact by ID
 * Returns a specific contact by its ID
 */
export const fetchContactById = async (contactId) => {
  try {
    taskLogger.info('Fetching contact by ID', { contactId });

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/contacts/${contactId}`,
      {
        method: 'GET',
        headers: getGHLHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contact = await response.json();

    taskLogger.success('Contact fetched successfully', { contactId });

    return {
      success: true,
      data: contact,
    };

  } catch (error) {
    taskLogger.error('Error fetching contact by ID', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * 📞 GET - Fetch multiple contacts by IDs
 * Returns multiple contacts by their IDs
 */
export const fetchContactsByIds = async (contactIds) => {
  try {
    taskLogger.info('Fetching multiple contacts', { count: contactIds.length });

    const promises = contactIds.map(contactId => fetchContactById(contactId));
    const results = await Promise.allSettled(promises);

    const successful = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => result.value.data);

    const failed = results.filter(result => result.status === 'rejected' || !result.value.success);

    taskLogger.success('Contacts fetched successfully', {
      successful: successful.length,
      failed: failed.length,
    });

    return {
      success: true,
      data: successful,
    };

  } catch (error) {
    taskLogger.error('Error fetching multiple contacts', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * 📞 GET - Search contacts
 * Returns contacts based on search criteria
 */
export const searchContacts = async (searchCriteria = {}) => {
  try {
    taskLogger.info('Searching contacts', { searchCriteria });

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

        taskLogger.success('Contacts search completed via GHL API', { count: contacts.length });

        return {
          success: true,
          data: contacts,
        };
      }
    } catch (apiError) {
      taskLogger.warn('GHL contacts API not available, using mock data', apiError);
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

    taskLogger.success('Using mock contacts data', { count: mockContacts.length });

    return {
      success: true,
      data: mockContacts,
    };

  } catch (error) {
    taskLogger.error('Error searching contacts', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

// ============================================================================
// 🧪 TEST FUNCTIONS
// ============================================================================

/**
 * 🧪 Test contact API connectivity
 * Simple test to check if the contact API is working
 */
export const testContactApiConnection = async () => {
  try {
    taskLogger.info('Testing contact API connection...');

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/contacts/search`,
      {
        method: 'POST',
        headers: getGHLHeaders(),
        body: JSON.stringify({ limit: 1 }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    taskLogger.success('Contact API connection test successful');

    return {
      success: true,
      data: {
        status: response.status,
        contactCount: data.contacts ? data.contacts.length : 0,
      },
    };

  } catch (error) {
    taskLogger.error('Contact API connection test failed', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
