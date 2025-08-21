// ========================================
// 🎯 USER TASKS SECTION COMPONENT
// ========================================

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskContext } from '@context/TaskContext';
import TaskCard from './TaskCard';
import Modal from '@ui/Modal';

const UserTasksSection = () => {
  const { getUserSpecificTasks, currentUser, addTask } = useContext(TaskContext);
  const [userTasks, setUserTasks] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const tasks = getUserSpecificTasks();
    setUserTasks(tasks);
  }, [getUserSpecificTasks]);

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

  const handleSubmit = async (taskData) => {
    try {
      if (selectedTask) {
        // Update existing task
        // const result = await updateTask(taskData);
        // if (!result.success) {
        //   console.error('Failed to update task:', result.error);
        //   return;
        // }
      } else {
        // Create new task
        const result = await addTask('My Sales Tasks', taskData);
        if (!result.success) {
          console.error('Failed to create task:', result.error);
          return;
        }
      }
      handleClose();
    } catch (error) {
      console.error('Error handling task submission:', error);
    }
  };

  const getFilteredTasks = () => {
    if (!userTasks) return {};

    if (activeFilter === 'all') {
      return userTasks;
    }

    const filtered = {};
    for (const category in userTasks) {
      if (activeFilter === 'sales' && category.includes('Sales')) {
        filtered[category] = userTasks[category];
      } else if (activeFilter === 'communication' && category.includes('Communication')) {
        filtered[category] = userTasks[category];
      } else if (activeFilter === 'urgent' && category.includes('Overdue')) {
        filtered[category] = userTasks[category];
      }
    }
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const hasTasks = Object.values(filteredTasks).some(category => category.items.length > 0);

  if (!currentUser) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full px-2 sm:px-4 md:px-8 py-10 rounded-2xl border border-cyan-100 dark:border-cyan-900/40 shadow-xl dark:shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-md"
      >
        <div className="flex items-center justify-center h-32">
          <div className="text-cyan-700 dark:text-cyan-300">Please log in to view your tasks</div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full px-2 sm:px-4 md:px-8 py-10 rounded-2xl border border-cyan-100 dark:border-cyan-900/40 shadow-xl dark:shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-md"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              My Tasks
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {currentUser.name || 'User'}! Here are your assigned tasks.
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mt-2" />
          </div>

          <button
            onClick={handleCreateTask}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            + New Task
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All Tasks', icon: '📋' },
            { key: 'sales', label: 'Sales', icon: '💰' },
            { key: 'communication', label: 'Client Communication', icon: '💬' },
            { key: 'urgent', label: 'Urgent', icon: '⚠️' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {!hasTasks ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {activeFilter === 'all'
              ? "You don't have any tasks assigned yet."
              : `No ${activeFilter} tasks found.`
            }
          </p>
          <button
            onClick={handleCreateTask}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Task
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {Object.entries(filteredTasks).map(([category, categoryData], idx) => {
              if (categoryData.items.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  custom={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="will-change-transform"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                    <TaskCard
                      id={category}
                      title={category}
                      color={categoryData.color || 'gray'}
                      tasks={categoryData.items}
                      onEdit={handleEdit}
                      showUserInfo={false}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Task Summary */}
      {hasTasks && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Task Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(filteredTasks).map(([category, data]) => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.items.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {category.replace('My ', '')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        task={selectedTask}
        mode={selectedTask ? 'edit' : 'create'}
      />
    </motion.section>
  );
};

export default UserTasksSection;
