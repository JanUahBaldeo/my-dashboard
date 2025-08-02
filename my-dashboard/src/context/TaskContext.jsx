import { createContext, useEffect, useState } from 'react';
import { createLogger } from '@utils/logger';
import { fetchTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '@api/taskApi';

const taskLogger = createLogger('TaskContext');
import { parseGHLTaskDate, isTaskOverdue, isTaskDueToday, isTaskDueWithinDays } from '@utils/ghlDateParser';
import { enhanceTasksWithGHLFields } from '@utils/ghlTaskEnhancer';

export const TaskContext = createContext();

const categorizeTasks = (tasks, currentUser = null) => {
  const result = {
    "Today's Tasks": { color: 'teal', items: [] },
    'Overdue Tasks': { color: 'orange', items: [] },
    'Upcoming in 48 Hours': { color: 'blue', items: [] },
    'My Sales Tasks': { color: 'purple', items: [] },
    'Client Communication': { color: 'indigo', items: [] },
    'All Tasks': { color: 'gray', items: [] }, // New category for the dashboard view
  };

  if (!Array.isArray(tasks)) {
    taskLogger.warn('Tasks is not an array:', tasks);
    return result;
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  tasks.forEach((task) => {
    if (!task || typeof task !== 'object') {
      taskLogger.warn('Invalid task object:', task);
      return;
    }

    try {
      // Use the GHL date parser utility
      const { date: taskDate, formattedDate, originalDate, fieldName } = parseGHLTaskDate(task);

    const taskItem = {
        id: task._id || task.id || `task-${Date.now()}-${Math.random()}`,
        title: task.title || 'Untitled Task',
      date: formattedDate,
        originalDate: originalDate,
        dueDate: taskDate,
        tags: Array.isArray(task.tags) ? task.tags : [],
        actions: task.body || task.actions || '',
        assignedTo: task.assignedTo || task.assigned_to || task.userId || null,
        priority: task.priority || 'medium',
        category: task.category || 'general',
        isSalesRelated: isSalesRelatedTask(task),
        isClientCommunication: isClientCommunicationTask(task),

        // Enhanced GHL fields
        status: task.status || 'pending',
        statusCategory: task.statusCategory || 'info',
        statusColor: task.statusColor || 'blue',
        description: task.description || task.body || task.actions || '',
        descriptionType: task.descriptionType || 'body',

        // Assignee information
        assignee: task.assignee,
        assigneeId: task.assigneeId,
        assigneeName: task.assigneeName,
        assigneeEmail: task.assigneeEmail,

        // Associated contact information
        associatedContact: task.associatedContact,
        contactId: task.contactId,
        contactName: task.contactName,
        contactEmail: task.contactEmail,
        contactPhone: task.contactPhone,

        // Additional metadata
        hasContact: task.hasContact || false,
        hasAssignee: task.hasAssignee || false,
        enhancedAt: task.enhancedAt,
    };

      // Check if task is assigned to current user
      const isAssignedToUser = currentUser && taskItem.assignedTo === currentUser.id;

      // Add to All Tasks category for dashboard view
      result['All Tasks'].items.push(taskItem);

      // Only categorize by date if we have a valid date
      if (taskDate) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);

        // Categorize by date
    if (formattedDate === today) {
      result["Today's Tasks"].items.push(taskItem);
    } else if (taskDate < now) {
      result['Overdue Tasks'].items.push(taskItem);
    } else if (taskDate <= twoDaysLater) {
      result['Upcoming in 48 Hours'].items.push(taskItem);
        }
      }

      // Categorize by user assignment and type
      if (isAssignedToUser && taskItem.isSalesRelated) {
        result['My Sales Tasks'].items.push(taskItem);
      }

      if (isAssignedToUser && taskItem.isClientCommunication) {
        result['Client Communication'].items.push(taskItem);
      }

    } catch (error) {
      taskLogger.error('Error processing task:', error, task);
    }
  });

  return result;
};

