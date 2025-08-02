// 🚀 Pipeline API Service
// Handles all pipeline-related API calls for leads, tags, and real-time updates

import { toast } from 'react-hot-toast';
import { apiLogger } from '@utils/logger';
import { API_CONFIG, PIPELINE_CONFIG, FEATURE_FLAGS } from '@config/environment';
import { cleanTags, categorizeLeadsByStage, calculatePipelineMetrics } from './pipelineUtils';

// 🔧 API Configuration from environment
const LEAD_CONNECTOR_CONFIG = API_CONFIG.LEAD_CONNECTOR;
const PIPELINE_STAGES = PIPELINE_CONFIG.STAGES;
const STAGE_TAGS = PIPELINE_CONFIG.STAGE_TAGS;

// ============================================================================
// 📥 GET REQUESTS
// ============================================================================

/**
 * 🎯 GET - Fetch all leads with pipeline metrics
 * Returns leads categorized by stage with real-time metrics
 */
/**
 * 🔄 Fetch all contacts with pagination support
 * Automatically fetches all pages from GoHighLevel API
 */
const fetchAllContacts = async () => {
  const allContacts = [];
  let page = 1;
  let hasMorePages = true;
  const maxPages = 100; // Safety limit to prevent infinite loops
  const pageSize = 100; // Number of contacts per page

  apiLogger.info('Starting to fetch all contacts with pagination');

  while (hasMorePages && page <= maxPages) {
    try {
      if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
        apiLogger.debug(`Fetching page ${page} of contacts`);
      }

      // Try different pagination parameters that GoHighLevel might use
      const urlParams = new URLSearchParams({
        locationId: LEAD_CONNECTOR_CONFIG.locationId,
        limit: pageSize.toString(),
      });

      // Add page parameter - try different formats
      if (page > 1) {
        urlParams.append('page', page.toString());
        // Also try 'offset' if 'page' doesn't work
        // urlParams.append('offset', ((page - 1) * pageSize).toString());
      }

    const response = await fetch(
        `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?${urlParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      },
    );

    if (!response.ok) {
        const errorText = await response.text();
        apiLogger.error(`HTTP error on page ${page}`, null, {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

      if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
        apiLogger.debug(`Page ${page} response structure:`, {
      keys: Object.keys(data),
          hasContacts: !!data.contacts,
          hasData: !!data.data,
          hasResults: !!data.results,
          isArray: Array.isArray(data),
    });
      }

    // Handle different response structures
      let pageContacts = [];
    if (Array.isArray(data)) {
        pageContacts = data;
    } else if (data.contacts && Array.isArray(data.contacts)) {
        pageContacts = data.contacts;
    } else if (data.data && Array.isArray(data.data)) {
        pageContacts = data.data;
    } else if (data.results && Array.isArray(data.results)) {
        pageContacts = data.results;
      } else if (data.items && Array.isArray(data.items)) {
        pageContacts = data.items;
      }

      // Check if we have contacts on this page
      if (pageContacts.length === 0) {
        hasMorePages = false;
        if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
          apiLogger.debug(`No more contacts found on page ${page}`);
        }
    } else {
        allContacts.push(...pageContacts);
        if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
          apiLogger.debug(`Fetched ${pageContacts.length} contacts from page ${page}`);
        }

        // Check if we've reached the end (less than limit means last page)
        if (pageContacts.length < pageSize) {
          hasMorePages = false;
          if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
            apiLogger.debug(`Reached last page (${pageContacts.length} < ${pageSize})`);
          }
        }

        // Also check for pagination metadata in response
        if (data.pagination) {
          const { currentPage, totalPages, hasNextPage } = data.pagination;
          if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
            apiLogger.debug('Pagination metadata found:', { currentPage, totalPages, hasNextPage });
          }
          if (hasNextPage === false) {
            hasMorePages = false;
          }
        }
      }

      page++;

      // Add a small delay to avoid rate limiting
      if (hasMorePages) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

    } catch (error) {
      apiLogger.error(`Error fetching page ${page}`, error);
      throw error;
    }
  }

  apiLogger.success('Successfully fetched all contacts', {
    totalContacts: allContacts.length,
    totalPages: page - 1,
  });

  return allContacts;
};

export const fetchPipelineLeads = async () => {
  try {
    // Fetch all contacts with pagination
    const allContacts = await fetchAllContacts();

    if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
      apiLogger.debug('API Response Data', {
        totalContacts: allContacts.length,
        sampleContact: allContacts[0],
      });
    }

    // Transform and categorize leads by stage
    const categorizedLeads = categorizeLeadsByStage(allContacts);

    if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
      apiLogger.debug('Categorized leads', {
        totalStages: Object.keys(categorizedLeads).length,
        totalLeads: Object.values(categorizedLeads).reduce((sum, leads) => sum + leads.length, 0),
      });
    }

    // Calculate metrics for each stage
    const pipelineMetrics = calculatePipelineMetrics(categorizedLeads);

    return {
      success: true,
      data: {
        leads: categorizedLeads,
        metrics: pipelineMetrics,
        stages: PIPELINE_STAGES,
      },
    };

  } catch (error) {
    apiLogger.error('Error fetching pipeline leads', error);
    return {
      success: false,
      error: error.message,
      data: { leads: {}, metrics: {}, stages: PIPELINE_STAGES },
    };
  }
};

/**
 * 🏷️ GET - Fetch tags for specific stage
 * Returns available tags for a specific pipeline stage
 */
export const fetchStageTags = async (stageName) => {
  try {
    return {
      success: true,
      data: STAGE_TAGS[stageName] || [],
    };
  } catch (error) {
    console.error('❌ Error fetching stage tags:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * 🏷️ GET - Fetch all available tags
 * Returns list of all available tags for leads
 */
export const fetchAvailableTags = async () => {
  try {
    // Combine all stage tags
    const allTags = Object.values(STAGE_TAGS).flat();
    const uniqueTags = [...new Set(allTags)];

    return {
      success: true,
      data: uniqueTags,
    };
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * 📊 GET - Fetch pipeline metrics and analytics
 * Returns real-time metrics for each pipeline stage
 */
export const fetchPipelineMetrics = async () => {
  try {
    const leadsResponse = await fetchPipelineLeads();

    if (!leadsResponse.success) {
      throw new Error(leadsResponse.error);
    }

    const metrics = calculateDetailedMetrics(leadsResponse.data.leads);

    return {
      success: true,
      data: metrics,
    };

  } catch (error) {
    console.error('❌ Error fetching pipeline metrics:', error);
    return {
      success: false,
      error: error.message,
      data: {},
    };
  }
};

/**
 * 🔍 GET - Fetch leads by specific stage
 * Returns leads for a specific pipeline stage
 */
export const fetchLeadsByStage = async (stageName) => {
  try {
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      },
    );

    if (!response.ok) {
      console.error(`❌ API Response Error for stage ${stageName}:`, response.status, response.statusText);
      return {
        success: false,
        error: `HTTP error! Status: ${response.status}`,
        data: [],
      };
    }

    const data = await response.json();
    console.log(`📊 API Response Data for stage ${stageName}:`, data);

    const leads = data.contacts || data || [];

    // Filter leads by stage
    const stageLeads = leads.filter(lead => {
      const leadStage = lead.customField?.stage || lead.stage || 'New Lead';
      return leadStage === stageName;
    });

    return {
      success: true,
      data: stageLeads,
    };

  } catch (error) {
    console.error(`❌ Error fetching leads for stage ${stageName}:`, error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

// ============================================================================
// 📤 POST REQUESTS
// ============================================================================

/**
 * ➕ POST - Create new lead
 * Creates a new lead and assigns to specified pipeline stage
 */
export const createNewLead = async (leadData) => {
  try {
    const { name, email, phone, address, loanType, loanAmount, closeDate, stage, tags, notes } = leadData;

    console.log('🆕 Creating new lead with data:', leadData);

    // Validate required fields
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    // Automatically assign the stage tag based on the stage
    const stageToUse = stage || 'New Lead';
    const stageTag = STAGE_TAGS[stageToUse] ? STAGE_TAGS[stageToUse][0] : 'New Lead';
    const finalTags = tags ? [...tags, stageTag] : [stageTag];

    const leadPayload = {
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ').slice(1).join(' ') || '',
      email: email,
      phone: phone || '',
      address: address || '',
      customField: {
        stage: stageToUse,
        loanType: loanType || 'Conventional',
        loanAmount: loanAmount || 0,
        closeDate: closeDate || '',
        tags: finalTags,
        notes: notes || '',
        status: 'On Track',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    console.log('🆕 Lead payload:', leadPayload);

    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify(leadPayload),
      },
    );

    console.log('🆕 Response status:', response.status);
    console.log('🆕 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🆕 Error response body:', errorText);
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const newLead = await response.json();
    console.log('🆕 Created lead response:', newLead);

    toast.success('✅ Lead created successfully!');

    return {
      success: true,
      data: newLead,
    };

  } catch (error) {
    console.error('❌ Error creating lead:', error);
    toast.error(`❌ Failed to create lead: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 🏷️ POST - Add tags to lead
 * Adds tags to a specific lead
 */
export const addTagsToLead = async (leadId, tags) => {
  try {
    if (!leadId || !tags || tags.length === 0) {
      throw new Error('Lead ID and tags are required');
    }

    // Clean tags to only include main stage tags
    const cleanedTags = cleanTags(tags);
    console.log('🧹 Original tags:', tags);
    console.log('🧹 Cleaned tags:', cleanedTags);

    // Update in LeadConnector
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify({
          customField: {
            tags: cleanedTags,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success('✅ Tags updated successfully!');

    return {
      success: true,
      data: { leadId, tags: cleanedTags },
    };

  } catch (error) {
    console.error('❌ Error adding tags:', error);
    toast.error(`❌ Failed to update tags: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 📊 POST - Update lead stage (move between pipeline stages)
 * Moves a lead from one stage to another
 */
export const moveLeadToStage = async (leadId, newStage, oldStage) => {
  try {
    if (!leadId || !newStage) {
      throw new Error('Lead ID and new stage are required');
    }

    // Get the appropriate tag for the new stage
    const newStageTag = STAGE_TAGS[newStage] ? STAGE_TAGS[newStage][0] : 'New Lead';

    // Remove old stage tag and add new stage tag
    const oldStageTag = STAGE_TAGS[oldStage] ? STAGE_TAGS[oldStage][0] : null;

    // First, get current tags to update them
    const currentResponse = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      },
    );

    let currentTags = [];
    if (currentResponse.ok) {
      const currentData = await currentResponse.json();
      currentTags = currentData.customField?.tags || currentData.tags || [];
    }

    // Remove old stage tag and add new stage tag
    const updatedTags = currentTags
      .filter(tag => tag !== oldStageTag)
      .concat([newStageTag]);

    // Update in LeadConnector with new stage and tags
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify({
          customField: {
            stage: newStage,
            tags: updatedTags,
            updatedAt: new Date().toISOString(),
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success(`✅ Lead moved to ${newStage}`);

    return {
      success: true,
      data: { leadId, newStage, oldStage, tags: updatedTags },
    };

  } catch (error) {
    console.error('❌ Error moving lead:', error);
    toast.error(`❌ Failed to move lead: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 📝 POST - Update lead details
 * Updates lead information
 */
export const updateLeadDetails = async (leadId, updates) => {
  try {
    if (!leadId || !updates) {
      throw new Error('Lead ID and updates are required');
    }

    // Update in LeadConnector
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify({
          firstName: updates.name?.split(' ')[0] || '',
          lastName: updates.name?.split(' ').slice(1).join(' ') || '',
          email: updates.email,
          phone: updates.phone,
          address: updates.address,
          customField: {
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success('✅ Lead updated successfully!');

    return {
      success: true,
      data: { leadId, updates },
    };

  } catch (error) {
    console.error('❌ Error updating lead:', error);
    toast.error(`❌ Failed to update lead: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 🗑️ DELETE - Delete lead
 * Removes a lead from the system
 */
export const deleteLead = async (leadId) => {
  try {
    if (!leadId) {
      throw new Error('Lead ID is required');
    }

    // Delete from LeadConnector
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${leadId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success('✅ Lead deleted successfully!');

    return {
      success: true,
      data: { leadId },
    };

  } catch (error) {
    console.error('❌ Error deleting lead:', error);
    toast.error(`❌ Failed to delete lead: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================================
// 🔄 REAL-TIME UPDATES
// ============================================================================

/**
 * 🔄 Manual refresh from LeadConnector
 * Fetches fresh data from LeadConnector API and updates local state
 */
export const refreshPipelineData = async () => {
  try {
    console.log('🔄 Manually refreshing pipeline data from LeadConnector...');

    const response = await fetchPipelineLeads();

    if (response.success) {
      console.log('✅ Pipeline data refreshed successfully');
      return response;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('❌ Error refreshing pipeline data:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 🔄 Setup periodic refresh for pipeline updates
 * Refreshes data from LeadConnector periodically
 */
export const setupRealtimeUpdates = (onUpdate) => {
  // Set up periodic refresh from LeadConnector (every 30 seconds)
  const refreshInterval = setInterval(async () => {
    try {
      console.log('🔄 Periodic refresh from LeadConnector...');
      const response = await fetchPipelineLeads();

      if (response.success) {
        // Trigger update callback with fresh data
        onUpdate({
          eventType: 'REFRESH',
          data: response.data,
        });
        console.log('✅ Periodic refresh completed');
      }
    } catch (error) {
      console.error('❌ Periodic refresh failed:', error);
    }
  }, 30000); // 30 seconds

  return () => {
    clearInterval(refreshInterval);
  };
};

// ============================================================================
// 🧪 TEST FUNCTIONS
// ============================================================================

/**
 * 🧪 Test API connectivity
 * Simple test to check if the API is working
 */
export const testApiConnection = async () => {
  try {
    if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
      apiLogger.debug('Testing API connection...', {
      baseUrl: LEAD_CONNECTOR_CONFIG.baseUrl,
      locationId: LEAD_CONNECTOR_CONFIG.locationId,
      version: LEAD_CONNECTOR_CONFIG.version,
        tokenPreview: LEAD_CONNECTOR_CONFIG.token.substring(0, 10) + '...',
    });
    }

    // Test with a single page first to verify connection
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}&page=1&limit=1`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      },
    );

    if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
      apiLogger.debug('API Response Status:', { status: response.status });
    }

    if (!response.ok) {
      const errorText = await response.text();
      apiLogger.error('API connection failed', null, {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
      apiLogger.success('API connection test successful');
    }

    return {
      success: true,
      data: data,
    };

  } catch (error) {
    apiLogger.error('API connection test failed', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 🧪 Test if there are any contacts in LeadConnector
 * Simple test to check if the account has any contacts
 */
export const testContactsExist = async () => {
  try {
    if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
      apiLogger.debug('Testing if contacts exist in LeadConnector...');
    }

    // Use the same pagination function to get accurate count
    const allContacts = await fetchAllContacts();
    const contactsCount = allContacts.length;

    if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGGING) {
      apiLogger.info(`Found ${contactsCount} contacts in LeadConnector`);
    }

    return {
      success: true,
      data: {
        contactsCount,
        hasContacts: contactsCount > 0,
        totalPages: Math.ceil(contactsCount / 100),
        rawData: { totalContacts: contactsCount },
      },
    };

  } catch (error) {
    apiLogger.error('Error testing contacts', error);
    return {
      success: false,
      error: error.message,
      data: {
        contactsCount: 0,
        hasContacts: false,
        totalPages: 0,
        rawData: null,
      },
    };
  }
};

// ============================================================================
// 🛠️ HELPER FUNCTIONS
// ============================================================================

// Note: Utility functions have been moved to pipelineUtils.js
// Import them from './pipelineUtils' instead of defining them here

/**
 * 🧪 Test pagination functionality
 * Tests if the API supports pagination and fetches multiple pages
 */
export const testPagination = async () => {
  try {
    apiLogger.info('Testing pagination functionality...');

    // Test first page
    const response1 = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}&page=1&limit=10`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      },
    );

    if (!response1.ok) {
      throw new Error(`HTTP error! Status: ${response1.status}`);
    }

    const data1 = await response1.json();
    const page1Contacts = data1.contacts || data1.data || data1.results || data1 || [];

    apiLogger.info(`Page 1: Found ${page1Contacts.length} contacts`);

    // Test second page if first page is full
    if (page1Contacts.length === 10) {
      const response2 = await fetch(
        `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}&page=2&limit=10`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
            'Version': LEAD_CONNECTOR_CONFIG.version,
          },
        },
      );

      if (response2.ok) {
        const data2 = await response2.json();
        const page2Contacts = data2.contacts || data2.data || data2.results || data2 || [];

        apiLogger.info(`Page 2: Found ${page2Contacts.length} contacts`);

        return {
          success: true,
          data: {
            paginationWorks: true,
            page1Count: page1Contacts.length,
            page2Count: page2Contacts.length,
            totalTested: page1Contacts.length + page2Contacts.length,
          },
        };
      }
    }

    return {
      success: true,
      data: {
        paginationWorks: page1Contacts.length < 10, // If less than limit, might be all data
        page1Count: page1Contacts.length,
        page2Count: 0,
        totalTested: page1Contacts.length,
      },
    };

  } catch (error) {
    apiLogger.error('Pagination test failed', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export { PIPELINE_STAGES, STAGE_TAGS };
