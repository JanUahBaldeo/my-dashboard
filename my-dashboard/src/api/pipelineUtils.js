// 🛠️ Pipeline Utilities
// Helper functions for pipeline data processing and calculations

import { apiLogger } from '@utils/logger';
import { PIPELINE_CONFIG } from '@config/environment';

const PIPELINE_STAGES = PIPELINE_CONFIG.STAGES;
const STAGE_TAGS = PIPELINE_CONFIG.STAGE_TAGS;

// 🧹 Function to clean old tags and keep only main stage tags
export const cleanTags = (tags) => {
  if (!Array.isArray(tags)) return [];

  const validTags = Object.values(STAGE_TAGS).flat();
  return tags.filter(tag => validTags.includes(tag));
};

// 📊 Categorize leads by pipeline stage
export const categorizeLeadsByStage = (leads) => {
  const categorizedLeads = {};
  
  // Initialize all stages with empty arrays
  PIPELINE_STAGES.forEach(stage => {
    categorizedLeads[stage.title] = [];
  });

  if (!Array.isArray(leads)) {
    apiLogger.warn('No leads array provided for categorization');
    return categorizedLeads;
  }

  leads.forEach(lead => {
    try {
      // Extract tags from the lead
      const leadTags = lead.tags || lead.tagIds || [];
      
      // Find which stage this lead belongs to based on tags
      let assignedStage = null;
      
      for (const stage of PIPELINE_STAGES) {
        const stageTagIds = STAGE_TAGS[stage.title] || [];
        
        // Check if lead has any of the stage tags
        const hasStageTag = leadTags.some(tag => {
          if (typeof tag === 'string') {
            return stageTagIds.includes(tag);
          } else if (tag && typeof tag === 'object') {
            return stageTagIds.includes(tag.id) || stageTagIds.includes(tag.name);
          }
          return false;
        });
        
        if (hasStageTag) {
          assignedStage = stage.title;
          break;
        }
      }
      
      // If no stage found, assign to first stage (New Leads)
      if (!assignedStage) {
        assignedStage = PIPELINE_STAGES[0]?.title || 'New Leads';
      }
      
      // Transform lead data for consistency
      const transformedLead = {
        id: lead.id || lead.contactId,
        firstName: lead.firstName || lead.first_name || '',
        lastName: lead.lastName || lead.last_name || '',
        email: lead.email || '',
        phone: lead.phone || lead.phoneNumber || '',
        company: lead.company || lead.companyName || '',
        status: lead.status || 'active',
        tags: cleanTags(leadTags),
        stage: assignedStage,
        createdAt: lead.createdAt || lead.dateAdded || new Date().toISOString(),
        updatedAt: lead.updatedAt || lead.dateUpdated || new Date().toISOString(),
        source: lead.source || lead.leadSource || 'unknown',
        notes: lead.notes || lead.description || '',
        // Additional fields that might be present
        address: lead.address || '',
        city: lead.city || '',
        state: lead.state || '',
        zipCode: lead.zipCode || lead.postalCode || '',
        country: lead.country || 'US',
        // Custom fields
        customFields: lead.customFields || lead.custom_values || {},
        // Pipeline specific fields
        pipelineStage: assignedStage,
        lastActivity: lead.lastActivity || lead.lastActivityDate || new Date().toISOString(),
        leadScore: lead.leadScore || lead.score || 0,
        // Contact preferences
        preferredContact: lead.preferredContact || lead.preferredContactMethod || 'email',
        // Tags as array of objects for better handling
        tagObjects: Array.isArray(leadTags) ? leadTags.map(tag => {
          if (typeof tag === 'string') {
            return { id: tag, name: tag };
          }
          return tag;
        }) : [],
      };
      
      // Add to the appropriate stage
      if (categorizedLeads[assignedStage]) {
        categorizedLeads[assignedStage].push(transformedLead);
      } else {
        // If stage doesn't exist, create it
        categorizedLeads[assignedStage] = [transformedLead];
      }
      
    } catch (error) {
      apiLogger.error('Error processing lead', error, { leadId: lead.id || lead.contactId });
    }
  });

  // Sort leads within each stage by creation date (newest first)
  Object.keys(categorizedLeads).forEach(stage => {
    categorizedLeads[stage].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  });

  apiLogger.success('Leads categorized successfully', {
    totalLeads: leads.length,
    stages: Object.keys(categorizedLeads),
    leadsPerStage: Object.fromEntries(
      Object.entries(categorizedLeads).map(([stage, stageLeads]) => [stage, stageLeads.length])
    ),
  });

  return categorizedLeads;
};

