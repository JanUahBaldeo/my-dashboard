// OPTIMIZED categorizeLeadsByStage function - MUCH FASTER
const categorizeLeadsByStage = (leads) => {
  const categorized = {};

  // Initialize all stages
  PIPELINE_STAGES.forEach(stage => {
    categorized[stage.title] = [];
  });

  // Pre-computed mapping for performance
  const tagStageMap = {
    'new lead': 'New Lead',
    'contacted': 'Contacted',
    'application started': 'Application Started',
    'pre-approved': 'Pre-Approved',
    'pre approved': 'Pre-Approved',
    'in underwriting': 'In Underwriting',
    'closed': 'Closed',
  };

  // Super fast single-pass categorization
  leads.forEach((lead, index) => {
    let assignedStage = 'New Lead'; // Default

    try {
      // Fast priority-based stage detection
      if (lead.customField?.stage && categorized[lead.customField.stage]) {
        assignedStage = lead.customField.stage;
      } else if (lead.stage && categorized[lead.stage]) {
        assignedStage = lead.stage;
      } else {
        // Quick tag check - only first match
        const tags = lead.customField?.tags || lead.tags || [];
        for (const tag of tags) {
          const mappedStage = tagStageMap[tag.toLowerCase()];
          if (mappedStage) {
            assignedStage = mappedStage;
            break;
          }
        }
      }

      // Add optimized lead object
      categorized[assignedStage].push({
        id: lead.id || lead._id || `lead-${index}`,
        name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.name || 'Unknown',
        email: lead.email || '',
        phone: lead.phone || '',
        stage: assignedStage,
        tags: lead.tags || [],
        createdAt: lead.createdAt || new Date().toISOString(),
        updatedAt: lead.updatedAt || new Date().toISOString(),
        // Only essential fields for performance
      });

    } catch (error) {
      // Error fallback - put in New Lead
      categorized['New Lead'].push({
        id: lead.id || `error-${index}`,
        name: 'Error Lead',
        email: lead.email || '',
        phone: lead.phone || '',
        stage: 'New Lead',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return categorized;
};
