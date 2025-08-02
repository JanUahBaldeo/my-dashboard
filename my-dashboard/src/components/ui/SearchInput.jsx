import { FiSearch } from 'react-icons/fi';

const SearchInput = ({
  value,
  onChange,
  placeholder,
  className = 'max-w-lg',
  showFilter = false,
  filterValue,
  onFilterChange,
  filterOptions = [],
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex-1 ${className}`}>
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01818E]/10 focus:border-[#01818E] hover:border-gray-300 transition-all duration-300 shadow-sm text-sm bg-white placeholder-gray-400"
        />
      </div>
      {showFilter && (
        <select
          value={filterValue}
          onChange={onFilterChange}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#01818E]/10 focus:border-[#01818E] hover:border-gray-300 transition-all duration-300 shadow-sm bg-white"
        >
          {filterOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchInput;
