import { motion } from 'framer-motion';
import { FiRefreshCw, FiFilter, FiTrendingUp, FiPlus, FiSearch } from 'react-icons/fi';

const PipelineHeader = ({
  lastUpdated,
  refreshing,
  loading,
  searchQuery,
  setSearchQuery,
  filterStage,
  handleFilterChange,
  handleManualRefresh,
  showMetrics,
  setShowMetrics,
  isAdmin,
  setShowAddLeadModal,
  setSelectedStage,
  filteredStages,
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-8 py-6">
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Pipeline Overview
              </h2>
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated}
                </span>
              )}
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-[#01818E] to-cyan-400 rounded-full" />
          </div>

          {/* Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Add Lead Button */}
            {isAdmin && (
              <button
                onClick={() => {
                  setShowAddLeadModal(true);
                  setSelectedStage(filteredStages[0]?.title);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#01818E] text-white rounded-lg hover:bg-[#01818E]/90 transition-all shadow-sm font-medium"
              >
                <FiPlus className="w-4 h-4" />
                Add Lead
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Refresh pipeline data"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Enhanced Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search and Filter Section */}
          <div className="flex flex-1 items-center gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads by name, type, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterStage}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent shadow-sm transition-all appearance-none pr-8"
              >
                <option value="All">All Stages</option>
                {filteredStages.map((stage) => (
                  <option key={stage.title} value={stage.title}>
                    {stage.title}
                  </option>
                ))}
              </select>
              <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center gap-3">
            {/* Metrics Toggle */}
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all shadow-sm font-medium ${
                showMetrics
                  ? 'bg-[#01818E] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FiTrendingUp className="w-4 h-4" />
              {showMetrics ? 'Hide' : 'Show'} Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineHeader;
