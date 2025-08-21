// ========================================
// KANBAN PIPELINE SECTION COMPONENT (Clean)
// ========================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { usePipeline } from '@context/PipelineContext';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiFilter, FiTrendingUp, FiPlus, FiSearch } from 'react-icons/fi';

const PipelineSection = ({ isAdmin = false }) => {
  const {
    leadsByStage,
    metrics,
    loading,
    error,
    stages,
    loadingProgress,
    manualRefresh,
    addLead,
    updateLead,
    moveLead,
    refreshData,
  } = usePipeline();

  const [filterStage, setFilterStage] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [leadsByStage]);

  const totalLeads = useMemo(
    () => Object.values(leadsByStage || {}).reduce((t, arr) => t + (arr?.length || 0), 0),
    [leadsByStage],
  );

  const filteredStages = useMemo(() => {
    if (!stages) return [];
    return filterStage === 'All' ? stages : stages.filter((s) => s.title === filterStage);
  }, [filterStage, stages]);

  const getFilteredLeadsForStage = useCallback(
    (stageTitle) => {
      const stageLeads = (leadsByStage && leadsByStage[stageTitle]) || [];
      if (!searchQuery) return stageLeads;
      const q = searchQuery.toLowerCase();
      return stageLeads.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(q) ||
          lead.loanType?.toLowerCase().includes(q) ||
          lead.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    },
    [leadsByStage, searchQuery],
  );

  // --- Handlers -----------------------------------------------------------
  const handleManualRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await manualRefresh();
      toast.success('Pipeline data refreshed');
    } catch {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [manualRefresh]);

  const handleAddLead = useCallback(
    async (stageTitle, newLead) => {
      try {
        await addLead(stageTitle, newLead);
        toast.success('Lead added');
      } catch {
        toast.error('Failed to add lead');
      }
    },
    [addLead],
  );

  const handleUpdateLead = useCallback(
    async (leadId, updates) => {
      try {
        await updateLead(leadId, updates);
        toast.success('Lead updated');
      } catch {
        toast.error('Failed to update lead');
      }
    },
    [updateLead],
  );

  const handleMoveLead = useCallback(
    async (leadId, fromStage, toStage) => {
      try {
        await moveLead(leadId, fromStage, toStage);
        toast.success('Lead moved');
      } catch {
        toast.error('Failed to move lead');
      }
    },
    [moveLead],
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveId(null);
      if (!active || !over || active.id === over.id) return;

      const leadId = active.id;
      const fromStage = active.data.current?.stage;

      // Resolve target stage id consistently from column or card
      const toStage =
        over.data?.current?.stage ||
        (over.data?.current?.type === 'column' ? over.data.current.stage : null) ||
        (stages?.some((s) => s.title === over.id) ? over.id : null);

      if (fromStage && toStage && fromStage !== toStage) {
        await handleMoveLead(leadId, fromStage, toStage);
      }
    },
    [handleMoveLead, stages],
  );

  const handleDragCancel = useCallback(() => setActiveId(null), []);

  const activeLead = useMemo(() => {
    if (!activeId || !leadsByStage) return null;
    return Object.values(leadsByStage).flat().find((l) => l.id === activeId) || null;
  }, [activeId, leadsByStage]);

  // --- UI States ----------------------------------------------------------
  if (loading) {
    return (
      <section className="w-full p-8">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01818E]"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {loadingProgress.message || 'Loading pipeline data...'}
          </p>
          {loadingProgress.total > 0 && (
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#01818E] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
              ></div>
            </div>
          )}
          {loadingProgress.total > 0 && (
            <p className="text-xs text-gray-500">
              {loadingProgress.current} of {loadingProgress.total} steps completed
            </p>
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold mb-2">Pipeline Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-[#01818E] text-white rounded-lg hover:bg-[#01818E]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshing ? 'Retrying...' : 'Retry'}
            </button>
            <button
              onClick={() => refreshData()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">Pipeline Overview</h2>
                {lastUpdated && (
                  <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>
                )}
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-[#01818E] to-cyan-400 rounded-full" />
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    setShowAddLeadModal(true);
                    setSelectedStage(filteredStages[0]?.title || null);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#01818E] text-white rounded-lg hover:bg-[#01818E]/90 transition-all shadow-sm font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Lead
                </button>
              )}

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

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads by name, type, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent shadow-sm transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent shadow-sm transition-all appearance-none pr-8"
                >
                  <option value="All">All Stages</option>
                  {(stages || []).map((stage) => (
                    <option key={stage.title} value={stage.title}>
                      {stage.title}
                    </option>
                  ))}
                </select>
                <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMetrics((v) => !v)}
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

      {/* Metrics */}
      {showMetrics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"
        >
          <div className="px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#01818E] mb-1">{totalLeads}</div>
                <div className="text-sm text-gray-600 font-medium">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{metrics?.conversionRate || 0}%</div>
                <div className="text-sm text-gray-600 font-medium">Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{metrics?.avgTimeInPipeline || '0:00'}</div>
                <div className="text-sm text-gray-600 font-medium">Avg Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  ${(metrics?.totalValue || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Value</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Board */}
      <div className="p-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          modifiers={[restrictToHorizontalAxis]}
        >
          <div className="flex gap-6 overflow-x-auto pb-6 kanban-scrollbar">
            {filteredStages.map((stage) => (
              <KanbanColumn
                key={stage.title}
                stage={stage}
                leads={getFilteredLeadsForStage(stage.title)}
                metrics={metrics?.stages?.[stage.title] || {}}
                onAddLead={isAdmin ? (newLead) => handleAddLead(stage.title, newLead) : undefined}
                onUpdateLead={isAdmin ? handleUpdateLead : undefined}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          <DragOverlay>{activeLead ? <KanbanCard lead={activeLead} isDragging /> : null}</DragOverlay>
        </DndContext>

        {filteredStages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-3 font-medium">No pipeline stages found</div>
            <div className="text-gray-500 text-sm">Try adjusting your filter or check your pipeline configuration.</div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddLeadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Lead</h3>
                <button onClick={() => setShowAddLeadModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Name</label>
                  <input type="text" placeholder="Enter lead name" className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pipeline Stage</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent">
                    {filteredStages.map((stage) => (
                      <option key={stage.title} value={stage.title}>
                        {stage.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                  <input type="number" placeholder="Enter loan amount" className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddLeadModal(false)} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-all font-medium">Cancel</button>
                <button
                  onClick={() => {
                    // TODO: wire up add lead form
                    setShowAddLeadModal(false);
                  }}
                  className="px-6 py-2.5 bg-[#01818E] text-white rounded-lg shadow-sm hover:bg-[#01818E]/90 transition-all font-medium"
                >
                  Add Lead
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default PipelineSection;