// Helper function to determine if a task is sales-related
const isSalesRelatedTask = (task) => {
  const salesKeywords = [
    'sales', 'lead', 'prospect', 'quote', 'proposal', 'deal', 'opportunity',
    'follow up', 'follow-up', 'cold call', 'pitch', 'demo', 'presentation',
    'negotiation', 'closing', 'commission', 'revenue', 'target', 'goal',
  ];

  const taskText = `${task.title || ''} ${task.body || ''} ${task.actions || ''}`.toLowerCase();
  const tags = Array.isArray(task.tags) ? task.tags.map(tag => tag.toLowerCase()) : [];

  return salesKeywords.some(keyword =>
    taskText.includes(keyword) || tags.some(tag => tag.includes(keyword)),
  );
};

// Helper function to determine if a task is client communication
const isClientCommunicationTask = (task) => {
  const communicationKeywords = [
    'client', 'customer', 'communication', 'email', 'call', 'meeting',
    'consultation', 'support', 'service', 'feedback', 'review', 'update',
    'check-in', 'check in', 'touch base', 'touchbase', 'status update',
    'phone', 'video', 'zoom', 'teams', 'skype', 'conference',
  ];

  const taskText = `${task.title || ''} ${task.body || ''} ${task.actions || ''}`.toLowerCase();
  const tags = Array.isArray(task.tags) ? task.tags.map(tag => tag.toLowerCase()) : [];

  return communicationKeywords.some(keyword =>
    taskText.includes(keyword) || tags.some(tag => tag.includes(keyword)),
  );
};

const fetchAndTransformTasks = async (currentUser = null) => {
  try {
    // Try to fetch from API first
    const apiResponse = await fetchTasks();

    if (apiResponse.success) {
      // Debug: Log the first task to see GHL date fields
      if (apiResponse.data && apiResponse.data.length > 0) {
        const sampleTask = apiResponse.data[0];
        taskLogger.debug('GHL Task sample:', {
          id: sampleTask._id || sampleTask.id,
          title: sampleTask.title,
          dueDate: sampleTask.dueDate,
          due_date: sampleTask.due_date,
          due: sampleTask.due,
          date: sampleTask.date,
          scheduledDate: sampleTask.scheduledDate,
          scheduled_date: sampleTask.scheduled_date,
          allKeys: Object.keys(sampleTask),
        });
    }

      // Enhance tasks with additional GHL fields (status, description, contact, assignee)
      taskLogger.info('Enhancing tasks with GHL fields...');
      const enhancedTasks = await enhanceTasksWithGHLFields(apiResponse.data);
      taskLogger.success('Tasks enhanced successfully', { count: enhancedTasks.length });

      return categorizeTasks(enhancedTasks, currentUser);
    } else {
      throw new Error(apiResponse.error);
    }
  } catch (error) {
    taskLogger.error('Error fetching tasks from API, falling back to mock data', error);

    // Fallback to mock data if API fails
    try {
      const { mockTasks } = await import('@utils/mockTasks');
      return categorizeTasks(mockTasks, currentUser);
    } catch (mockError) {
      taskLogger.error('Error loading mock data', mockError);
    return {
      "Today's Tasks": { color: 'teal', items: [] },
      'Overdue Tasks': { color: 'orange', items: [] },
      'Upcoming in 48 Hours': { color: 'blue', items: [] },
        'My Sales Tasks': { color: 'purple', items: [] },
        'Client Communication': { color: 'indigo', items: [] },
        'All Tasks': { color: 'gray', items: [] },
    };
    }
  }
};

