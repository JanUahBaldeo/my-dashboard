// ========================================
// KANBAN COLUMN (Clean, Deduped)
// ========================================

import { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';
import { FiPlus, FiUsers, FiClock, FiTrendingUp } from 'react-icons/fi';

// ---- Static config (outside component to avoid re-creation) ---------------
const STAGE_ICON_MAP = {
  'New Lead': '👤',
  Contacted: '📞',
  'Application Started': '📝',
  'Pre-Approved': '✅',
  'In Underwriting': '🔍',
  Closed: '🎯',
};

const STAGE_COLOR_MAP = {
  'New Lead': 'bg-blue-500',
  Contacted: 'bg-yellow-500',
  'Application Started': 'bg-purple-500',
  'Pre-Approved': 'bg-green-500',
  'In Underwriting': 'bg-orange-500',
  Closed: 'bg-gray-500',
};

const DEFAULT_ICON = '📊';
const DEFAULT_COLOR = 'bg-[#01818E]';

const getUniqueId = (lead) => lead?.id || lead?._id || lead?.contactId || null;

const dedupeLeads = (list = []) => {
  const seen = new Set();
  const out = [];
  for (const lead of list) {
    const uid = getUniqueId(lead);
    if (!uid || seen.has(uid)) continue;
    seen.add(uid);
    out.push(lead);
  }
  return out;
};

const KanbanColumn = memo(function KanbanColumn({
  stage,
  leads = [],
  metrics = {},
  onAddLead,
  onUpdateLead,
  isAdmin,
}) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', loanAmount: '', loanType: 'Conventional' });

  const { setNodeRef, isOver } = useDroppable({
    id: stage.title,
    data: { stage: stage.title, type: 'column' },
  });

  // ---- Memoized derivations ----------------------------------------------
  const uniqueLeads = useMemo(() => dedupeLeads(leads), [leads]);

  const stageIcon = STAGE_ICON_MAP[stage.title] || DEFAULT_ICON;
  const stageColor = STAGE_COLOR_MAP[stage.title] || DEFAULT_COLOR;

  const columnMetrics = useMemo(
    () => ({
      totalLeads: leads.length,
      uniqueCount: uniqueLeads.length,
      avgTime: metrics.avgTime || '0:00',
      conversion: metrics.conversion || 0,
    }),
    [leads.length, uniqueLeads.length, metrics.avgTime, metrics.conversion],
  );

  // ---- Handlers -----------------------------------------------------------
  const handleInputChange = useCallback((field, value) => {
    setNewLeadData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddLead = useCallback(async () => {
    const name = newLeadData.name.trim();
    if (!name || !onAddLead) return;
    await onAddLead({ ...newLeadData, stage: stage.title });
    setNewLeadData({ name: '', loanAmount: '', loanType: 'Conventional' });
    setShowAddCard(false);
  }, [newLeadData, onAddLead, stage.title]);

  // ---- Render -------------------------------------------------------------
  return (
    <motion.div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 transition-all duration-200 ${isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      role="region"
      aria-label={`${stage.title} column`}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className={`px-4 py-3 ${stageColor} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden>
                {stageIcon}
              </span>
              <h3 className="font-semibold text-sm uppercase tracking-wide">{stage.title}</h3>
            </div>
            <span className="bg-white/20 rounded-full px-2 py-1 text-xs font-semibold" title="Unique leads">
              {columnMetrics.uniqueCount}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FiUsers className="w-3 h-3 text-gray-500" />
              </div>
              <div className="font-semibold text-gray-700">{columnMetrics.uniqueCount}</div>
              <div className="text-gray-500">Leads</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FiClock className="w-3 h-3 text-gray-500" />
              </div>
              <div className="font-semibold text-gray-700">{columnMetrics.avgTime}</div>
              <div className="text-gray-500">Avg Time</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FiTrendingUp className="w-3 h-3 text-gray-500" />
              </div>
              <div className="font-semibold text-gray-700">{columnMetrics.conversion}%</div>
              <div className="text-gray-500">Conversion</div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="p-3 space-y-3 max-h-96 overflow-y-auto min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {uniqueLeads.map((lead, index) => {
              const key = getUniqueId(lead) ?? `${stage.title}-${index}`;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02, duration: 0.15 }}
                  layout
                >
                  <KanbanCard lead={lead} stage={lead.stage || stage.title} onUpdate={onUpdateLead} />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Spacer for easy dropping at end */}
          <div className="min-h-[50px] w-full" />

          {/* Add Card */}
          {isAdmin && (
            <AnimatePresence mode="wait">
              {showAddCard ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <input
                    type="text"
                    placeholder="Lead name"
                    value={newLeadData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full mb-2 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Loan amount"
                    value={newLeadData.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    className="w-full mb-2 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                  />
                  <select
                    value={newLeadData.loanType}
                    onChange={(e) => handleInputChange('loanType', e.target.value)}
                    className="w-full mb-3 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                  >
                    <option value="Conventional">Conventional</option>
                    <option value="FHA">FHA</option>
                    <option value="VA">VA</option>
                    <option value="USDA">USDA</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddLead}
                      className="flex-1 px-3 py-1.5 bg-[#01818E] text-white text-sm rounded-md hover:bg-[#01818E]/90 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddCard(false)}
                      className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAddCard(true)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#01818E] hover:text-[#01818E] transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Lead
                </motion.button>
              )}
            </AnimatePresence>
          )}

          {/* Empty State */}
          {uniqueLeads.length === 0 && !showAddCard && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-400">
              <div className="text-2xl mb-2">📭</div>
              <div className="text-sm">No leads yet</div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default KanbanColumn;
