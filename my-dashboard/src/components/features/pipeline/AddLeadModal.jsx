import { motion, AnimatePresence } from 'framer-motion';

const AddLeadModal = ({
  showAddLeadModal,
  setShowAddLeadModal,
  filteredStages,
}) => {
  return (
    <AnimatePresence>
      {showAddLeadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Add New Lead
              </h3>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Name
                </label>
                <input
                  type="text"
                  placeholder="Enter lead name"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pipeline Stage
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                >
                  {filteredStages.map((stage) => (
                    <option key={stage.title} value={stage.title}>
                      {stage.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter loan amount"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle add lead logic
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
  );
};

export default AddLeadModal;
