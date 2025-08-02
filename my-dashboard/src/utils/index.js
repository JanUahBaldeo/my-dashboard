/**
 * Utilities Barrel Exports
 * Centralized exports for all utility functions
 */

// Logger utilities
export * from './logger';

// Helper utilities
export * from './helpers';

// Validation utilities
export * from './validation';

// Performance monitoring
export { default as performanceMonitor } from './performance';

// Database & API
export {
  fetchPipelineLeads,
  fetchStageTags,
  fetchAvailableTags,
  fetchPipelineMetrics,
  fetchLeadsByStage,
  createNewLead,
  addTagsToLead,
  moveLeadToStage,
  updateLeadDetails,
  deleteLead,
  refreshPipelineData,
  setupRealtimeUpdates,
  testApiConnection,
  testContactsExist,
  PIPELINE_STAGES,
  STAGE_TAGS,
} from '@api/pipelineApi';

// Task API
export {
  fetchTasks,
  fetchTasksByUser,
  fetchTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  bulkUpdateTasks,
  bulkDeleteTasks,
  testTaskApiConnection,
} from '@api/taskApi';

// Context
export { TaskProvider } from '@context/TaskContext';
export { PipelineProvider, usePipeline } from '@context/PipelineContext';
export { RoleProvider, useRole } from '@context/RoleContext';

// Mock data for demonstration
export * from './mockTasks';

// GHL Date Parser utilities
export * from './ghlDateParser';

// GHL Task Enhancer utilities
export * from './ghlTaskEnhancer';

// GHL Task Creation Test utilities
export * from './testGHLTaskCreation';
