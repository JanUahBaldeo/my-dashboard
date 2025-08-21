// ========================================
// 🎯 TASK MANAGEMENT COMPONENT
// ========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiFilter,
  FiAlertTriangle,
  FiClock,
  FiCheckSquare,
  FiUsers,
  FiPhone,
  FiFileText,
  FiMail,
  FiUser,
  FiCheck,
} from 'react-icons/fi';

const TaskManagement = () => {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const taskStats = [
    { label: 'Overdue Tasks', count: 1, icon: FiAlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50' },
    { label: 'Pending Tasks', count: 3, icon: FiClock, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Completed', count: 1, icon: FiCheckSquare, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'Total Tasks', count: 5, icon: FiUsers, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ];

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

  const getTypeIcon = (type) => {
    const icons = {
      phone: FiPhone,
      document: FiFileText,
      email: FiMail,
      person: FiUser,
    };
    return icons[type] || FiFileText;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      overdue: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[status] || colors.pending;
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === 'All Status' || task.status === statusFilter.toLowerCase();
    const priorityMatch = priorityFilter === 'All Priority' || task.priority === priorityFilter.toLowerCase();
    const typeMatch = typeFilter === 'All Types' || task.type === typeFilter.toLowerCase();
    return statusMatch && priorityMatch && typeMatch;
  });

  return (
    <div className="w-full max-w-l mx-auto px-4 lg:px-6">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {taskStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor} dark:bg-gray-700`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Status">All Status</option>
              <option value="overdue">Overdue</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Priority">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Types">All Types</option>
              <option value="phone">Phone</option>
              <option value="document">Document</option>
              <option value="email">Email</option>
              <option value="person">Person</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Completion Checkbox */}
                  <div className="flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {task.completed && <FiCheck size={12} className="text-white" />}
                    </div>
                  </div>

                  {/* Task Type Icon */}
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {React.createElement(getTypeIcon(task.type), {
                        size: 16,
                        className: 'text-gray-600 dark:text-gray-400',
                      })}
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Client: {task.client} • Loan: {task.loan}
                    </p>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-lg mb-2">No tasks found</div>
            <div className="text-gray-500 text-sm">Try adjusting your filters or create a new task.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
