import { Search, Filter } from 'lucide-react';

const CommunicationFilters = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterDirection,
  setFilterDirection,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search communications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-1">
          <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            <Filter className="w-3 h-3" />
            Filter
          </button>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="note">Note</option>
            <option value="system">System</option>
          </select>
          <select
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
          >
            <option value="all">All Direction</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CommunicationFilters;
