// ========================================
// 🎯 TASK API SERVICE
// ========================================

import { toast } from 'react-hot-toast';
import { createLogger } from '@utils/logger';
import { GHL_CONFIG, getGHLHeaders, validateGHLConfig } from '@config/ghlConfig';

const taskLogger = createLogger('TaskAPI');

// Validate configuration on import
const configValidation = validateGHLConfig();
if (!configValidation.isValid) {
  taskLogger.warn('GHL Configuration Issues:', configValidation.issues);
}

// ============================================================================
// 📥 GET REQUESTS
// ============================================================================

/**
 * 🎯 GET - Fetch all tasks
 * Returns all tasks from the API
 */
export const fetchTasks = async (filters = {}) => {
  try {
    taskLogger.info('Fetching tasks from API', { filters });

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/search`,
      {
        method: 'POST',
        headers: getGHLHeaders(),
        body: JSON.stringify({
          completed: false,
          ...filters,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const tasks = data.tasks || data;

    taskLogger.success('Tasks fetched successfully', { count: tasks.length });

    return {
      success: true,
      data: tasks,
    };

  } catch (error) {
    taskLogger.error('Error fetching tasks', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * 🎯 GET - Fetch tasks by user
 * Returns tasks assigned to a specific user
 */
export const fetchTasksByUser = async (userId) => {
  try {
    taskLogger.info('Fetching tasks for user', { userId });

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/search`,
      {
        method: 'POST',
        headers: getGHLHeaders(),
        body: JSON.stringify({
          completed: false,
          assignedTo: userId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const tasks = data.tasks || data;

    taskLogger.success('User tasks fetched successfully', { userId, count: tasks.length });

    return {
      success: true,
      data: tasks,
    };

  } catch (error) {
    taskLogger.error('Error fetching user tasks', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * 🎯 GET - Fetch task by ID
 * Returns a specific task by its ID
 */
export const fetchTaskById = async (taskId) => {
  try {
    taskLogger.info('Fetching task by ID', { taskId });

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/${taskId}`,
      {
        method: 'GET',
        headers: getGHLHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const task = await response.json();

    taskLogger.success('Task fetched successfully', { taskId });

    return {
      success: true,
      data: task,
    };

  } catch (error) {
    taskLogger.error('Error fetching task by ID', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

// ============================================================================
// 📤 POST REQUESTS
// ============================================================================

/**
 * ➕ POST - Create new task
 * Creates a new task in the system
 */
export const createTask = async (taskData) => {
  try {
    taskLogger.info('Creating new task', { taskData });

    // Add required fields for GHL API
    const ghlTaskData = {
      ...taskData,
      isLocation: true, // Required by GHL API
      locationId: GHL_CONFIG.locationId, // Required by GHL API
    };

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks`,
      {
        method: 'POST',
        headers: getGHLHeaders(),
        body: JSON.stringify(ghlTaskData),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      taskLogger.error('GHL API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        requestData: taskData,
      });
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const newTask = await response.json();

    taskLogger.success('Task created successfully', { taskId: newTask._id || newTask.id });
    toast.success('✅ Task created successfully!');

    return {
      success: true,
      data: newTask,
    };

  } catch (error) {
    taskLogger.error('Error creating task', error);
    toast.error(`❌ Failed to create task: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================================
// 📝 PUT REQUESTS
// ============================================================================

/**
 * 📝 PUT - Update task
 * Updates an existing task
 */
export const updateTask = async (taskId, updates) => {
  try {
    taskLogger.info('Updating task', { taskId, updates });

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/${taskId}`,
      {
        method: 'PUT',
        headers: getGHLHeaders(),
        body: JSON.stringify(updates),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const updatedTask = await response.json();

    taskLogger.success('Task updated successfully', { taskId });
    toast.success('✅ Task updated successfully!');

    return {
      success: true,
      data: updatedTask,
    };

  } catch (error) {
    taskLogger.error('Error updating task', error);
    toast.error(`❌ Failed to update task: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * ✅ PUT - Mark task as completed
 * Marks a task as completed
 */
export const completeTask = async (taskId) => {
  try {
    taskLogger.info('Marking task as completed', { taskId });

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/${taskId}`,
      {
        method: 'PUT',
        headers: getGHLHeaders(),
        body: JSON.stringify({ completed: true }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const completedTask = await response.json();

    taskLogger.success('Task marked as completed', { taskId });
    toast.success('✅ Task completed!');

    return {
      success: true,
      data: completedTask,
    };

  } catch (error) {
    taskLogger.error('Error completing task', error);
    toast.error(`❌ Failed to complete task: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================================
// 🗑️ DELETE REQUESTS
// ============================================================================

/**
 * 🗑️ DELETE - Delete task
 * Removes a task from the system
 */
export const deleteTask = async (taskId) => {
  try {
    taskLogger.info('Deleting task', { taskId });

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: getGHLHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    taskLogger.success('Task deleted successfully', { taskId });
    toast.success('✅ Task deleted successfully!');

    return {
      success: true,
      data: { taskId },
    };

  } catch (error) {
    taskLogger.error('Error deleting task', error);
    toast.error(`❌ Failed to delete task: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================================
// 🔄 BULK OPERATIONS
// ============================================================================

/**
 * 🔄 POST - Bulk update tasks
 * Updates multiple tasks at once
 */
export const bulkUpdateTasks = async (taskUpdates) => {
  try {
    taskLogger.info('Bulk updating tasks', { count: taskUpdates.length });

    const promises = taskUpdates.map(({ taskId, updates }) =>
      updateTask(taskId, updates),
    );

    const results = await Promise.allSettled(promises);

    const successful = results.filter(result => result.status === 'fulfilled' && result.value.success);
    const failed = results.filter(result => result.status === 'rejected' || !result.value.success);

    taskLogger.success('Bulk update completed', {
      successful: successful.length,
      failed: failed.length,
    });

    if (successful.length > 0) {
      toast.success(`✅ ${successful.length} tasks updated successfully!`);
    }

    if (failed.length > 0) {
      toast.error(`❌ ${failed.length} tasks failed to update`);
    }

    return {
      success: true,
      data: {
        successful: successful.length,
        failed: failed.length,
        results,
      },
    };

  } catch (error) {
    taskLogger.error('Error in bulk update', error);
    toast.error(`❌ Bulk update failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 🔄 POST - Bulk delete tasks
 * Deletes multiple tasks at once
 */
export const bulkDeleteTasks = async (taskIds) => {
  try {
    taskLogger.info('Bulk deleting tasks', { count: taskIds.length });

    const promises = taskIds.map(taskId => deleteTask(taskId));

    const results = await Promise.allSettled(promises);

    const successful = results.filter(result => result.status === 'fulfilled' && result.value.success);
    const failed = results.filter(result => result.status === 'rejected' || !result.value.success);

    taskLogger.success('Bulk delete completed', {
      successful: successful.length,
      failed: failed.length,
    });

    if (successful.length > 0) {
      toast.success(`✅ ${successful.length} tasks deleted successfully!`);
    }

    if (failed.length > 0) {
      toast.error(`❌ ${failed.length} tasks failed to delete`);
    }

    return {
      success: true,
      data: {
        successful: successful.length,
        failed: failed.length,
        results,
      },
    };

  } catch (error) {
    taskLogger.error('Error in bulk delete', error);
    toast.error(`❌ Bulk delete failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================================
// 🧪 TEST FUNCTIONS
// ============================================================================

/**
 * 🧪 Test task API connectivity
 * Simple test to check if the task API is working
 */
export const testTaskApiConnection = async () => {
  try {
    taskLogger.info('Testing task API connection...');

    const response = await fetch(
      `${GHL_CONFIG.baseUrl}/tasks/search`,
      {
        method: 'POST',
        headers: getGHLHeaders(),
        body: JSON.stringify({ completed: false, limit: 1 }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    taskLogger.success('Task API connection test successful');

    return {
      success: true,
      data: {
        status: response.status,
        taskCount: data.tasks ? data.tasks.length : 0,
      },
    };

  } catch (error) {
    taskLogger.error('Task API connection test failed', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