// 📈 Calculate pipeline metrics
export const calculatePipelineMetrics = (categorizedLeads) => {
  const metrics = {
    totalLeads: 0,
    totalValue: 0,
    averageTimeInPipeline: 0,
    conversionRates: {},
    stageMetrics: {},
    overallHealth: 'good',
  };

  let totalLeads = 0;
  let totalValue = 0;
  let totalTimeInPipeline = 0;

  // Calculate metrics for each stage
  Object.entries(categorizedLeads).forEach(([stageName, leads]) => {
    const stageMetrics = {
      count: leads.length,
      value: 0,
      averageTime: 0,
      conversionRate: 0,
      health: 'good',
    };

    // Calculate stage-specific metrics
    leads.forEach(lead => {
      totalLeads++;
      stageMetrics.value += lead.leadScore || 0;
      totalValue += lead.leadScore || 0;

      // Calculate time in pipeline
      const createdAt = new Date(lead.createdAt);
      const now = new Date();
      const timeInPipeline = now - createdAt;
      stageMetrics.averageTime += timeInPipeline;
      totalTimeInPipeline += timeInPipeline;
    });

    // Calculate averages
    if (leads.length > 0) {
      stageMetrics.averageTime = stageMetrics.averageTime / leads.length;
    }

    // Determine stage health
    if (leads.length === 0) {
      stageMetrics.health = 'empty';
    } else if (leads.length > 50) {
      stageMetrics.health = 'warning';
    } else {
      stageMetrics.health = 'good';
    }

    metrics.stageMetrics[stageName] = stageMetrics;
  });

  // Calculate overall metrics
  metrics.totalLeads = totalLeads;
  metrics.totalValue = totalValue;
  metrics.averageTimeInPipeline = totalLeads > 0 ? totalTimeInPipeline / totalLeads : 0;

  // Calculate conversion rates between stages
  const stages = Object.keys(categorizedLeads);
  for (let i = 0; i < stages.length - 1; i++) {
    const currentStage = stages[i];
    const nextStage = stages[i + 1];
    const currentCount = categorizedLeads[currentStage].length;
    const nextCount = categorizedLeads[nextStage].length;
    
    if (currentCount > 0) {
      metrics.conversionRates[`${currentStage}->${nextStage}`] = (nextCount / currentCount) * 100;
    }
  }

  // Determine overall pipeline health
  const emptyStages = Object.values(metrics.stageMetrics).filter(m => m.health === 'empty').length;
  const warningStages = Object.values(metrics.stageMetrics).filter(m => m.health === 'warning').length;
  
  if (emptyStages > stages.length / 2) {
    metrics.overallHealth = 'poor';
  } else if (warningStages > 0) {
    metrics.overallHealth = 'warning';
  } else {
    metrics.overallHealth = 'good';
  }

  return metrics;
};

// 📊 Calculate detailed metrics for specific stage
export const calculateDetailedMetrics = (categorizedLeads) => {
  const detailedMetrics = {};

  Object.entries(categorizedLeads).forEach(([stageName, leads]) => {
    const stageMetrics = {
      totalLeads: leads.length,
      newLeads: 0,
      activeLeads: 0,
      inactiveLeads: 0,
      averageLeadScore: 0,
      topSources: {},
      averageTimeInStage: 0,
      recentActivity: 0,
    };

    let totalScore = 0;
    let totalTime = 0;
    const now = new Date();

    leads.forEach(lead => {
      // Count by status
      if (lead.status === 'new' || lead.status === 'active') {
        stageMetrics.newLeads++;
      } else if (lead.status === 'inactive') {
        stageMetrics.inactiveLeads++;
      } else {
        stageMetrics.activeLeads++;
      }

      // Calculate lead score
      totalScore += lead.leadScore || 0;

      // Calculate time in stage
      const createdAt = new Date(lead.createdAt);
      const timeInStage = now - createdAt;
      totalTime += timeInStage;

      // Track sources
      const source = lead.source || 'unknown';
      stageMetrics.topSources[source] = (stageMetrics.topSources[source] || 0) + 1;

      // Check recent activity (last 7 days)
      const lastActivity = new Date(lead.lastActivity);
      const daysSinceActivity = (now - lastActivity) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity <= 7) {
        stageMetrics.recentActivity++;
      }
    });

    // Calculate averages
    if (leads.length > 0) {
      stageMetrics.averageLeadScore = totalScore / leads.length;
      stageMetrics.averageTimeInStage = totalTime / leads.length;
    }

    // Sort top sources
    stageMetrics.topSources = Object.entries(stageMetrics.topSources)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    detailedMetrics[stageName] = stageMetrics;
  });

  return detailedMetrics;
};

// ⏱️ Calculate average time in pipeline
export const calculateAverageTime = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return 0;
  }

  const now = new Date();
  const totalTime = leads.reduce((sum, lead) => {
    const createdAt = new Date(lead.createdAt);
    return sum + (now - createdAt);
  }, 0);

  return totalTime / leads.length;
};

// 📈 Calculate conversion rate for a stage
export const calculateConversionRate = (stage) => {
  if (!stage || !stage.leads || stage.leads.length === 0) {
    return 0;
  }

  const convertedLeads = stage.leads.filter(lead => 
    lead.status === 'converted' || lead.stage !== stage.title
  );

  return (convertedLeads.length / stage.leads.length) * 100;
}; 