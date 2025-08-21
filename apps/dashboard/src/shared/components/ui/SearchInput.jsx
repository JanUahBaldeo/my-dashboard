import { memo, useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const INPUT_BASE =
  'w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg ' +
  'focus:ring-2 focus:ring-[#01818E]/10 focus:border-[#01818E] ' +
  'hover:border-gray-300 transition-all duration-300 shadow-sm ' +
  'text-sm bg-white placeholder-gray-400';

const SELECT_BASE =
  'border border-gray-200 rounded-lg px-3 py-2.5 text-sm ' +
  'focus:ring-2 focus:ring-[#01818E]/10 focus:border-[#01818E] ' +
  'hover:border-gray-300 transition-all duration-300 shadow-sm bg-white';

const normalizeOptions = (options) => {
  const seen = new Set();
  const out = [];
  for (const o of options || []) {
    const opt =
      typeof o === 'string'
        ? { value: o, label: o }
        : { value: o?.value ?? o?.label ?? '', label: o?.label ?? String(o?.value ?? '') };
    if (!opt.value && !opt.label) continue;
    if (seen.has(opt.value)) continue;
    seen.add(opt.value);
    out.push(opt);
  }
  return out;
};

const SearchInput = ({
  value = '',
  onChange,
  placeholder = 'Search…',
  className = 'max-w-lg',
  showFilter = false,
  filterValue,
  onFilterChange,
  filterOptions = [],
  onClear,            // optional: provide to enable the clear button
  id,                 // optional input id
}) => {
  const options = useMemo(() => normalizeOptions(filterOptions), [filterOptions]);

  return (
    <div className="flex items-center gap-3" role="search">
      <div className={`relative flex-1 ${className}`}>
        <FiSearch
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          inputMode="search"
          autoComplete="off"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={INPUT_BASE}
          aria-label={placeholder}
        />
        {onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Clear search"
          >
            <FiX className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showFilter && (
        <select
          value={filterValue}
          onChange={onFilterChange}
          className={SELECT_BASE}
          aria-label="Filter"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default memo(SearchInput);
