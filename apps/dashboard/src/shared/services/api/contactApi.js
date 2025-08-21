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
 * 📞 GET - Fetch contact by ID using direct GHL API
 * Returns a specific contact by its ID
 */
export const fetchContactById = async (contactId) => {
  try {
    taskLogger.info('Fetching contact by ID via direct GHL API', { contactId });

    const response = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': GHL_CONFIG.version,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle 404 errors gracefully - contact doesn't exist
      if (response.status === 404) {
        taskLogger.warn('Contact not found (404)', { contactId });
        return {
          success: false,
          error: 'Contact not found',
          data: null,
          notFound: true,
        };
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.contact) {
      taskLogger.success('Contact fetched successfully via direct API', { contactId });
      return {
        success: true,
        data: result.contact,
      };
    } else {
      throw new Error(result.error || 'Invalid response structure');
    }

  } catch (error) {
    // Only log as error if it's not a 404 (which we handle above)
    if (!error.message.includes('404')) {
      taskLogger.error('Error fetching contact by ID', error);
    }
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

// ============================================================================
// 📤 PUT/POST REQUESTS
// ============================================================================

/**
 * 📞 PUT - Update contact by ID
 * Updates an existing contact using the provided curl structure
 */
export const updateContact = async (contactId, contactData) => {
  try {
    taskLogger.info('Updating contact', { contactId, contactData });

    // Validate required fields
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    // Prepare request body - exclude locationId as it should not be in the body for PUT requests
    const { locationId, ...cleanContactData } = contactData;
    const requestBody = {
      ...cleanContactData,
    };

    // Log the exact request being sent
    taskLogger.info('Request body prepared', { requestBody, excludedFields: { locationId } });

    const response = await fetch(
      `https://services.leadconnectorhq.com/contacts/${contactId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
          'Version': '2021-07-28',
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      taskLogger.error('Contact update failed', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        requestBody: requestBody,
        contactId: contactId,
      });

      // Parse error details if available
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;
      } catch (_e) {
        // Keep original error text if JSON parsing fails
      }

      throw new Error(`HTTP error! Status: ${response.status} - ${errorDetails}`);
    }

    const updatedContact = await response.json();
    taskLogger.success('Contact updated successfully', { contactId, updatedContact });

    return {
      success: true,
      data: updatedContact,
    };

  } catch (error) {
    taskLogger.error('Error updating contact', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * 📞 POST - Create new contact
 * Creates a new contact using the provided curl structure
 */
export const createContact = async (contactData) => {
  try {
    taskLogger.info('Creating new contact', { contactData });

    // Prepare request body with required fields
    const requestBody = {
      locationId: 'b7vHWUGVUNQGoIlAXabY',
      ...contactData,
    };

    // Log the exact request being sent
    taskLogger.info('Create contact request body prepared', { requestBody });

    const response = await fetch(
      'https://services.leadconnectorhq.com/contacts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
          'Version': '2021-07-28',
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      taskLogger.error('Contact creation failed', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        requestBody: requestBody,
      });

      // Parse error details if available
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;
      } catch (_e) {
        // Keep original error text if JSON parsing fails
      }

      throw new Error(`HTTP error! Status: ${response.status} - ${errorDetails}`);
    }

    const createdContact = await response.json();
    taskLogger.success('Contact created successfully', { createdContact });

    return {
      success: true,
      data: createdContact,
    };

  } catch (error) {
    taskLogger.error('Error creating contact', error);
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
 * � GET - Fetch users from GHL API
 * Returns a list of all users for the location
 */
export const fetchUsers = async () => {
  try {
    taskLogger.info('Fetching users from GHL API');

    // Use the correct GHL users endpoint with location ID parameter
    const params = new URLSearchParams({
      locationId: 'b7vHWUGVUNQGoIlAXabY',
    });

    const response = await fetch(`https://services.leadconnectorhq.com/users/?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
        'Version': '2021-07-28',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      taskLogger.error('GHL Users API error', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    taskLogger.info('Raw users API response', { result });

    // Handle different possible response structures from GHL API
    const users = result.users || result.data || result || [];

    taskLogger.success('Users fetched successfully from GHL API', { count: users.length });

    return {
      success: true,
      data: users,
    };

  } catch (error) {
    taskLogger.error('Error fetching users from GHL API', error);

    // Return mock users as fallback for development
    const mockUsers = [
      {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        name: 'John Doe',
      },
      {
        id: 'user-2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        name: 'Jane Smith',
      },
      {
        id: 'user-3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@example.com',
        name: 'Mike Johnson',
      },
      {
        id: 'user-4',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        name: 'Admin User',
      },
    ];

    taskLogger.warn('Using mock users data as fallback', { count: mockUsers.length });

    return {
      success: true,
      data: mockUsers,
    };
  }
};

/**
 * �📞 GET - Search contacts
 * Returns contacts based on search criteria using direct GHL API
 */
export const searchContacts = async (searchCriteria = {}) => {
  try {
    taskLogger.info('Searching contacts via direct GHL API', { searchCriteria });

    // Try direct GHL API
    try {
      const params = new URLSearchParams();
      if (searchCriteria.locationId) params.append('locationId', searchCriteria.locationId);
      if (searchCriteria.query) params.append('query', searchCriteria.query);
      if (searchCriteria.limit) params.append('limit', searchCriteria.limit);
      if (searchCriteria.skip) params.append('skip', searchCriteria.skip);

      const response = await fetch(`https://services.leadconnectorhq.com/contacts/?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${GHL_CONFIG.token}`,
          'Version': GHL_CONFIG.version,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();

        if (result.contacts) {
          const contacts = result.contacts || [];
          taskLogger.success('Contacts search completed via direct API', { count: contacts.length });

          return {
            success: true,
            data: contacts,
          };
        } else {
          throw new Error(result.error || 'Invalid response structure');
        }
      } else {
        throw new Error(`GHL API error: ${response.status}`);
      }
    } catch (apiError) {
      taskLogger.warn('GHL API not available, using mock data', apiError);
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
          `${GHL_CONFIG.locationUrl}/contacts/search`,
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

// Default export for the contact API functions
const contactApi = {
  fetchContactById,
  fetchContactsByIds,
  searchContacts,
  updateContact,
  createContact,
  testContactApiConnection,
};

export default contactApi;
