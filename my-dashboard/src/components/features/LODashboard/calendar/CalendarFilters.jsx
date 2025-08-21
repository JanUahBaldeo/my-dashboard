import { SearchInput, SectionHeader } from '@components/ui';
import { FiPlus } from 'react-icons/fi';

const CalendarFilters = ({
  filter,
  setFilter,
  search,
  setSearch,
  onAddEvent,
}) => {
  const filterOptions = ['All', 'Activity', 'Campaign', 'Email', 'Task', 'Meeting', 'Call', 'FollowUp', 'Review'];

  return (
    <div className="mb-6">
      <SectionHeader
        title="Calendar"
        subtitle="Manage your schedule and appointments"
        action={
          <button
            onClick={onAddEvent}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" />
            Add Event
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;
