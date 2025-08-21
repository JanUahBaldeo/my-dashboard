/**
 * 🧹 Script to clean up contacts with multiple stage tags
 * Run this script to fix contacts that have multiple stage tags
 */

// You'll need to replace these with your actual contact IDs
const CONTACTS_TO_CLEANUP = [
  // Add the contact IDs that have multiple stage tags
  // Example: 'contact-id-1', 'contact-id-2'
];

// Mock the API functions for testing (you can import from your actual API file)
const LEAD_CONNECTOR_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f', // Your actual token
  locationId: 'b7vHWUGVUNQGoIlAXabY', // Your actual location ID
  version: '2021-07-28',
};

const apiLogger = {
  info: (msg, data) => console.log(`ℹ️  INFO: ${msg}`, data || ''),
  success: (msg, data) => console.log(`✅ SUCCESS: ${msg}`, data || ''),
  error: (msg, error, data) => console.error(`❌ ERROR: ${msg}`, error, data || ''),
  debug: (msg, data) => console.log(`🔍 DEBUG: ${msg}`, data || ''),
};

/**
 * Clean up a single contact's stage tags
 */
const cleanupContactStageTags = async (contactId) => {
  try {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    const cleanContactId = contactId.includes('-') ? contactId.split('-')[0] : contactId;

    console.log(`\n🧹 Cleaning up contact: ${cleanContactId}`);

    // Fetch current contact data
    const getContactResponse = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${cleanContactId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      },
    );

    if (!getContactResponse.ok) {
      throw new Error(`Failed to fetch contact: ${getContactResponse.status}`);
    }

    const contactData = await getContactResponse.json();
    const contact = contactData.contact || contactData;
    const currentTags = contact.tags || [];

    console.log(`📋 Current tags for ${contact.firstName || 'Unknown'} ${contact.lastName || ''}:`, currentTags);

    // Define all possible stage tag variations
    const allStageTagValues = [
      'new lead', 'New Lead', 'NEW LEAD',
      'contacted', 'Contacted', 'CONTACTED',
      'application started', 'Application Started', 'APPLICATION STARTED',
      'pre-approved', 'Pre-Approved', 'PRE-APPROVED', 'Pre Approved', 'pre approved',
      'in underwriting', 'In Underwriting', 'IN UNDERWRITING',
      'closed', 'Closed', 'CLOSED',
    ];

    // Find stage tags in current tags
    const foundStageTags = currentTags.filter(tag => {
      if (!tag || typeof tag !== 'string') return false;
      const lowerTag = tag.toLowerCase().trim();
      const lowerStageTagValues = allStageTagValues.map(stageTag => stageTag.toLowerCase().trim());
      return lowerStageTagValues.includes(lowerTag);
    });

    console.log(`🏷️  Found ${foundStageTags.length} stage tags:`, foundStageTags);

    // If no multiple stage tags, no cleanup needed
    if (foundStageTags.length <= 1) {
      apiLogger.info('No tag cleanup needed', { contactId: cleanContactId, currentStageTags: foundStageTags });
      return { success: true, message: 'No cleanup needed', stageTagCount: foundStageTags.length };
    }

    // Determine highest priority stage from found tags
    const stagePriority = [
      'new lead', 'contacted', 'application started', 'pre-approved', 'in underwriting', 'closed',
    ];

    let highestPriorityStage = 'New Lead';
    let highestPriorityIndex = -1;

    foundStageTags.forEach(tag => {
      const lowerTag = tag.toLowerCase().trim();
      const priorityIndex = stagePriority.indexOf(lowerTag);
      if (priorityIndex > highestPriorityIndex) {
        highestPriorityIndex = priorityIndex;
        // Convert to proper case
        const stageMap = {
          'new lead': 'New Lead',
          'contacted': 'Contacted',
          'application started': 'Application Started',
          'pre-approved': 'Pre-Approved',
          'in underwriting': 'In Underwriting',
          'closed': 'Closed',
        };
        highestPriorityStage = stageMap[lowerTag] || 'New Lead';
      }
    });

    console.log(`🎯 Highest priority stage determined: ${highestPriorityStage}`);

    // Remove all stage tags and keep only the highest priority one
    const nonStageTags = currentTags.filter(tag => {
      if (!tag || typeof tag !== 'string') return false;
      const lowerTag = tag.toLowerCase().trim();
      const lowerStageTagValues = allStageTagValues.map(stageTag => stageTag.toLowerCase().trim());
      return !lowerStageTagValues.includes(lowerTag);
    });

    const cleanedTags = [...nonStageTags, highestPriorityStage];

    console.log('🧽 Cleaned tags:', cleanedTags);

    // Update the contact
    const updatePayload = {
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      tags: cleanedTags,
      customFields: [
        {
          key: 'stage',
          field_value: highestPriorityStage,
        },
      ],
    };

    console.log('🚀 Updating contact with payload:', updatePayload);

    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/${cleanContactId}?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
        body: JSON.stringify(updatePayload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to clean up tags: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();

    apiLogger.success('Tags cleaned up successfully', {
      contactId: cleanContactId,
      originalTags: currentTags,
      removedStageTags: foundStageTags,
      keptStage: highestPriorityStage,
      finalTags: cleanedTags,
    });

    return {
      success: true,
      data: {
        contactId: cleanContactId,
        removedStageTags: foundStageTags,
        keptStage: highestPriorityStage,
        finalTags: cleanedTags,
        response: responseData,
      },
    };

  } catch (error) {
    apiLogger.error('Error cleaning up contact stage tags', error, { contactId });
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Run cleanup for all specified contacts
 */
const runCleanupProcess = async () => {
  console.log('🧹 Starting Contact Stage Tag Cleanup Process');
  console.log('==============================================');

  if (CONTACTS_TO_CLEANUP.length === 0) {
    console.log(`
❗ No contacts specified for cleanup!

To use this script:
1. Add the contact IDs to the CONTACTS_TO_CLEANUP array at the top of this file
2. Contact IDs can be found in your GoHighLevel dashboard or by checking the browser network tab
3. Example: ['contact-id-1', 'contact-id-2']

You can also test with a single contact by calling:
await cleanupContactStageTags('your-contact-id-here');
`);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const contactId of CONTACTS_TO_CLEANUP) {
    try {
      const result = await cleanupContactStageTags(contactId);
      if (result.success) {
        successCount++;
        console.log(`✅ Successfully cleaned up contact: ${contactId}`);
      } else {
        errorCount++;
        console.log(`❌ Failed to clean up contact: ${contactId} - ${result.error}`);
      }
    } catch (error) {
      errorCount++;
      console.log(`❌ Error processing contact: ${contactId} - ${error.message}`);
    }

    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`
📊 Cleanup Process Complete:
- ✅ Successfully cleaned: ${successCount} contacts
- ❌ Failed: ${errorCount} contacts
- 📋 Total processed: ${CONTACTS_TO_CLEANUP.length} contacts
`);
};

// Export for use in other scripts or run directly
if (typeof module !== 'undefined') {
  module.exports = { cleanupContactStageTags, runCleanupProcess };
} else {
  // Run the process if executed directly
  runCleanupProcess().catch(console.error);
}
