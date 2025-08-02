// ========================================
// 🎯 Partnership Dashboard KANBAN CARD COMPONENT
// ========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiEdit2, FiTrash2, FiClock, FiDollarSign, FiUser, FiTag, FiCalendar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const PartnerKanbanCard = ({ lead, index, onUpdate, isAdmin = false, isDragging = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lead.name || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id, data: { stage: lead.stage } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging || isSortableDragging ? 1000 : 1,
  };

  const handleSave = () => {
    if (editName.trim() && onUpdate) {
      onUpdate(lead.id, { name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onUpdate) {
      onUpdate(lead.id, { status: 'deleted' });
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.new;
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging || isSortableDragging ? 'shadow-xl scale-105 rotate-2' : ''
      }`}
      whileHover={{
        y: -3,
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
    >
      {/* Card Header */}
      <div className="p-2 lg:p-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-2">
          {isEditing ? (
            <div className="flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSave}
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">
                {lead.name || 'Unnamed Partner Lead'}
              </h4>
              {lead.partner && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Partner: {lead.partner}
                </p>
              )}
            </div>
          )}

          {isAdmin && !isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Edit partner lead"
              >
                <FiEdit2 size={12} className="text-gray-500" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Delete partner lead"
              >
                <FiTrash2 size={12} className="text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2 lg:p-3 space-y-2 lg:space-y-3">
        {/* Loan Amount */}
        {lead.loanAmount && (
          <div className="flex items-center gap-2">
            <FiDollarSign size={14} className="text-green-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              ${lead.loanAmount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Loan Type */}
        {lead.loanType && (
          <div className="flex items-center gap-2">
            <FiTag size={14} className="text-blue-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {lead.loanType}
            </span>
          </div>
        )}

        {/* Priority Badge */}
        {lead.priority && (
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
            {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)} Priority
          </div>
        )}

        {/* Status Badge */}
        {lead.status && (
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </div>
        )}

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {lead.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{lead.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Created Date */}
        {lead.createdAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiCalendar size={12} />
            <span>
              Created {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Last Activity */}
        {lead.lastActivity && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiClock size={12} />
            <span>
              Updated {formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true })}
            </span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      {lead.assignedTo && (
        <div className="px-2 lg:px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiUser size={12} className="text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Assigned to {lead.assignedTo}
            </span>
          </div>
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#01818E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-lg" />
    </motion.div>
  );
};

export default PartnerKanbanCard;
