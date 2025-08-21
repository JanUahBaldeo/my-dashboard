// ========================================
// 🎯 Partnership Dashboard KANBAN COLUMN COMPONENT
// ========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FiPlus, FiMoreVertical, FiTrendingUp, FiClock, FiDollarSign } from 'react-icons/fi';
import PartnerKanbanCard from './PartnerKanbanCard';

const PartnerKanbanColumn = ({
  stage,
  leads = [],
  metrics = {},
  onAddLead,
  onUpdateLead,
  isAdmin = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');

  const { setNodeRef } = useDroppable({
    id: stage.title,
  });

  const handleAddLead = (e) => {
    e.preventDefault();
    if (newLeadName.trim() && onAddLead) {
      onAddLead({
        id: Date.now().toString(),
        name: newLeadName.trim(),
        stage: stage.title,
        createdAt: new Date().toISOString(),
        loanAmount: 0,
        tags: [],
        status: 'new',
      });
      setNewLeadName('');
      setShowAddForm(false);
    }
  };

  const getStageColor = (stageTitle) => {
    const colors = {
      'New': 'bg-blue-50 border-blue-200 text-blue-700',
      'Qualified': 'bg-green-50 border-green-200 text-green-700',
      'Proposal': 'bg-yellow-50 border-yellow-200 text-yellow-700',
      'Negotiation': 'bg-purple-50 border-purple-200 text-purple-700',
      'Closed': 'bg-gray-50 border-gray-200 text-gray-700',
      'Lost': 'bg-red-50 border-red-200 text-red-700',
    };
    return colors[stageTitle] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-shrink-0 w-72 lg:w-80 xl:w-96"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden h-full">
        {/* Column Header */}
        <div className="p-3 lg:p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStageColor(stage.title).split(' ')[0]}`}></div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm lg:text-base">
                {stage.title}
              </h3>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                {leads.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <FiMoreVertical size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Stage Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {metrics.count || 0}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Leads</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {metrics.conversionRate || 0}%
              </div>
              <div className="text-gray-500 dark:text-gray-400">Conv.</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                ${(metrics.totalValue || 0).toLocaleString()}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Value</div>
            </div>
          </div>
        </div>

        {/* Column Content */}
        <div className="p-2 flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
          <SortableContext items={leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef} className="space-y-2 min-h-[200px]">
              <AnimatePresence>
                {leads.map((lead, index) => (
                  <PartnerKanbanCard
                    key={lead.id}
                    lead={lead}
                    index={index}
                    onUpdate={onUpdateLead}
                    isAdmin={isAdmin}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>

          {/* Add Lead Button */}
          {isAdmin && (
            <div className="mt-3">
              {showAddForm ? (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddLead}
                  className="space-y-2"
                >
                  <input
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="Enter partner lead name..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-1.5 text-xs bg-[#01818E] text-white rounded-lg hover:bg-[#01818E]/90 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewLeadName('');
                      }}
                      className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center gap-2"
                >
                  <FiPlus size={14} />
                  Add Partner Lead
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PartnerKanbanColumn;
