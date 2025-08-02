import { useState, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TaskContext } from '@context/TaskContext';
import Modal from '@ui/Modal';
import LOATaskManagement from './LOATaskManagement';
import LOADocumentManagement from './LOADocumentManagement';

const LOAManagementCenter = () => {
  const { addTask } = useContext(TaskContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'documents'

  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 500], [0, -50]);

  const handleCreate = (newTask) => {
    addTask("Today's Tasks", {
      ...newTask,
      id: Date.now(),
    });
  };

  // Sample task data matching image 1
  const tasks = [
    {
      id: 1,
      title: 'Follow up with Sarah Johnson',
      client: 'Sarah Johnson',
      loanNumber: 'LN-2024-001',
      type: 'call',
      priority: 'high',
      status: 'overdue',
      dueDate: '1/14/2024',
      completed: false,
    },
    {
      id: 2,
      title: 'Review Mike Chen application',
      client: 'Mike Chen',
      loanNumber: 'LN-2024-002',
      type: 'document',
      priority: 'medium',
      status: 'pending',
      dueDate: '1/15/2024',
      completed: false,
    },
    {
      id: 3,
      title: 'Send welcome email to Lisa Wong',
      client: 'Lisa Wong',
      loanNumber: 'LN-2024-003',
      type: 'email',
      priority: 'low',
      status: 'pending',
      dueDate: '1/16/2024',
      completed: false,
    },
    {
      id: 4,
      title: 'Schedule David Smith closing',
      client: 'David Smith',
      loanNumber: 'LN-2024-004',
      type: 'meeting',
      priority: 'high',
      status: 'pending',
      dueDate: '1/17/2024',
      completed: false,
    },
    {
      id: 5,
      title: 'Update Jennifer Davis file',
      client: 'Jennifer Davis',
      loanNumber: 'LN-2024-005',
      type: 'document',
      priority: 'medium',
      status: 'completed',
      dueDate: '1/18/2024',
      completed: true,
    },
  ];

  // Sample document data matching image 2
  const documents = [
    {
      id: 1,
      type: 'Employment Letter',
      client: 'David Smith',
      loanNumber: 'LN-2024-004',
      status: 'expired',
      dueDate: '1/9/2024',
      action: 'resubmit',
    },
    {
      id: 2,
      type: 'Property Appraisal',
      client: 'Lisa Wong',
      loanNumber: 'LN-2024-003',
      status: 'reviewed',
      dueDate: '1/14/2024',
      fileSize: '1.8 MB',
      uploadInfo: 'Uploaded: 1/11/2024 • Reviewed by: Sarah Wilson',
      action: 'view',
    },
    {
      id: 3,
      type: 'Bank Statements',
      client: 'Mike Chen',
      loanNumber: 'LN-2024-002',
      status: 'received',
      dueDate: '1/17/2024',
      fileSize: '2.4 MB',
      uploadInfo: 'Uploaded: 1/13/2024 • Reviewed by: John Smith',
      action: 'review',
    },
    {
      id: 4,
      type: 'Tax Returns',
      client: 'Jennifer Davis',
      loanNumber: 'LN-2024-005',
      status: 'received',
      dueDate: '1/18/2024',
      fileSize: '3.1 MB',
      uploadInfo: 'Uploaded: 1/12/2024',
      action: 'review',
    },
    {
      id: 5,
      type: 'Income Verification',
      client: 'Sarah Johnson',
      loanNumber: 'LN-2024-001',
      status: 'pending',
      dueDate: '1/19/2024',
      overdue: true,
      action: 'request',
    },
  ];

  return (
    <motion.section
      className="relative space-y-6 px-0 pt-0 pb-0 m-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Enhanced Section Header */}
        <div className="bg-gradient-to-r from-[#01818E] to-cyan-600 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <span className="text-3xl">📋</span>
              <div>
                <h2 className="text-2xl font-bold">
                  LOA Management Center
                </h2>
                <p className="text-sm opacity-90">
                  Comprehensive loan processing task and document management
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-white text-[#01818E] font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Task Management
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'documents'
                    ? 'bg-white text-[#01818E] font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Document Management
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'tasks' ? (
              <LOATaskManagement
                tasks={tasks}
                onTaskClick={(task) => {
                  setSelectedTask(task);
                  setModalOpen(true);
                }}
              />
            ) : (
              <LOADocumentManagement documents={documents} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          task={selectedTask}
          onClose={() => {
            setModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={(task) => {
            handleCreate(task);
          }}
        />
      )}
    </motion.section>
  );
};

export default LOAManagementCenter;
