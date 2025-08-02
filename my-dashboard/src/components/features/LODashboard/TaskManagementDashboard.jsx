// ========================================
// 🎯 ENHANCED TASK MANAGEMENT DASHBOARD COMPONENT
// ========================================

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskContext } from '@context/TaskContext';
import { useUser } from '@context/UserContext';
import Modal from '@components/ui/Modal';
import DebugPanel from '@components/ui/DebugPanel';
import { testGHLTaskCreation, testGHLConnection } from '@utils/testGHLTaskCreation';
import { FiPlus } from 'react-icons/fi';
import { TaskStats, TaskFilters, TaskList } from './tasks';

const TaskManagementDashboard = () => {
  const { tasksByCategory, currentUser, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const { user } = useUser();
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  // Get all tasks for display
  const getAllTasks = () => {
    const tasks = tasksByCategory?.['All Tasks']?.items || [];

    // If no tasks, add some test data for debugging
    if (tasks.length === 0) {
      console.log('No tasks found, adding test data...');
      return [
        {
          id: 'test-1',
          title: 'Test Task 1',
          description: 'This is a test task',
          status: 'pending',
          priority: 'high',
          category: 'sales',
          contactName: 'John Doe',
          dueDate: new Date(),
        },
        {
          id: 'test-2',
          title: 'Test Task 2',
          description: 'Another test task',
          status: 'completed',
          priority: 'medium',
          category: 'communication',
          contactName: 'Jane Smith',
          dueDate: new Date(),
        },
      ];
    }

    return tasks;
  };

  // Filter tasks based on current filters
  const getFilteredTasks = () => {
    let tasks = getAllTasks();
    console.log('🔍 Starting filter process with', tasks.length, 'tasks');

    if (searchQuery) {
      const beforeSearch = tasks.length;
      tasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.contactName && task.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.body && task.body.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      console.log('🔍 Search filter:', beforeSearch, '->', tasks.length, 'tasks');
    }

    if (statusFilter !== 'All Status') {
      const beforeStatus = tasks.length;
      tasks = tasks.filter(task =>
        task.status?.toLowerCase() === statusFilter.toLowerCase() ||
        task.statusCategory?.toLowerCase() === statusFilter.toLowerCase(),
      );
      console.log('🔍 Status filter:', beforeStatus, '->', tasks.length, 'tasks (filtering for:', statusFilter, ')');
    }

    if (priorityFilter !== 'All Priority') {
      const beforePriority = tasks.length;
      tasks = tasks.filter(task =>
        task.priority?.toLowerCase() === priorityFilter.toLowerCase(),
      );
      console.log('🔍 Priority filter:', beforePriority, '->', tasks.length, 'tasks (filtering for:', priorityFilter, ')');
    }

    if (typeFilter !== 'All Types') {
      const beforeType = tasks.length;
      tasks = tasks.filter(task =>
        task.category?.toLowerCase() === typeFilter.toLowerCase() ||
        task.type?.toLowerCase() === typeFilter.toLowerCase(),
      );
      console.log('🔍 Type filter:', beforeType, '->', tasks.length, 'tasks (filtering for:', typeFilter, ')');
    }

    console.log('🔍 Final filtered tasks:', tasks.length);
    return tasks;
  };

  const getUniqueValues = (property) => {
    const tasks = getAllTasks();
    const values = new Set();

    tasks.forEach(task => {
      const value = task[property];
      if (value) {
        values.add(value);
      }
    });

    return Array.from(values).sort();
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleClose = () => {
    setSelectedTask(null);
    setModalOpen(false);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleTestGHLConnection = async () => {
    try {
      const result = await testGHLConnection();
      console.log('GHL Connection Test Result:', result);
    } catch (error) {
      console.error('GHL Connection Test Error:', error);
    }
  };

  const handleTestGHLTaskCreation = async () => {
    try {
      const result = await testGHLTaskCreation();
      console.log('GHL Task Creation Test Result:', result);
    } catch (error) {
      console.error('GHL Task Creation Test Error:', error);
    }
  };

  const handleTaskToggle = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await updateTask(updatedTask);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const filteredTasks = getFilteredTasks();

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
          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium"
          >
            <FiPlus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* Task Statistics Cards */}
      <TaskStats tasksByCategory={tasksByCategory} />

      {/* Filter Bar */}
      <TaskFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Task List */}
      <TaskList
        filteredTasks={filteredTasks}
        onEdit={handleEdit}
        onToggle={handleTaskToggle}
        viewMode={viewMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tasksPerPage={tasksPerPage}
      />

      {/* Debug Panel */}
      <DebugPanel
        onTestGHLConnection={handleTestGHLConnection}
        onTestGHLTaskCreation={handleTestGHLTaskCreation}
      />

      {/* Task Modal */}
      <AnimatePresence>
        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={handleClose}
            title={selectedTask ? 'Edit Task' : 'Create New Task'}
          >
            <div className="p-6">
              <p className="text-gray-600">
                {selectedTask ? 'Edit task functionality will be implemented here.' : 'Create task functionality will be implemented here.'}
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManagementDashboard;
