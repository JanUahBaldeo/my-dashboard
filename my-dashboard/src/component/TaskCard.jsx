import { useState } from 'react';
import Modal from './Modal';

const TaskCard = ({ title, color, tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleEdit = (task) => setSelectedTask(task);
  const handleClose = () => setSelectedTask(null);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const headerBg = {
    teal: 'bg-teal-600 text-white',
    orange: 'bg-orange-500 text-white',
    blue: 'bg-sky-600 text-white',
    default: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white',
  };

  const arrowIcon = collapsed ? 'rotate-0' : 'rotate-180';

  const completedCount = tasks.filter((task) =>
    task.actions?.includes('Completed')
  ).length;
  const completionPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div
        className={`px-4 py-3 flex justify-between items-center cursor-pointer transition ${headerBg[color] || headerBg.default}`}
        onClick={toggleCollapse}
      >
        <h3 className="text-sm font-bold tracking-wide uppercase">{title}</h3>
        <span
          className={`text-lg transform transition-transform duration-300 ${arrowIcon}`}
        >
          ⌄
        </span>
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          collapsed ? 'hidden' : 'block'
        } p-4 space-y-4`}
      >
        {/* Progress Bar */}
        {tasks.length > 0 && (
          <>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className={`h-full bg-green-500 transition-all`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completedCount} of {tasks.length} completed
            </p>
          </>
        )}

        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            No tasks available.
          </p>
        ) : (
          tasks.map((task, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md transition duration-150"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    📅 {task.date || 'No due date'}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(task)}
                  className="text-xs px-3 py-1 rounded bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-700 dark:text-white transition"
                >
                  Edit
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {(task.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs rounded-full font-medium
                      ${tag.includes('High') ? 'bg-red-200 text-red-800 dark:bg-red-500 dark:text-white' :
                        tag.includes('Low') ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-white' :
                          tag.includes('Meeting') ? 'bg-gray-400 text-white' :
                            'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {(task.actions || []).map((action, idx) => (
                  <button
                    key={idx}
                    className={`text-xs px-2 py-1 rounded transition
                      ${action === 'Call'
                        ? 'bg-blue-500 text-white'
                        : action === 'Schedule Now'
                        ? 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white border border-gray-300 dark:border-gray-500'
                        : action === 'Completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'}`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTask && <Modal task={selectedTask} onClose={handleClose} />}
    </div>
  );
};

export default TaskCard;
