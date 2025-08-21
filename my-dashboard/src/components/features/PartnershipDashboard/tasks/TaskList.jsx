import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiFileText, FiMail, FiUser, FiCheck } from 'react-icons/fi';

const TaskList = ({ filteredTasks }) => {
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

  return (
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
  );
};

export default TaskList;
