// ========================================
// KANBAN CARD (Clean, Professional)
// ========================================

import { useState, useEffect, useRef, memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FiUser, FiDollarSign, FiTag, FiMoreVertical, FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';
import ContactDetailsForm from './ContactDetailsForm';

// ---------- Helpers (module scope to avoid re-creation) --------------------
const LOAN_TYPE_CLASS = {
  Conventional: 'bg-blue-100 text-blue-800',
  FHA: 'bg-green-100 text-green-800',
  VA: 'bg-purple-100 text-purple-800',
  USDA: 'bg-orange-100 text-orange-800',
};

const PRIORITY_CLASS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const loanTypeClass = (type) => LOAN_TYPE_CLASS[type] || 'bg-gray-100 text-gray-800';
const priorityClass = (p) => PRIORITY_CLASS[p] || 'bg-gray-100 text-gray-800 border-gray-200';

// --------------------------------------------------------------------------
const KanbanCard = memo(function KanbanCard({ lead, stage, onUpdate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [editData, setEditData] = useState(() => ({
    name: lead?.name || '',
    loanAmount: lead?.loanAmount || '',
    loanType: lead?.loanType || 'Conventional',
  }));

  const menuRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead?.id,
    data: { lead, stage },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  // Close menu on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // ------- Handlers --------------------------------------------------------
  const resetEdit = () =>
    setEditData({ name: lead?.name || '', loanAmount: lead?.loanAmount || '', loanType: lead?.loanType || 'Conventional' });

  const handleSave = () => {
    onUpdate?.(lead?.id, editData);
    setEditing(false);
  };

  const handleCancel = () => {
    resetEdit();
    setEditing(false);
  };

  const TagList = ({ tags = [] }) => {
    if (!tags.length) return null;
    const shown = tags.slice(0, 2);
    const more = tags.length - shown.length;
    return (
      <div className="flex items-center gap-1">
        <FiTag className="w-3 h-3 text-gray-400" />
        <div className="flex flex-wrap gap-1">
          {shown.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[#01818E]/10 text-[#01818E] border border-[#01818E]/20">
              {tag}
            </span>
          ))}
          {more > 0 && <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">+{more}</span>}
        </div>
      </div>
    );
  };

  // ------- Drag Preview (lighter) -----------------------------------------
  if (isDragging) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72 opacity-50 select-none">
        <div className="flex items-center gap-2 mb-2">
          <FiUser className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-900 truncate">{lead?.name || 'Unknown Lead'}</span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {lead?.loanType || '—'} • {formatCurrency(lead?.loanAmount)}
        </div>
        <TagList tags={lead?.tags} />
      </div>
    );
  }

  // ------- Card ------------------------------------------------------------
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
      role="article"
      aria-label={`Lead card: ${lead?.name || 'Unknown Lead'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <FiUser className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {editing ? (
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData((s) => ({ ...s, name: e.target.value }))}
              className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#01818E]"
              placeholder="Lead name"
              aria-label="Lead name"
            />
          ) : (
            <span className="font-semibold text-gray-900 truncate">{lead?.name || 'Unknown Lead'}</span>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Card actions"
          >
            <FiMoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {menuOpen && (
            <div role="menu" className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiEdit2 className="w-3 h-3" />
                Edit Lead
              </button>
              <button
                type="button"
                onClick={() => {
                  setContactOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <FiUserPlus className="w-3 h-3" />
                Edit Contact
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FiTrash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        {editing ? (
          <div className="space-y-2">
            <select
              value={editData.loanType}
              onChange={(e) => setEditData((s) => ({ ...s, loanType: e.target.value }))}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
              aria-label="Loan type"
            >
              <option value="Conventional">Conventional</option>
              <option value="FHA">FHA</option>
              <option value="VA">VA</option>
              <option value="USDA">USDA</option>
            </select>
            <input
              type="number"
              placeholder="Loan amount"
              value={editData.loanAmount}
              onChange={(e) => setEditData((s) => ({ ...s, loanAmount: e.target.value }))}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
              aria-label="Loan amount"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 bg-[#01818E] text-white text-sm rounded-md hover:bg-[#01818E]/90 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiDollarSign className="w-3 h-3" />
              <span>{formatCurrency(lead?.loanAmount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${loanTypeClass(lead?.loanType)}`}>
                {lead?.loanType || '—'}
              </span>
              {lead?.priority && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityClass(lead.priority)}`}>
                  {lead.priority}
                </span>
              )}
            </div>
            <TagList tags={lead?.tags} />
            {lead?.updatedAt && (
              <div className="text-xs text-gray-400 mt-2">Updated {new Date(lead.updatedAt).toLocaleDateString()}</div>
            )}
          </>
        )}
      </div>

      {/* Contact Details */}
      <ContactDetailsForm
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        contactId={lead?.contactId || lead?.id}
        onSave={() => {}}
        mode="edit"
      />
    </div>
  );
});

export default KanbanCard;
