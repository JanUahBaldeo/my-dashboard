import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Filter,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Phone,
  FileText,
  Mail,
  User,
  Upload,
  Eye,
} from 'lucide-react';

import Modal from '@shared/components/ui/Modal';

// ------------------------------------------------------------
// 🎯 LOA Unified Task Manager (Minimal • Clean • JS only)
// - Subtle borders, generous whitespace, fewer colors
// - Consistent badges & list items
// - Extracted small UI helpers for clarity
// - No TypeScript
// ------------------------------------------------------------

const badgeVariations = {
  gray: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
  red: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  green: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
};

function Badge({ tone = 'gray', children }) {
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${badgeVariations[tone] || badgeVariations.gray}`}>
      {children}
    </span>
  );
}

function SoftButton({ icon: Icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 active:bg-gray-100"
    >
      {Icon ? <Icon className="h-4 w-4 text-gray-600" /> : null}
      {children}
    </button>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {Icon ? <Icon className="h-6 w-6 text-gray-400" /> : null}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

// ----------------------- TASKS -----------------------
function TaskManagement({ tasks = [], onCreate, onOpen }) {
  const counts = useMemo(() => ({
    overdue: tasks.filter(t => t.status === 'overdue').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    total: tasks.length,
  }), [tasks]);

  const [filters, setFilters] = useState({ status: 'All', priority: 'All', type: 'All' });

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filters.status !== 'All' && t.status !== filters.status.toLowerCase()) return false;
      if (filters.priority !== 'All' && t.priority !== filters.priority.toLowerCase()) return false;
      if (filters.type !== 'All' && t.type !== filters.type.toLowerCase()) return false;
      return true;
    });
  }, [tasks, filters]);

  const taskIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4 text-gray-500" />;
      case 'document': return <FileText className="h-4 w-4 text-gray-500" />;
      case 'email': return <Mail className="h-4 w-4 text-gray-500" />;
      case 'meeting': return <User className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const priorityTone = (p) => (p === 'high' ? 'red' : p === 'medium' ? 'yellow' : p === 'low' ? 'green' : 'gray');
  const statusTone = (s) => (s === 'overdue' ? 'red' : s === 'pending' ? 'blue' : s === 'completed' ? 'green' : 'gray');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <SectionHeader
        title="Task Management"
        subtitle="Track loan processing tasks and deadlines"
        right={
          <SoftButton icon={Plus} onClick={onCreate}>New Task</SoftButton>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 border-b border-gray-200 p-6 md:grid-cols-4">
        <StatCard label="Overdue" value={counts.overdue} icon={AlertTriangle} />
        <StatCard label="Pending" value={counts.pending} icon={Clock} />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle} />
        <StatCard label="Total" value={counts.total} icon={Users} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-4">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          {['All', 'Pending', 'Completed', 'Overdue'].map(o => <option key={o}>{o}</option>)}
        </select>
        <select
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
        >
          {['All', 'High', 'Medium', 'Low'].map(o => <option key={o}>{o}</option>)}
        </select>
        <select
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        >
          {['All', 'Call', 'Document', 'Email', 'Meeting'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* List */}
      <ul className="divide-y divide-gray-100">
        {filtered.map((task, i) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60"
          >
            <input type="checkbox" checked={!!task.completed} readOnly className="h-4 w-4 rounded border-gray-300 text-gray-900" />

            {taskIcon(task.type)}

            <button onClick={() => onOpen(task)} className="flex-1 text-left">
              <p className="font-medium text-gray-900">{task.title}</p>
              <p className="mt-0.5 text-sm text-gray-500">Client: {task.client} • Loan: {task.loanNumber}</p>
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
              <Badge tone={statusTone(task.status)}>{task.status}</Badge>
            </div>

            <time className="text-sm text-gray-500">Due: {task.dueDate}</time>
          </motion.li>
        ))}
        {filtered.length === 0 && (
          <li className="px-6 py-10 text-center text-sm text-gray-500">No tasks match the current filters.</li>
        )}
      </ul>
    </div>
  );
}

// ----------------------- DOCUMENTS -----------------------
function DocumentManagement({ documents = [], onUpload }) {
  const counts = useMemo(() => ({
    pending: documents.filter(d => d.status === 'pending').length,
    received: documents.filter(d => d.status === 'received').length,
    reviewed: documents.filter(d => d.status === 'reviewed').length,
    expired: documents.filter(d => d.status === 'expired').length,
  }), [documents]);

  const [filters, setFilters] = useState({ status: 'All', type: 'All', sort: 'Due Date' });

  const filtered = useMemo(() => {
    let list = documents.filter(d => {
      if (filters.status !== 'All' && d.status !== filters.status.toLowerCase()) return false;
      if (filters.type !== 'All' && d.type !== filters.type) return false;
      return true;
    });

    if (filters.sort === 'Due Date') {
      list = [...list].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    if (filters.sort === 'Upload Date' && documents.some(d => d.uploadInfo)) {
      // naive parse of `Uploaded: mm/dd/yyyy` if present
      const getUpload = (s = '') => {
        const m = s.match(/Uploaded:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
        return m ? new Date(m[1]) : new Date(0);
      };
      list = [...list].sort((a, b) => getUpload(a.uploadInfo) - getUpload(b.uploadInfo));
    }
    return list;
  }, [documents, filters]);

  const statusTone = (s) => (s === 'expired' ? 'red' : s === 'reviewed' ? 'green' : s === 'received' ? 'blue' : s === 'pending' ? 'yellow' : 'gray');

  const statusIcon = (s) => {
    switch (s) {
      case 'expired': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'reviewed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'received': return <Upload className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <SectionHeader
        title="Document Management"
        subtitle="Track loan documents and their status"
        right={<SoftButton icon={Upload} onClick={onUpload}>Upload</SoftButton>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 border-b border-gray-200 p-6 md:grid-cols-4">
        <StatCard label="Pending" value={counts.pending} icon={Clock} />
        <StatCard label="Received" value={counts.received} icon={Upload} />
        <StatCard label="Reviewed" value={counts.reviewed} icon={CheckCircle} />
        <StatCard label="Expired" value={counts.expired} icon={AlertTriangle} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-4">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          {['All', 'Pending', 'Received', 'Reviewed', 'Expired'].map(o => <option key={o}>{o}</option>)}
        </select>
        <select
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        >
          {['All', 'Employment Letter', 'Property Appraisal', 'Bank Statements', 'Tax Returns', 'Income Verification'].map(o => <option key={o}>{o}</option>)}
        </select>
        <select
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
        >
          {['Due Date', 'Upload Date'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* List */}
      <ul className="divide-y divide-gray-100">
        {filtered.map((doc, i) => (
          <motion.li
            key={doc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60"
          >
            {statusIcon(doc.status)}

            <div className="flex-1">
              <p className="font-medium text-gray-900">{doc.type}</p>
              <p className="mt-0.5 text-sm text-gray-500">{doc.client}, document ID {doc.loanNumber}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                Due: {doc.dueDate}
                {doc.fileSize ? ` • ${doc.fileSize}` : ''}
                {doc.uploadInfo ? ` • ${doc.uploadInfo}` : ''}
              </p>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <Badge tone={statusTone(doc.status)}>{doc.status}</Badge>
              {doc.overdue ? <Badge tone="red">Overdue</Badge> : null}
            </div>

            <SoftButton icon={Eye} onClick={() => { /* hook up view/review/request as needed */ }}>
              {doc.action ? doc.action.charAt(0).toUpperCase() + doc.action.slice(1) : 'Open'}
            </SoftButton>
          </motion.li>
        ))}
        {filtered.length === 0 && (
          <li className="px-6 py-10 text-center text-sm text-gray-500">No documents match the current filters.</li>
        )}
      </ul>
    </div>
  );
}

// ----------------------- WRAPPER -----------------------
export default function LOAUnifiedTaskManager() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'documents'
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Sample data (replace with real data wiring)
  const tasks = [
    { id: 1, title: 'Follow up with Sarah Johnson', client: 'Sarah Johnson', loanNumber: 'LN-2024-001', type: 'call', priority: 'high', status: 'overdue', dueDate: '1/14/2024', completed: false },
    { id: 2, title: 'Review Mike Chen application', client: 'Mike Chen', loanNumber: 'LN-2024-002', type: 'document', priority: 'medium', status: 'pending', dueDate: '1/15/2024', completed: false },
    { id: 3, title: 'Send welcome email to Lisa Wong', client: 'Lisa Wong', loanNumber: 'LN-2024-003', type: 'email', priority: 'low', status: 'pending', dueDate: '1/16/2024', completed: false },
    { id: 4, title: 'Schedule David Smith closing', client: 'David Smith', loanNumber: 'LN-2024-004', type: 'meeting', priority: 'high', status: 'pending', dueDate: '1/17/2024', completed: false },
    { id: 5, title: 'Update Jennifer Davis file', client: 'Jennifer Davis', loanNumber: 'LN-2024-005', type: 'document', priority: 'medium', status: 'completed', dueDate: '1/18/2024', completed: true },
  ];

  const documents = [
    { id: 1, type: 'Employment Letter', client: 'David Smith', loanNumber: 'LN-2024-004', status: 'expired', dueDate: '1/9/2024', action: 'resubmit' },
    { id: 2, type: 'Property Appraisal', client: 'Lisa Wong', loanNumber: 'LN-2024-003', status: 'reviewed', dueDate: '1/14/2024', fileSize: '1.8 MB', uploadInfo: 'Uploaded: 1/11/2024 • Reviewed by: Sarah Wilson', action: 'view' },
    { id: 3, type: 'Bank Statements', client: 'Mike Chen', loanNumber: 'LN-2024-002', status: 'received', dueDate: '1/17/2024', fileSize: '2.4 MB', uploadInfo: 'Uploaded: 1/13/2024 • Reviewed by: John Smith', action: 'review' },
    { id: 4, type: 'Tax Returns', client: 'Jennifer Davis', loanNumber: 'LN-2024-005', status: 'received', dueDate: '1/18/2024', fileSize: '3.1 MB', uploadInfo: 'Uploaded: 1/12/2024', action: 'review' },
    { id: 5, type: 'Income Verification', client: 'Sarah Johnson', loanNumber: 'LN-2024-001', status: 'pending', dueDate: '1/19/2024', overdue: true, action: 'request' },
  ];

  return (
    <section className="space-y-6">
      {/* Header / Tabs */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">LOA Management Center</h1>
            <p className="mt-0.5 text-sm text-gray-500">Unified tasks and documents for loan processing</p>
          </div>
          <div className="flex items-center rounded-lg bg-gray-100 p-1">
            {['tasks', 'documents'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'tasks' ? 'Task Management' : 'Document Management'}
              </button>
            ))}
          </div>
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-6">
          {activeTab === 'tasks' ? (
            <TaskManagement
              tasks={tasks}
              onCreate={() => { setSelectedTask(null); setModalOpen(true); }}
              onOpen={(task) => { setSelectedTask(task); setModalOpen(true); }}
            />
          ) : (
            <DocumentManagement
              documents={documents}
              onUpload={() => { /* wire up uploader */ }}
            />
          )}
        </motion.div>
      </div>

      {/* Modal (Create/Edit Task) */}
      <Modal
        isOpen={modalOpen}
        task={selectedTask}
        onClose={() => { setModalOpen(false); setSelectedTask(null); }}
        mode={selectedTask ? 'edit' : 'create'}
      />
    </section>
  );
}
