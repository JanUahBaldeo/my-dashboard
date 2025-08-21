import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pipelineLogger } from '@utils/logger';
import { FEATURE_FLAGS } from '@config/environment';
import {
  fetchPipelineLeads,
  fetchPipelineMetrics,
  fetchStageTags,
  createNewLead,
  updateLeadDetails,
  deleteLead,
  moveLeadToStage,
  addTagsToLead,
  PIPELINE_STAGES,
  STAGE_TAGS,
} from '@api/pipelineApi';

const PipelineContext = createContext();


export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};


export const PipelineProvider = ({ children }) => {
  const [leadsByStage, setLeadsByStage] = useState({});
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0, message: '' });

  // Enhanced cache to prevent repeated API calls
  const [dataCache, setDataCache] = useState(null);
  const CACHE_DURATION = 120000; // 2 minutes cache for better performance

  const loadPipelineData = useCallback(async (_retryCount = 0, _forceRefresh = false) => {
    // Check cache first
    if (dataCache && Date.now() - dataCache.timestamp < CACHE_DURATION && !_forceRefresh) {
      setLeadsByStage(dataCache.leads);
      setMetrics(dataCache.metrics);
      setLastUpdated(dataCache.lastUpdated);
      setLoading(false);
      pipelineLogger.info('Using cached pipeline data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Skip API tests for faster loading - only do basic pipeline fetch
      pipelineLogger.info('Loading fresh pipeline data');

      // Set initial progress
      setLoadingProgress({ current: 0, total: 2, message: 'Fetching leads and metrics...' });

      const [leadsResponse, metricsResponse] = await Promise.all([
        fetchPipelineLeads(),
        fetchPipelineMetrics(),
      ]);

      // Update progress
      setLoadingProgress({ current: 2, total: 2, message: 'Processing data...' });

      if (leadsResponse.success && metricsResponse.success) {
        const newData = {
          leads: leadsResponse.data.leads,
          metrics: metricsResponse.data,
          lastUpdated: new Date().toISOString(),
          timestamp: Date.now(),
        };

        // Update cache
        setDataCache(newData);

        setLeadsByStage(newData.leads);
        setMetrics(newData.metrics);
        setLastUpdated(newData.lastUpdated);
        setLoadingProgress({ current: 0, total: 0, message: '' });
        pipelineLogger.success('Pipeline data loaded successfully');
      } else {
        const errorMsg = leadsResponse.error || metricsResponse.error;
        pipelineLogger.error('Pipeline data loading failed', null, { error: errorMsg });
        throw new Error(errorMsg);
      }
    } catch (err) {
      // Auto-retry disabled for better performance
      // Users can manually refresh instead
      pipelineLogger.warn('Pipeline data loading failed. Auto-retry disabled for performance.', null, {
        error: err.message,
      });

      setError(err.message);
      setLoadingProgress({ current: 0, total: 0, message: 'Load failed. Use Refresh Data button.' });
      pipelineLogger.error('Error loading pipeline data after retry', err);
    } finally {
      setLoading(false);
    }
  }, [dataCache]);

  // Load initial data
  useEffect(() => {
    loadPipelineData();
  }, [loadPipelineData]);

  // Removed unused updateMetrics function for better performance

  const refreshPipelineData = async () => {
    await loadPipelineData();
  };

  const addLead = async (stage, leadData) => {
    try {
      const response = await createNewLead({ ...leadData, stage });
      if (response.success) {
        // Optimistic update - add to local state immediately
        const newLead = response.data;
        setLeadsByStage(prevData => {
          const newData = { ...prevData };
          if (!newData[stage]) {
            newData[stage] = [];
          }
          newData[stage].push(newLead);
          return newData;
        });

        pipelineLogger.success('Lead added successfully');
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      pipelineLogger.error('Error adding lead', error);
      throw error;
    }
  };

  const updateLead = async (leadId, updates) => {
    try {
      const response = await updateLeadDetails(leadId, updates);
      if (response.success) {
        // Optimistic update - update in local state immediately
        setLeadsByStage(prevData => {
          const newData = { ...prevData };
          Object.keys(newData).forEach(stage => {
            const leads = newData[stage] || [];
            const leadIndex = leads.findIndex(l => l.id === leadId || l._id === leadId);
            if (leadIndex >= 0) {
              newData[stage] = [...leads];
              newData[stage][leadIndex] = {
                ...leads[leadIndex],
                ...updates,
                updatedAt: new Date().toISOString(),
              };
            }
          });
          return newData;
        });

        pipelineLogger.success('Lead updated successfully');
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      pipelineLogger.error('Error updating lead', error);
      throw error;
    }
  };

  const removeLead = async (leadId) => {
    try {
      const response = await deleteLead(leadId);
      if (response.success) {
        // Remove from local state
        setLeadsByStage(prevData => {
          const newData = { ...prevData };
          Object.keys(newData).forEach(stageTitle => {
            newData[stageTitle] = newData[stageTitle].filter(lead => lead.id !== leadId);
          });
          return newData;
        });
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      pipelineLogger.error('Error deleting lead', error);
      throw error;
    }
  };

  const moveLead = async (leadId, fromStage, toStage) => {
    if (!leadId || !fromStage || !toStage || fromStage === toStage) {
      return;
    }

    try {
      // Clean the lead ID to remove any stage suffix
      const cleanLeadId = leadId.includes('-') ? leadId.split('-')[0] : leadId;

      // Find the lead in the current stage to validate it exists
      const sourceStageLeads = leadsByStage[fromStage] || [];
      const lead = sourceStageLeads.find(l =>
        l.id === leadId ||
        l.id === cleanLeadId ||
        l._id === leadId ||
        l._id === cleanLeadId,
      );

      if (!lead) {
        const error = `Lead ${leadId} not found in stage ${fromStage}`;
        pipelineLogger.error(error);
        throw new Error(error);
      }

      // Optimistic local state update
      setLeadsByStage(prevData => {
        const newData = { ...prevData };

        // Remove from source stage
        const sourceStage = newData[fromStage] || [];
        const leadIndex = sourceStage.findIndex(l =>
          l.id === leadId ||
          l.id === cleanLeadId ||
          l._id === leadId ||
          l._id === cleanLeadId,
        );

        if (leadIndex >= 0) {
          const leadToMove = sourceStage[leadIndex];

          // Remove from source stage
          newData[fromStage] = sourceStage.filter((_, index) => index !== leadIndex);

          // Add to target stage with updated properties
          if (!newData[toStage]) {
            newData[toStage] = [];
          }

          newData[toStage].push({
            ...leadToMove,
            id: cleanLeadId,
            _id: cleanLeadId,
            stage: toStage,
            updatedAt: new Date().toISOString(),
          });
        }

        return newData;
      });

      // Call API to move lead
      const response = await moveLeadToStage(cleanLeadId, toStage, fromStage);

      if (response.success) {
        // No background refresh to improve performance - optimistic update is enough
        return response.data;
      } else {
        // Revert optimistic update on failure
        await loadPipelineData(true);
        throw new Error(response.error || 'Failed to move lead');
      }
    } catch (error) {
      pipelineLogger.error('Error moving lead', error);
      throw error;
    }
  };

  const updateLeadTags = async (leadId, tags) => {
    try {
      const response = await addTagsToLead(leadId, tags);
      if (response.success) {
        // Optimistic update - update local state instead of full reload
        setLeadsByStage(prevData => {
          const newData = { ...prevData };

          // Find and update the lead in any stage
          Object.keys(newData).forEach(stage => {
            const leads = newData[stage] || [];
            const leadIndex = leads.findIndex(l =>
              l.id === leadId || l._id === leadId ||
              l.id === leadId.split('-')[0] || l._id === leadId.split('-')[0],
            );

            if (leadIndex >= 0) {
              newData[stage] = [...leads];
              newData[stage][leadIndex] = {
                ...leads[leadIndex],
                tags: tags,
                updatedAt: new Date().toISOString(),
              };
            }
          });

          return newData;
        });

        pipelineLogger.success('Lead tags updated locally');
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      pipelineLogger.error('Error updating lead tags', error);
      throw error;
    }
  };

  const getStageTags = async (stageName) => {
    try {
      const response = await fetchStageTags(stageName);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
  } catch (error) {
      pipelineLogger.error('Error fetching stage tags', error);
      return STAGE_TAGS[stageName] || [];
    }
  };

  const refreshData = () => {
    loadPipelineData();
  };

  const manualRefresh = async () => {
    try {
      pipelineLogger.info('Manual refresh requested');

      // Refresh pipeline data directly from LeadConnector
      const response = await refreshPipelineData();

      if (response.success) {
        setLeadsByStage(response.data.leads);
        setMetrics(response.data.metrics);
        setLastUpdated(new Date().toISOString());
        pipelineLogger.success('Manual refresh completed successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      pipelineLogger.error('Manual refresh failed', error);
      setError(error.message);
    }
  };

  const value = {
    // State
    leadsByStage,
    metrics,
    loading,
    error,
    lastUpdated,
    loadingProgress,

    // Actions
    addLead,
    updateLead,
    removeLead,
    moveLead,
    updateLeadTags,
    getStageTags,
    refreshData,
    manualRefresh,

    // Constants
    stages: PIPELINE_STAGES,
    stageTags: STAGE_TAGS,
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
};


export default PipelineContext;
