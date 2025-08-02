// ========================================
// 🧪 GHL TASK ENHANCEMENT TEST
// ========================================

import { enhanceTaskWithGHLFields } from './ghlTaskEnhancer';
import { taskLogger } from './logger';

/**
 * 🧪 Test GHL task enhancement functionality
 */
export const testGHLTaskEnhancement = async () => {
  try {
    taskLogger.info('🧪 Testing GHL task enhancement...');

    // Sample GHL task data
    const sampleTask = {
      _id: 'test-task-123',
      title: 'Follow up with client John Smith',
      body: 'Call client to discuss loan application status',
      status: 'in progress',
      assignedTo: 'user-456',
      contactId: 'contact-789',
      dueDate: '2024-01-15T10:00:00Z',
      priority: 'high',
      tags: ['sales', 'follow-up'],
    };

    taskLogger.info('Sample task before enhancement:', sampleTask);

    // Enhance the task
    const enhancedTask = await enhanceTaskWithGHLFields(sampleTask);

    taskLogger.info('Enhanced task:', {
      id: enhancedTask.id,
      title: enhancedTask.title,
      status: enhancedTask.status,
      statusCategory: enhancedTask.statusCategory,
      statusColor: enhancedTask.statusColor,
      description: enhancedTask.description,
      descriptionType: enhancedTask.descriptionType,
      assignee: enhancedTask.assignee,
      assigneeName: enhancedTask.assigneeName,
      associatedContact: enhancedTask.associatedContact,
      contactName: enhancedTask.contactName,
      hasContact: enhancedTask.hasContact,
      hasAssignee: enhancedTask.hasAssignee,
      enhancedAt: enhancedTask.enhancedAt,
    });

    // Verify enhancement worked
    const hasRequiredFields = enhancedTask.status &&
                             enhancedTask.statusCategory &&
                             enhancedTask.statusColor &&
                             enhancedTask.description &&
                             enhancedTask.descriptionType;

    if (hasRequiredFields) {
      taskLogger.success('✅ GHL task enhancement test passed!');
      return {
        success: true,
        message: 'GHL task enhancement working correctly',
        enhancedTask,
      };
    } else {
      taskLogger.error('❌ GHL task enhancement test failed - missing required fields');
      return {
        success: false,
        message: 'GHL task enhancement failed - missing required fields',
        enhancedTask,
      };
    }

  } catch (error) {
    taskLogger.error('❌ GHL task enhancement test failed:', error);
    return {
      success: false,
      message: `GHL task enhancement test failed: ${error.message}`,
      error,
    };
  }
};

/**
 * 🧪 Test multiple tasks enhancement
 */
export const testMultipleTasksEnhancement = async () => {
  try {
    taskLogger.info('🧪 Testing multiple tasks enhancement...');

    const sampleTasks = [
      {
        _id: 'task-1',
        title: 'Complete loan application',
        status: 'pending',
        assignedTo: 'user-123',
      },
      {
        _id: 'task-2',
        title: 'Review documents',
        status: 'completed',
        contactId: 'contact-456',
      },
      {
        _id: 'task-3',
        title: 'Schedule meeting',
        status: 'overdue',
        assignedTo: 'user-789',
        contactId: 'contact-101',
      },
    ];

    const { enhanceTasksWithGHLFields } = await import('./ghlTaskEnhancer');
    const enhancedTasks = await enhanceTasksWithGHLFields(sampleTasks);

    taskLogger.success(`✅ Enhanced ${enhancedTasks.length} tasks successfully`);

    return {
      success: true,
      message: `Enhanced ${enhancedTasks.length} tasks successfully`,
      enhancedTasks,
    };

  } catch (error) {
    taskLogger.error('❌ Multiple tasks enhancement test failed:', error);
    return {
      success: false,
      message: `Multiple tasks enhancement test failed: ${error.message}`,
      error,
    };
  }
};
