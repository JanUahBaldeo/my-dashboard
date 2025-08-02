import { motion } from 'framer-motion';
import { FiAlertTriangle, FiClock, FiCheckSquare, FiUsers } from 'react-icons/fi';

const TaskStats = () => {
  const taskStats = [
    { label: 'Overdue Tasks', count: 1, icon: FiAlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50' },
    { label: 'Pending Tasks', count: 3, icon: FiClock, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Completed', count: 1, icon: FiCheckSquare, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'Total Tasks', count: 5, icon: FiUsers, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ];

  return (
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
  );
};

export default TaskStats;
