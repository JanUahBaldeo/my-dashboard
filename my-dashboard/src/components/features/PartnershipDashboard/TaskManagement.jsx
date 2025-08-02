// ========================================
// 🎯 TASK MANAGEMENT COMPONENT
// ========================================

import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { TaskStats, TaskFilters, TaskList } from './tasks';

const TaskManagement = () => {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const tasks = [
    {
      id: 1,
      title: 'Follow up with Sarah Johnson',
      client: 'Sarah Johnson',
      loan: 'LN-2024-001',
      type: 'phone',
      priority: 'high',
      status: 'overdue',
      dueDate: '1/14/2024',
      completed: false,
    },
    {
      id: 2,
      title: 'Review Mike Chen application',
      client: 'Mike Chen',
      loan: 'LN-2024-002',
      type: 'document',
      priority: 'medium',
      status: 'pending',
      dueDate: '1/15/2024',
      completed: false,
    },
    {
      id: 3,
      title: 'Send welcome email to Lisa Wong',
      client: 'Lisa Wong',
      loan: 'LN-2024-003',
      type: 'email',
      priority: 'low',
      status: 'pending',
      dueDate: '1/16/2024',
      completed: false,
    },
    {
      id: 4,
      title: 'Schedule David Smith closing',
      client: 'David Smith',
      loan: 'LN-2024-004',
      type: 'person',
      priority: 'high',
      status: 'pending',
      dueDate: '1/17/2024',
      completed: false,
    },
    {
      id: 5,
      title: 'Update Jennifer Davis file',
      client: 'Jennifer Davis',
      loan: 'LN-2024-005',
      type: 'document',
      priority: 'medium',
      status: 'completed',
      dueDate: '1/18/2024',
      completed: true,
    },
  ];

  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === 'All Status' || task.status === statusFilter.toLowerCase();
    const priorityMatch = priorityFilter === 'All Priority' || task.priority === priorityFilter.toLowerCase();
    const typeMatch = typeFilter === 'All Types' || task.type === typeFilter.toLowerCase();
    return statusMatch && priorityMatch && typeMatch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Task Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor team task completion and productivity
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium">
            <FiPlus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* Task Statistics Cards */}
      <TaskStats />

      {/* Filter Bar */}
      <TaskFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Task List */}
      <TaskList filteredTasks={filteredTasks} />
    </div>
  );
};

export default TaskManagement;
