// 🧩 PipelineColumn.jsx
import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import PipelineCard from './PipelineCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-hot-toast';

const PipelineColumn = ({ stage, items, progress, lastUpdated, isOver, onAddLead }) => {
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    address: '',
    loanType: '',
    closeDate: '',
    loanAmount: '',
    currency: 'USD',
    status: 'On Track'
  });
  const highlight = isOver ? 'ring-2 ring-blue-400' : '';

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleModalSave = async () => {
    const { name, address, loanType, closeDate, loanAmount } = newLead;
    if (!name || !address || !loanType || !closeDate || !loanAmount) {
      toast.error('❌ Please fill all fields');
      return;
    }
    if (isNaN(loanAmount) || Number(loanAmount) <= 0) {
      toast.error('❌ Loan amount must be a positive number');
      return;
    }
    const { error } = await supabase.from('leads').insert([{ ...newLead, stage: stage.title }]);
    if (error) {
      console.error('Insert error:', error);
      toast.error('❌ Failed to add lead');
    } else {
      toast.success('✅ Lead added');
      onAddLead(stage.title, newLead);
    }
    setShowModal(false);
    setNewLead({ name: '', address: '', loanType: '', closeDate: '', loanAmount: '', currency: 'USD', status: 'On Track' });
  };

  return (
    <div
      className={`w-72 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-md snap-start border border-gray-200 dark:border-gray-700 transition-all duration-150 ${highlight}`}
    >
      {/* Stage Header */}
      <div className={`pipeline-header ${stage.color} text-sm font-semibold`}>
        <div className="flex justify-between items-center px-3 py-2">
          <motion.input
            className="text-xs font-bold bg-transparent focus:bg-white dark:focus:bg-gray-900 rounded px-1"
            defaultValue={stage.title}
            onBlur={(e) => console.log('Stage renamed to:', e.target.value)}
          />
          <span className="bg-white/20 rounded-full px-2 text-xs">{items.length}</span>
        </div>
      </div>

      {/* Add Button */}
      <div className="px-3 py-2">
        <button
          className="flex items-center text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
          onClick={handleAddClick}
        >
          <FiPlus className="mr-1" size={12} /> Add
        </button>
      </div>

      {/* Stage Content */}
      <div className="flex flex-col gap-4 p-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        <SortableContext items={items.map((c) => c.name)} strategy={verticalListSortingStrategy}>
          {items.map((card) => (
            <motion.div
              key={card.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PipelineCard {...card} onAddNew={() => onAddLead(stage.title)} />
            </motion.div>
          ))}
        </SortableContext>
      </div>

      {/* Stage Footer */}
      <div className="px-3 py-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
        </div>
        <p>{progress}% On Track</p>
        <p>🕒 Last update: {lastUpdated}</p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg w-72 space-y-2">
              <h3 className="text-sm font-semibold mb-2">Add New Lead</h3>
              {['name', 'address', 'loanType', 'closeDate', 'loanAmount'].map((field) => (
                <input
                  key={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-1 text-xs rounded bg-gray-100 dark:bg-gray-700"
                  value={newLead[field]}
                  onChange={(e) => setNewLead({ ...newLead, [field]: e.target.value })}
                />
              ))}
              <select
                value={newLead.currency}
                onChange={(e) => setNewLead({ ...newLead, currency: e.target.value })}
                className="w-full p-1 text-xs rounded bg-gray-100 dark:bg-gray-700"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="PHP">PHP</option>
              </select>
              <select
                value={newLead.status}
                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                className="w-full p-1 text-xs rounded bg-gray-100 dark:bg-gray-700"
              >
                <option value="On Track">On Track</option>
                <option value="Delayed">Delayed</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSave}
                  className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PipelineColumn;
