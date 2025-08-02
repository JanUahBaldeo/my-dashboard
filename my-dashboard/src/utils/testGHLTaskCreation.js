// ========================================
// 🧪 GHL TASK CREATION TEST
// ========================================

import { createTask } from '@api/taskApi';
import { createLogger } from './logger';
import { GHL_CONFIG, getGHLHeaders, GHL_TOKEN_INSTRUCTIONS } from '@config/ghlConfig';

const taskLogger = createLogger('TaskCreation');

/**
 * 🧪 Test GHL task creation with minimal data
 */
export const testGHLTaskCreation = async () => {
  try {
    taskLogger.info('🧪 Testing GHL task creation...');

    // Minimal task data that GHL should accept
    const minimalTaskData = {
      title: 'Test Task from Dashboard',
      body: 'This is a test task created from the dashboard',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      priority: 'medium',
      status: 'pending',
    };

    taskLogger.info('Sending minimal task data:', minimalTaskData);

    const result = await createTask(minimalTaskData);

    if (result.success) {
      taskLogger.success('✅ GHL task creation test passed!', {
        taskId: result.data._id || result.data.id,
        taskData: result.data,
      });

      return {
        success: true,
        message: 'GHL task creation working correctly',
        taskId: result.data._id || result.data.id,
        data: result.data,
      };
    } else {
      taskLogger.error('❌ GHL task creation test failed:', result.error);

      return {
        success: false,
        message: `GHL task creation failed: ${result.error}`,
        error: result.error,
      };
    }

  } catch (error) {
    taskLogger.error('❌ GHL task creation test error:', error);

    return {
      success: false,
      message: `GHL task creation test error: ${error.message}`,
      error: error.message,
    };
  }
};

/**
 * 🧪 Test GHL task creation with full data
 */
export const testGHLTaskCreationFull = async () => {
  try {
    taskLogger.info('🧪 Testing GHL task creation with full data...');

    // Full task data with all fields
    const fullTaskData = {
      title: 'Full Test Task from Dashboard',
      body: 'This is a comprehensive test task with all fields',
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
      priority: 'high',
      status: 'pending',
      tags: ['test', 'dashboard', 'ghl'],
      category: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    taskLogger.info('Sending full task data:', fullTaskData);

    const result = await createTask(fullTaskData);

    if (result.success) {
      taskLogger.success('✅ GHL full task creation test passed!', {
        taskId: result.data._id || result.data.id,
        taskData: result.data,
      });

      return {
        success: true,
        message: 'GHL full task creation working correctly',
        taskId: result.data._id || result.data.id,
        data: result.data,
      };
    } else {
      taskLogger.error('❌ GHL full task creation test failed:', result.error);

      return {
        success: false,
        message: `GHL full task creation failed: ${result.error}`,
        error: result.error,
      };
    }

  } catch (error) {
    taskLogger.error('❌ GHL full task creation test error:', error);

    return {
      success: false,
      message: `GHL full task creation test error: ${error.message}`,
      error: error.message,
    };
  }
};

/**
 * 🧪 Test GHL API connection
 */
export const testGHLConnection = async () => {
  try {
    taskLogger.info('🧪 Testing GHL API connection...');

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/search`,
      {
        method: 'POST',
        headers: getGHLHeaders(),
        body: JSON.stringify({ completed: false, limit: 1 }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      taskLogger.error('GHL API connection failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
      });

      return {
        success: false,
        message: `GHL API connection failed: ${response.status} - ${errorText}`,
        status: response.status,
        error: errorText,
      };
    }

    const data = await response.json();

    taskLogger.success('✅ GHL API connection test successful', {
      status: response.status,
      taskCount: data.tasks ? data.tasks.length : 0,
    });

    return {
      success: true,
      message: 'GHL API connection working',
      status: response.status,
      data: data,
    };

  } catch (error) {
    taskLogger.error('❌ GHL API connection test error:', error);

    return {
      success: false,
      message: `GHL API connection test error: ${error.message}`,
      error: error.message,
    };
  }
};