export const TaskProvider = ({ children }) => {
  const [tasksByCategory, setTasksByCategory] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userFilter, setUserFilter] = useState('all'); // 'all', 'assigned', 'unassigned'

  useEffect(() => {
    // Get current user from localStorage or context
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        taskLogger.error('Error parsing stored user:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchAndTransformTasks(currentUser).then((data) => {
      taskLogger.debug('Tasks loaded', { taskCount: Object.keys(data).length });
      setTasksByCategory(data);
    });
  }, [currentUser]);

  const addTask = async (category, task) => {
    try {
      // Use the task data as provided, only add user assignment if not already set
      const taskData = {
        ...task,
        assignedTo: task.assignedTo || currentUser?.id || null,
        category: task.category || category,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      taskLogger.info('Sending task data to GHL:', taskData);
      const apiResponse = await apiCreateTask(taskData);

      if (apiResponse.success) {
    const newTask = {
          ...apiResponse.data,
          id: apiResponse.data._id || apiResponse.data.id || `${Date.now()}`,
    };

        setTasksByCategory((prev) => {
          if (!prev) return null;
          return {
      ...prev,
      [category]: {
        ...prev[category],
        items: [...prev[category].items, newTask],
      },
          };
        });

        return { success: true, data: newTask };
      } else {
        throw new Error(apiResponse.error);
      }
    } catch (error) {
      taskLogger.error('Error adding task', error);
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const taskData = {
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      };

      const apiResponse = await apiUpdateTask(updatedTask.id, taskData);

      if (apiResponse.success) {
    setTasksByCategory((prev) => {
          if (!prev) return null;
      const newState = {};
      for (const category in prev) {
        newState[category] = {
          ...prev[category],
          items: prev[category].items.map((task) =>
                task.id === updatedTask.id ? { ...task, ...apiResponse.data } : task,
          ),
        };
      }
      return newState;
    });

        return { success: true, data: apiResponse.data };
      } else {
        throw new Error(apiResponse.error);
      }
    } catch (error) {
      taskLogger.error('Error updating task', error);
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const apiResponse = await apiDeleteTask(taskId);

      if (apiResponse.success) {
    setTasksByCategory((prev) => {
          if (!prev) return null;
      const newState = {};
      for (const category in prev) {
        newState[category] = {
          ...prev[category],
          items: prev[category].items.filter((task) => task.id !== taskId),
        };
      }
      return newState;
    });

        return { success: true, data: { taskId } };
      } else {
        throw new Error(apiResponse.error);
      }
    } catch (error) {
      taskLogger.error('Error deleting task', error);
      return { success: false, error: error.message };
    }
  };

  const reorderTasks = (category, newItemOrder) => {
    setTasksByCategory((prev) => {
      if (!prev) return null;
      return {
      ...prev,
      [category]: {
        ...prev[category],
        items: newItemOrder,
      },
      };
    });
  };

  const moveTaskToCategory = (fromCategory, toCategory, taskId) => {
    setTasksByCategory((prev) => {
      if (!prev) return null;
      const taskToMove = prev[fromCategory]?.items.find((t) => t.id === taskId);
      if (!taskToMove) return prev;

      return {
        ...prev,
        [fromCategory]: {
          ...prev[fromCategory],
          items: prev[fromCategory].items.filter((t) => t.id !== taskId),
        },
        [toCategory]: {
          ...prev[toCategory],
          items: [...prev[toCategory].items, taskToMove],
        },
      };
    });
  };

  const filterTasksByUser = (filterType) => {
    setUserFilter(filterType);
  };

  const getFilteredTasks = () => {
    if (!tasksByCategory) return null;

    if (userFilter === 'all') {
      return tasksByCategory;
    }

    const filtered = {};
    for (const category in tasksByCategory) {
      filtered[category] = {
        ...tasksByCategory[category],
        items: tasksByCategory[category].items.filter(task => {
          if (userFilter === 'assigned') {
            return task.assignedTo === currentUser?.id;
          } else if (userFilter === 'unassigned') {
            return !task.assignedTo;
          }
          return true;
        }),
      };
    }
    return filtered;
  };

  const getUserSpecificTasks = () => {
    if (!tasksByCategory || !currentUser) return null;

    const userTasks = {
      'My Sales Tasks': { color: 'purple', items: [] },
      'Client Communication': { color: 'indigo', items: [] },
      'My Today\'s Tasks': { color: 'teal', items: [] },
      'My Overdue Tasks': { color: 'orange', items: [] },
    };

    // Filter tasks assigned to current user
    for (const category in tasksByCategory) {
      const userItems = tasksByCategory[category].items.filter(
        task => task.assignedTo === currentUser.id,
      );

      if (category === "Today's Tasks" && userItems.length > 0) {
        userTasks['My Today\'s Tasks'].items = userItems;
      } else if (category === 'Overdue Tasks' && userItems.length > 0) {
        userTasks['My Overdue Tasks'].items = userItems;
      } else if (category === 'My Sales Tasks') {
        userTasks['My Sales Tasks'].items = userItems;
      } else if (category === 'Client Communication') {
        userTasks['Client Communication'].items = userItems;
      }
    }

    return userTasks;
  };

  return (
    <TaskContext.Provider
      value={{
        tasksByCategory,
        setTasksByCategory,
        currentUser,
        userFilter,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        moveTaskToCategory,
        filterTasksByUser,
        getFilteredTasks,
        getUserSpecificTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
