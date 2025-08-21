// 🎯 Shared Pipeline Section Component
// Reusable pipeline component for all dashboard types

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { usePipeline } from '@context/PipelineContext';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiFilter, FiTrendingUp, FiPlus, FiSearch, FiGrid, FiList, FiSettings } from 'react-icons/fi';
import { uiLogger } from '@utils/logger';

const SharedPipelineSection = ({ 
  isAdmin = false, 
  dashboardType = 'general',
  showMetrics = true,
  showAddLead = true,
  customStages = null 
}) => {
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
  } = usePipeline();

  const [filterStage, setFilterStage] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // kanban or list

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Use custom stages if provided, otherwise use default stages
  const displayStages = customStages || stages;

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [leadsByStage]);

  const handleFilterChange = (stage) => {
    setFilterStage(stage);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await manualRefresh();
      toast.success('✅ Pipeline data refreshed!');
    } catch (error) {
      toast.error('❌ Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddLead = async (stageTitle, newLead) => {
    try {
      await addLead(stageTitle, newLead);
      toast.success('✅ Lead added successfully!');
    } catch (error) {
      uiLogger.error('Error adding lead', error);
      toast.error('Failed to add lead');
    }
  };

  const handleUpdateLead = async (leadId, updates) => {
    try {
      await updateLead(leadId, updates);
      toast.success('✅ Lead updated successfully!');
    } catch (error) {
      uiLogger.error('Error updating lead', error);
      toast.error('Failed to update lead');
    }
  };

  const handleMoveLead = async (leadId, fromStage, toStage) => {
    try {
      await moveLead(leadId, fromStage, toStage);
      toast.success('✅ Lead moved successfully!');
    } catch (error) {
      uiLogger.error('Error moving lead', error);
      toast.error('Failed to move lead');
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const activeLead = findLeadById(active.id);
      const overStage = over?.id;

      if (activeLead && overStage) {
        await handleMoveLead(activeLead.id, activeLead.stage, overStage);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const findLeadById = (leadId) => {
    for (const [stage, leads] of Object.entries(leadsByStage)) {
      const lead = leads.find(l => l.id === leadId);
      if (lead) return lead;
    }
    return null;
  };

  const getFilteredLeadsForStage = (stageTitle) => {
    const stageLeads = leadsByStage[stageTitle] || [];
    
    if (filterStage === 'All' && !searchQuery) {
      return stageLeads;
    }

    return stageLeads.filter(lead => {
      const matchesFilter = filterStage === 'All' || lead.stage === filterStage;
      const matchesSearch = !searchQuery || 
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery);
      
      return matchesFilter && matchesSearch;
    });
  };

  const getActiveLead = () => {
    if (!activeId) return null;
    return findLeadById(activeId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-red-600">
          <p>Error loading pipeline: {error}</p>
          <button
            onClick={handleManualRefresh}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {dashboardType === 'admin' ? 'Admin Pipeline' : 
               dashboardType === 'partnership' ? 'Partnership Pipeline' : 
               'Pipeline'}
            </h2>
            <p className="text-gray-600 mt-1">
              Manage leads and track progress through your sales pipeline
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Add Lead Button */}
            {showAddLead && (
              <button
                onClick={() => setShowAddLeadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                <FiPlus className="w-4 h-4" />
                Add Lead
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={filterStage}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          >
            <option value="All">All Stages</option>
            {displayStages.map((stage) => (
              <option key={stage.title} value={stage.title}>
                {stage.title}
              </option>
            ))}
          </select>

          {/* Metrics Toggle */}
          {showMetrics && (
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              <FiTrendingUp className="w-4 h-4" />
              {showMetrics ? 'Hide' : 'Show'} Metrics
            </button>
          )}
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>

      {/* Pipeline Content */}
      <div className="p-6">
        {viewMode === 'kanban' ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[restrictToHorizontalAxis]}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayStages.map((stage) => (
                <KanbanColumn
                  key={stage.title}
                  stage={stage}
                  leads={getFilteredLeadsForStage(stage.title)}
                  onAddLead={handleAddLead}
                  onUpdateLead={handleUpdateLead}
                  isAdmin={isAdmin}
                  dashboardType={dashboardType}
                />
              ))}
            </div>

            <DragOverlay>
              {activeId ? (
                <KanbanCard
                  lead={getActiveLead()}
                  isDragging={true}
                  isAdmin={isAdmin}
                  dashboardType={dashboardType}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          /* List View */
          <div className="space-y-4">
            {displayStages.map((stage) => {
              const stageLeads = getFilteredLeadsForStage(stage.title);
              if (stageLeads.length === 0) return null;

              return (
                <div key={stage.title} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">{stage.title}</h3>
                    <p className="text-sm text-gray-600">{stageLeads.length} leads</p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {stageLeads.map((lead) => (
                      <div key={lead.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{lead.name}</h4>
                            <p className="text-sm text-gray-600">{lead.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{lead.status}</p>
                            <p className="text-xs text-gray-500">{lead.stage}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedPipelineSection; 