import { SearchInput, SectionHeader } from '@components/ui';
import { FiGrid, FiList, FiPlus } from 'react-icons/fi';
import { useTaskContext } from '@context/TaskContext';

const TaskFilters = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  typeFilter,
  setTypeFilter,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onCreateTask,
}) => {
  const getUniqueValues = (property) => {
    const allTasks = tasksByCategory?.['All Tasks']?.items || [];
    const values = new Set();

    allTasks.forEach(task => {
      const value = task[property] || task[`${property}Category`];
      if (value) {
        values.add(value);
      }
    });

    return Array.from(values).sort();
  };

  const statusOptions = ['All Status', ...getUniqueValues('status')];
  const priorityOptions = ['All Priority', ...getUniqueValues('priority')];
  const typeOptions = ['All Types', ...getUniqueValues('category')];

  return (
    <div className="mb-6">
      <SectionHeader
        title="Task Management"
        subtitle="Organize and track your tasks efficiently"
        action={
          <button
            onClick={onCreateTask}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" />
            Create Task
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {priorityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {typeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
