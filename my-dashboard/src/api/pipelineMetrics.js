// 📊 Pipeline Metrics API
// Handles pipeline metrics and analytics

import { toast } from 'react-hot-toast';
import { apiLogger } from '@utils/logger';
import { API_CONFIG, PIPELINE_CONFIG, FEATURE_FLAGS } from '@config/environment';
import { calculatePipelineMetrics, calculateDetailedMetrics } from './pipelineUtils';

const LEAD_CONNECTOR_CONFIG = API_CONFIG.LEAD_CONNECTOR;
const PIPELINE_STAGES = PIPELINE_CONFIG.STAGES;

/**
 * 📈 Fetch pipeline metrics
 * Returns comprehensive metrics for the entire pipeline
 */
export const fetchPipelineMetrics = async () => {
  try {
    apiLogger.info('Fetching pipeline metrics');

    // Fetch all contacts first
    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      apiLogger.error('Failed to fetch pipeline metrics', null, {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const contacts = data.contacts || data.data || data.results || [];

    // Calculate metrics
    const metrics = calculatePipelineMetrics(contacts);

    apiLogger.success('Pipeline metrics fetched successfully', {
      totalLeads: metrics.totalLeads,
      totalValue: metrics.totalValue,
      overallHealth: metrics.overallHealth,
    });

    return {
      success: true,
      data: metrics,
    };

  } catch (error) {
    apiLogger.error('Error fetching pipeline metrics', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 📊 Fetch detailed metrics for specific stage
 */
export const fetchStageMetrics = async (stageName) => {
  try {
    apiLogger.info(`Fetching detailed metrics for stage: ${stageName}`);

    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      apiLogger.error(`Failed to fetch metrics for stage ${stageName}`, null, {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const contacts = data.contacts || data.data || data.results || [];

    // Filter contacts for specific stage
    const stageContacts = contacts.filter(contact => {
      const tags = contact.tags || contact.tagIds || [];
      const stageTags = PIPELINE_CONFIG.STAGE_TAGS[stageName] || [];
      
      return tags.some(tag => {
        if (typeof tag === 'string') {
          return stageTags.includes(tag);
        } else if (tag && typeof tag === 'object') {
          return stageTags.includes(tag.id) || stageTags.includes(tag.name);
        }
        return false;
      });
    });

    // Calculate detailed metrics
    const detailedMetrics = calculateDetailedMetrics({ [stageName]: stageContacts });

    apiLogger.success(`Stage metrics fetched successfully for ${stageName}`, {
      stageLeads: stageContacts.length,
      metrics: detailedMetrics[stageName],
    });

    return {
      success: true,
      data: detailedMetrics[stageName],
    };

  } catch (error) {
    apiLogger.error(`Error fetching metrics for stage ${stageName}`, error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 📈 Fetch conversion funnel data
 */
export const fetchConversionFunnel = async () => {
  try {
    apiLogger.info('Fetching conversion funnel data');

    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      apiLogger.error('Failed to fetch conversion funnel', null, {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const contacts = data.contacts || data.data || data.results || [];

    // Calculate conversion funnel
    const funnel = PIPELINE_STAGES.map((stage, index) => {
      const stageContacts = contacts.filter(contact => {
        const tags = contact.tags || contact.tagIds || [];
        const stageTags = PIPELINE_CONFIG.STAGE_TAGS[stage.title] || [];
        
        return tags.some(tag => {
          if (typeof tag === 'string') {
            return stageTags.includes(tag);
          } else if (tag && typeof tag === 'object') {
            return stageTags.includes(tag.id) || stageTags.includes(tag.name);
          }
          return false;
        });
      });

      return {
        stage: stage.title,
        count: stageContacts.length,
        conversionRate: index > 0 ? 
          (stageContacts.length / contacts.length) * 100 : 100,
        value: stageContacts.reduce((sum, contact) => sum + (contact.leadScore || 0), 0),
      };
    });

    apiLogger.success('Conversion funnel fetched successfully', {
      totalStages: funnel.length,
      totalLeads: contacts.length,
    });

    return {
      success: true,
      data: funnel,
    };

  } catch (error) {
    apiLogger.error('Error fetching conversion funnel', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 📊 Fetch performance analytics
 */
export const fetchPerformanceAnalytics = async (timeRange = '30d') => {
  try {
    apiLogger.info(`Fetching performance analytics for time range: ${timeRange}`);

    const response = await fetch(
      `${LEAD_CONNECTOR_CONFIG.baseUrl}/contacts/?locationId=${LEAD_CONNECTOR_CONFIG.locationId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEAD_CONNECTOR_CONFIG.token}`,
          'Version': LEAD_CONNECTOR_CONFIG.version,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      apiLogger.error('Failed to fetch performance analytics', null, {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const contacts = data.contacts || data.data || data.results || [];

    // Calculate time-based analytics
    const now = new Date();
    const timeRangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    }[timeRange] || 30 * 24 * 60 * 60 * 1000;

    const cutoffDate = new Date(now.getTime() - timeRangeMs);

    // Filter contacts within time range
    const recentContacts = contacts.filter(contact => {
      const createdAt = new Date(contact.createdAt || contact.dateAdded);
      return createdAt >= cutoffDate;
    });

    // Calculate analytics
    const analytics = {
      timeRange,
      totalLeads: recentContacts.length,
      newLeads: recentContacts.filter(c => c.status === 'new').length,
      convertedLeads: recentContacts.filter(c => c.status === 'converted').length,
      averageLeadScore: recentContacts.reduce((sum, c) => sum + (c.leadScore || 0), 0) / recentContacts.length || 0,
      topSources: {},
      stageDistribution: {},
      conversionRate: recentContacts.length > 0 ? 
        (recentContacts.filter(c => c.status === 'converted').length / recentContacts.length) * 100 : 0,
    };

    // Calculate top sources
    recentContacts.forEach(contact => {
      const source = contact.source || contact.leadSource || 'unknown';
      analytics.topSources[source] = (analytics.topSources[source] || 0) + 1;
    });

    // Calculate stage distribution
    PIPELINE_STAGES.forEach(stage => {
      const stageContacts = recentContacts.filter(contact => {
        const tags = contact.tags || contact.tagIds || [];
        const stageTags = PIPELINE_CONFIG.STAGE_TAGS[stage.title] || [];
        
        return tags.some(tag => {
          if (typeof tag === 'string') {
            return stageTags.includes(tag);
          } else if (tag && typeof tag === 'object') {
            return stageTags.includes(tag.id) || stageTags.includes(tag.name);
          }
          return false;
        });
      });

      analytics.stageDistribution[stage.title] = stageContacts.length;
    });

    // Sort top sources
    analytics.topSources = Object.entries(analytics.topSources)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    apiLogger.success('Performance analytics fetched successfully', {
      timeRange,
      totalLeads: analytics.totalLeads,
      conversionRate: analytics.conversionRate,
    });

    return {
      success: true,
      data: analytics,
    };

  } catch (error) {
    apiLogger.error('Error fetching performance analytics', error);
    return {
      success: false,
      error: error.message,
    };
  }
}; 