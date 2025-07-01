import { useTheme } from '../../hooks/useTheme';

const TaskColumn = ({ title, color = 'gray', items = [] }) => {
  const { darkMode } = useTheme();

  // Dynamic border + header color
  const borderColor = {
    red: 'border-red-400',
    yellow: 'border-yellow-400',
    green: 'border-emerald-400',
    gray: darkMode ? 'border-gray-500' : 'border-gray-300',
  }[color] || 'border-gray-300';

  const titleColor = {
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    green: 'text-emerald-500',
    gray: darkMode ? 'text-white' : 'text-gray-700',
  }[color] || (darkMode ? 'text-white' : 'text-gray-800');

  // Status badge styles
  const statusColorMap = {
    'On Track': darkMode ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-100 text-emerald-800',
    'Pending': darkMode ? 'bg-yellow-300 text-yellow-900' : 'bg-yellow-100 text-yellow-800',
    'Overdue': darkMode ? 'bg-red-300 text-red-900' : 'bg-red-100 text-red-800',
  };

  const fallbackStatusClass = darkMode
    ? 'bg-gray-600 text-white'
    : 'bg-gray-200 text-gray-700';

  return (
    <div
      className={`w-[240px] min-w-[240px] max-w-sm rounded-2xl border ${borderColor} p-4 shadow-md space-y-4 transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-[#1f2937] to-[#111827]'
          : 'bg-white'
      }`}
    >
      {/* Column Header */}
      <h3 className={`text-sm font-bold tracking-wide uppercase ${titleColor}`}>
        {title}
      </h3>

      {/* Task Items */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm italic text-gray-400">No tasks</p>
        ) : (
          items.map((task, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 shadow-sm transition-all duration-200 ${
                darkMode
                  ? 'bg-[#2a2f3b] border-gray-600 hover:bg-[#3a3f4d] text-white'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
              }`}
            >
              <h4 className="font-semibold text-sm truncate">{task.title || 'Untitled Task'}</h4>
              <p className="text-xs mt-1 flex items-center gap-1 text-gray-400">
                📅 {task.dueDate || 'No due date'}
              </p>

              {task.statuses?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.statuses.map((status, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        statusColorMap[status] || fallbackStatusClass
                      }`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
