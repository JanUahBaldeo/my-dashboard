import { createContext, useContext, useState, useEffect } from 'react';
import { pipelineLogger } from '@utils/logger';
import {
  fetchPipelineLeads,
  fetchPipelineMetrics,
  fetchStageTags,
  createNewLead,
  updateLeadDetails,
  deleteLead,
  moveLeadToStage,
  addTagsToLead,
  refreshPipelineData,
  testApiConnection,
  testContactsExist,
  testPagination,
  PIPELINE_STAGES,
  STAGE_TAGS,
} from '../api/pipelineApi';

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

  // Load initial data
  useEffect(() => {
    loadPipelineData();
  }, []);

  // Auto refresh removed - data will only update on manual refresh or user actions

  const loadPipelineData = async (retryCount = 0) => {
    setLoading(true);
    setError(null);

    try {
      // First test API connection
      pipelineLogger.debug('Testing API connection before loading data');
      const apiTest = await testApiConnection();

      if (!apiTest.success) {
        pipelineLogger.error('API connection failed', null, { error: apiTest.error });
        setError(`API Connection Failed: ${apiTest.error}`);
        setLoading(false);
        return;
      }

      pipelineLogger.success('API connection successful, testing for contacts');

      // Test if contacts exist
      const contactsTest = await testContactsExist();
      if (contactsTest.success) {
        pipelineLogger.info(`Found ${contactsTest.data.contactsCount} contacts in LeadConnector`);
        if (contactsTest.data.contactsCount === 0) {
          pipelineLogger.warn('No contacts found - pipeline will be empty');
        }
      }

      // Test pagination functionality
      const paginationTest = await testPagination();
      if (paginationTest.success) {
        pipelineLogger.info('Pagination test results:', paginationTest.data);
      }

      pipelineLogger.info('Loading pipeline data');

      // Set initial progress
      setLoadingProgress({ current: 0, total: 2, message: 'Fetching leads and metrics...' });

      const [leadsResponse, metricsResponse] = await Promise.all([
        fetchPipelineLeads(),
        fetchPipelineMetrics(),
      ]);

      // Update progress
      setLoadingProgress({ current: 2, total: 2, message: 'Processing data...' });

      if (leadsResponse.success && metricsResponse.success) {
        setLeadsByStage(leadsResponse.data.leads);
        setMetrics(metricsResponse.data);
        setLastUpdated(new Date().toISOString());
        setLoadingProgress({ current: 0, total: 0, message: '' });
        pipelineLogger.success('Pipeline data loaded successfully');
      } else {
        const errorMsg = leadsResponse.error || metricsResponse.error;
        pipelineLogger.error('Pipeline data loading failed', null, { error: errorMsg });
        throw new Error(errorMsg);
      }
    } catch (err) {
      // Retry logic with exponential backoff
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        pipelineLogger.warn(`Pipeline data loading failed, retrying in ${delay}ms`, null, {
          retryCount: retryCount + 1,
          maxRetries,
          error: err.message,
        });

        setTimeout(() => {
          loadPipelineData(retryCount + 1);
        }, delay);
        return;
      }

      setError(err.message);
      setLoadingProgress({ current: 0, total: 0, message: '' });
      pipelineLogger.error('Error loading pipeline data after retries', err);
    } finally {
      setLoading(false);
    }
  };


  const updateMetrics = async () => {
    try {
      const response = await fetchPipelineMetrics();
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error) {
      pipelineLogger.error('Error updating metrics', error);
    }
  };

  const addLead = async (stage, leadData) => {
    try {
      const response = await createNewLead({ ...leadData, stage });
      if (response.success) {
        // Immediately refresh data to show the new lead
        pipelineLogger.info('Refreshing pipeline data after adding lead');
        await loadPipelineData();
        pipelineLogger.success('Pipeline data refreshed after adding lead');
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
        // Immediately refresh data to show updated lead
        pipelineLogger.info('Refreshing pipeline data after updating lead');
        await loadPipelineData();
        pipelineLogger.success('Pipeline data refreshed after updating lead');
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
    try {
      const response = await moveLeadToStage(leadId, toStage, fromStage);
      if (response.success) {
        // Update local state
        setLeadsByStage(prevData => {
          const newData = { ...prevData };

          // Find and remove from source stage
          const sourceStage = newData[fromStage] || [];
          const leadIndex = sourceStage.findIndex(lead => lead.id === leadId);

          if (leadIndex >= 0) {
            const lead = sourceStage[leadIndex];

            // Remove from source stage
            newData[fromStage] = sourceStage.filter((_, index) => index !== leadIndex);

            // Add to target stage
            if (!newData[toStage]) {
              newData[toStage] = [];
            }

            newData[toStage].push({
              ...lead,
              stage: toStage,
              updatedAt: new Date().toISOString(),
            });
          }

          return newData;
        });
        return response.data;
      } else {
        throw new Error(response.error);
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
        // Immediately refresh data to show updated tags
        pipelineLogger.info('Refreshing pipeline data after updating tags');
        await loadPipelineData();
        pipelineLogger.success('Pipeline data refreshed after updating tags');
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

export { PipelineContext };
