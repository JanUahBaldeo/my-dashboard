// ========================================
// 🎯 LOADashboard ENHANCED UNIFIED TASK MANAGER COMPONENT
// ========================================

import { useState } from 'react';
import { Plus, Filter, Clock, Users, CheckCircle, AlertTriangle, Phone, FileText, Mail, User, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

import Modal from '@shared/components/ui/Modal';

// Task Management Dashboard Component (Image 1)
const TaskManagementDashboard = ({ tasks = [], onTaskClick }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const stats = [
    { label: 'Overdue Tasks', value: '1', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'Pending Tasks', value: '3', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Completed', value: '1', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Total Tasks', value: '5', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="w-5 h-5 text-gray-600" />;
      case 'document': return <FileText className="w-5 h-5 text-gray-600" />;
      case 'email': return <Mail className="w-5 h-5 text-gray-600" />;
      case 'meeting': return <User className="w-5 h-5 text-gray-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return 'bg-red-500 text-white';
      case 'pending': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
            <p className="text-sm text-gray-600 mt-1">Track loan processing tasks and deadlines</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              setSelectedTask(null);
              setModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Overdue</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Types</option>
            <option>Call</option>
            <option>Document</option>
            <option>Email</option>
            <option>Meeting</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6">
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onTaskClick(task)}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />

              {/* Task Icon */}
              {getTaskIcon(task.type)}

              {/* Task Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600">
                  Client: {task.client} • Loan: {task.loanNumber}
                </p>
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
            </div>

              {/* Due Date */}
              <div className="text-sm text-gray-500">
                Due: {task.dueDate}
              </div>
            </motion.div>
          ))}
            </div>
          </div>
    </div>
  );
};

// Document Management System Component (Image 2)
const DocumentManagementSystem = ({ documents = [] }) => {
  const stats = [
    { label: 'Pending', value: '1', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Received', value: '2', icon: Upload, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Reviewed', value: '1', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Expired', value: '1', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'reviewed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'received': return <Upload className="w-5 h-5 text-blue-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-500 text-white';
      case 'reviewed': return 'bg-green-500 text-white';
      case 'received': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getActionButton = (status, action) => {
    switch (action) {
      case 'resubmit': return <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Resubmit</span>;
      case 'view': return <span className="text-blue-600 hover:text-blue-800 cursor-pointer">View</span>;
      case 'review': return (
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Review</span>
        </div>
      );
      case 'request': return <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Request</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Document Management</h1>
            <p className="text-sm text-gray-600 mt-1">Track loan documents and their status</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
          </div>
        </motion.div>
      ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pending</option>
            <option>Received</option>
            <option>Reviewed</option>
            <option>Expired</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Types</option>
            <option>Employment Letter</option>
            <option>Property Appraisal</option>
            <option>Bank Statements</option>
            <option>Tax Returns</option>
            <option>Income Verification</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Sort by Due Date</option>
            <option>Sort by Upload Date</option>
            <option>Sort by Document Type</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      <div className="p-6">
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Status Icon */}
              {getStatusIcon(doc.status)}

              {/* Document Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{doc.type}</h3>
                <p className="text-sm text-gray-600">
                  {doc.client}, document ID {doc.loanNumber}
                </p>
                {doc.fileSize && (
                  <p className="text-sm text-gray-500">
                    Due: {doc.dueDate} • {doc.fileSize}
                  </p>
                )}
                {doc.uploadInfo && (
                  <p className="text-sm text-gray-500">
                    {doc.uploadInfo}
                  </p>
                )}
              </div>

              {/* Status Tags */}
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(doc.status)}`}>
                  {doc.status}
                </span>
                {doc.overdue && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                    Overdue
                  </span>
                )}
              </div>

              {/* Action Button */}
              <div className="text-sm">
                {getActionButton(doc.status, doc.action)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LOAUnifiedTaskManager = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'documents'


  // Removed unused useScroll, useTransform, and handleCreate for lint compliance

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
              <TaskManagementDashboard
                tasks={tasks}
                onTaskClick={(task) => {
                  setSelectedTask(task);
                  setModalOpen(true);
                }}
              />
            ) : (
              <DocumentManagementSystem documents={documents} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal */}
        <Modal
          isOpen={modalOpen}
          task={selectedTask}
          onClose={() => {
            setModalOpen(false);
            setSelectedTask(null);
          }}
          mode={selectedTask ? 'edit' : 'create'}
        />
    </motion.section>
  );
};

export default LOAUnifiedTaskManager;
