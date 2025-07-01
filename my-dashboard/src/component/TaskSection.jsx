import { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';

const TaskSection = () => {
  const { tasksByCategory } = useContext(TaskContext);
  const [filter, setFilter] = useState('All');

  const handleFilterChange = (e) => setFilter(e.target.value);

  const categories = Object.keys(tasksByCategory);
  const filteredCategories =
    filter === 'All' ? categories : categories.filter((c) => c === filter);

  return (
    <section className="tasks-section w-full px-4 sm:px-6 md:px-10 py-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl shadow border border-gray-100 dark:border-gray-700 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          📋 Task Overview
        </h2>

        {/* Category Filter */}
        <select
          onChange={handleFilterChange}
          value={filter}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500 transition"
        >
          <option>All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, idx) => (
          <TaskCard
            key={idx}
            title={category}
            color={tasksByCategory[category].color || 'gray'}
            tasks={tasksByCategory[category].items}
          />
        ))}
      </div>
    </section>
  );
};

export default TaskSection;
