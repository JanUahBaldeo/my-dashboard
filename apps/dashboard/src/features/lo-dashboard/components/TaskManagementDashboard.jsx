// ========================================
// 🎯 TASK MANAGEMENT DASHBOARD — CLEAN VERSION (DEDUPED & POLISHED)
// ========================================

import { useMemo, useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { TaskContext } from '@context/TaskContext';
import Modal from '@shared/components/ui/Modal';
import { StatCard, SectionHeader, SearchInput } from '@shared/components/ui';
import { FiClock, FiCheckCircle, FiCalendar, FiUser, FiTarget, FiMail, FiFile, FiEdit3, FiTrash2, FiMoreVertical, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// ===== Constants / Helpers
const STATUS = { COMPLETED: 'completed', PENDING: 'pending', OVERDUE: 'overdue', IN_PROGRESS: 'in progress', CANCELLED: 'cancelled' };
const FILTER_OPTIONS = {
  status: ['All Status', 'Pending', 'Completed', 'Overdue', 'Cancelled'],
  priority: ['All Priority', 'High', 'Medium', 'Low'],
  type: ['All Types', 'Sales', 'Communication', 'General'],
};

const toLower = (v) => (typeof v === 'string' ? v.toLowerCase() : '');
const normalizeTask = (t) => ({
  ...t,
  title: t?.title?.trim() || 'Untitled',
  description: t?.description?.trim() || '',
  contactName: t?.contactName?.trim() || '',
  id: t?.id || t?._id || String(Math.random()),
  _id: t?._id || t?.id,
});
const parseDateSafe = (t) => {
  const raw = t?.dueDate ?? t?.date;
  if (!raw) return null;
  const d = raw instanceof Date ? raw : new Date(raw);
  return Number.isNaN(+d) ? null : d;
};
const formatDate = (t) => parseDateSafe(t)?.toLocaleDateString() || 'No due date';
const getStatus = (t) => {
  const cat = toLower(t.statusCategory);
  const s = toLower(t.status);
  if (cat === 'success' || s === 'completed') return STATUS.COMPLETED;
  if (cat === 'warning' || s === 'in progress') return STATUS.IN_PROGRESS;
  if (cat === 'error' || s === 'overdue') return STATUS.OVERDUE;
  if (cat === 'neutral' || s === 'cancelled') return STATUS.CANCELLED;
  return STATUS.PENDING;
};
const isCompleted = (t) => t?.completed || getStatus(t) === STATUS.COMPLETED;
const getStatusLabel = (t) => getStatus(t).replace(/^./, (c) => c.toUpperCase());

const priorityRank = (p) => ({ high: 0, medium: 1, low: 2 }[toLower(p)] ?? 3);

const badgeClass = {
  priority: (p) => (
    {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      low: 'bg-green-50 text-green-700 border-green-200',
    }[toLower(p)] || 'bg-gray-50 text-gray-700 border-gray-200'
  ),
  status: (t) => (
    {
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: 'bg-blue-50 text-blue-700 border-blue-200',
      overdue: 'bg-red-50 text-red-700 border-red-200',
      'in progress': 'bg-orange-50 text-orange-700 border-orange-200',
      cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
    }[getStatus(t)]
  ),
};

const StatusIcon = ({ s }) => (
  s === 'completed' ? (
    <FiCheckCircle className="w-4 h-4 text-emerald-500" />
  ) : (
    <FiClock className={`w-4 h-4 ${s === 'pending' ? 'text-blue-500' : 'text-gray-500'}`} />
  )
);
const TypeIcon = ({ t }) => (
  {
    calls: <FiUser className="w-4 h-4 text-purple-500" />,
    emails: <FiMail className="w-4 h-4 text-indigo-500" />,
    documents: <FiFile className="w-4 h-4 text-orange-500" />,
  }[toLower(t)] || <FiTarget className="w-4 h-4 text-gray-500" />
);

// ===== Reusable UI
const FilterSelect = ({ value, onChange, options, label }) => (
  <select
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#01818E]/10 focus:border-[#01818E] bg-white"
  >
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

const Pagination = ({ current, total, onPrev, onNext, onJump }) =>
  total > 1 && (
    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-xl">
      <span className="text-sm text-gray-600">Page {current} of {total}</span>
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={current === 1} className="px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-50">
          <FiChevronLeft className="inline mr-1"/>
          Prev
        </button>
        {Array.from({ length: Math.min(5, total) }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onJump(n)}
            className={`px-3 py-2 text-sm rounded-lg ${current === n ? 'bg-[#01818E] text-white' : 'bg-white border'}`}
          >
            {n}
          </button>
        ))}
        <button onClick={onNext} disabled={current === total} className="px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-50">
          Next
          <FiChevronRight className="inline ml-1"/>
        </button>
      </div>
    </div>
  );

const TaskRow = ({ t, i, onToggle, onEdit, onDelete }) => (
  <motion.div
    key={t.id}
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 12 }}
    transition={{ delay: i * 0.04 }}
    className="px-5 py-4 border-b last:border-0 hover:bg-gray-50/80"
  >
    <div className="flex gap-4">
      <input
        type="checkbox"
        checked={isCompleted(t)}
        onChange={() => onToggle(t)}
        className="h-5 w-5 text-[#01818E] rounded-md focus:ring-[#01818E]"
      />
      <div className="flex-1">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <h4 className={`font-semibold truncate ${isCompleted(t) ? 'line-through text-gray-500' : 'text-gray-900'}`}>{t.title}</h4>
            {t.description && (
              <p className={`text-sm truncate ${isCompleted(t) ? 'line-through text-gray-400' : 'text-gray-600'}`}>{t.description}</p>
            )}
          </div>
          <div className="flex gap-2 text-gray-500 shrink-0">
            <button onClick={() => onEdit(t)} title="Edit" className="p-2 hover:text-gray-700">
              <FiEdit3 />
            </button>
            <button onClick={() => onDelete(t)} title="Delete" className="p-2 hover:text-red-600">
              <FiTrash2 />
            </button>
            <button title="More" className="p-2 hover:text-gray-700">
              <FiMoreVertical />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm">
          {t.contactName && (
            <div className="flex items-center gap-2 text-blue-700/80">
              <FiUser /> {t.contactName}
            </div>
          )}
          <div className="flex items-center gap-2 text-emerald-700/80">
            <FiCalendar /> {t.id?.substring(0, 20)}
          </div>
          {(t.dueDate || t.date) && (
            <div className="flex items-center gap-2 text-orange-700/80">
              <FiClock /> {formatDate(t)}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${badgeClass.priority(t.priority)}`}>
            {t.priority || '—'}
          </span>
          <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${badgeClass.status(t)}`}>
            {getStatusLabel(t)}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// ===== Main
const TaskManagementDashboard = () => {
  const { tasksByCategory, completeTask, deleteTask } = useContext(TaskContext);

  // --- Build & Dedupe ---
  // 1) Normalize tasks
  const rawTasks = useMemo(
    () => (tasksByCategory?.['All Tasks']?.items || []).map(normalizeTask),
    [tasksByCategory],
  );

  // 2) Create a stable dedupe key: prefer id/_id; otherwise title|contact|yyyy-mm-dd
  const allTasks = useMemo(() => {
    const map = new Map();
    for (const t of rawTasks) {
      const dateIso = parseDateSafe(t)?.toISOString()?.slice(0, 10) || '';
      const fallbackKey = `${t.title.toLowerCase()}|${t.contactName.toLowerCase()}|${dateIso}`;
      const key = t._id || t.id || fallbackKey;

      if (!map.has(key)) {
        map.set(key, t);
      } else {
        // Merge duplicates deterministically.
        const prev = map.get(key);
        // Prefer: completed > not, newer date > older, higher priority > lower
        const prevDate = parseDateSafe(prev);
        const currDate = parseDateSafe(t);
        const score = (x) => (
          (isCompleted(x) ? 1000 : 0) +
          (x.priority ? (10 - priorityRank(x.priority)) * 10 : 0) +
          (parseDateSafe(x) ? (parseDateSafe(x).getTime() / 1e8) : 0)
        );
        map.set(score(t) >= score(prev) ? t : prev);
      }
    }
    return Array.from(map.values());
  }, [rawTasks]);

  // --- Filters + pagination ---
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // --- Stats ---
  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter(isCompleted).length;
    const now = new Date();
    const overdue = allTasks.filter((t) => {
      const d = parseDateSafe(t);
      return d && d < now && !isCompleted(t);
    }).length;
    return { total, completed, overdue, pending: Math.max(total - completed - overdue, 0) };
  }, [allTasks]);

  // --- Filtering ---
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const typeVal = toLower(typeFilter);
    return allTasks
      .filter((t) => {
        const matchesText = !q || [t.title, t.description, t.contactName].some((f) => f?.toLowerCase().includes(q));
        const matchesStatus = statusFilter === 'All Status' || getStatusLabel(t).toLowerCase() === toLower(statusFilter);
        const matchesPriority = priorityFilter === 'All Priority' || toLower(t.priority) === toLower(priorityFilter);
        const matchesType = typeFilter === 'All Types' || [toLower(t.category), toLower(t.type)].includes(typeVal);
        return matchesText && matchesStatus && matchesPriority && matchesType;
      })
      // Stable sort: due date asc (nulls last), then priority, then title
      .sort((a, b) => {
        const da = parseDateSafe(a);
        const db = parseDateSafe(b);
        if (da && db) {
          if (da.getTime() !== db.getTime()) return da.getTime() - db.getTime();
        } else if (da || db) {
          return da ? -1 : 1;
        }
        const pr = priorityRank(a.priority) - priorityRank(b.priority);
        if (pr !== 0) return pr;
        return a.title.localeCompare(b.title);
      });
  }, [allTasks, searchQuery, statusFilter, priorityFilter, typeFilter]);

  // --- Pagination slices ---
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentTasks = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, priorityFilter, typeFilter]);

  // --- Actions ---
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const handleEdit = (t) => { setSelectedTask(t); setModalOpen(true); };
  const handleDelete = async (t) => {
    if (window.confirm(`Delete ${t.title}?`)) {
      const res = await deleteTask(t.id);
      res?.success ? toast.success('Deleted!') : toast.error('Failed');
    }
  };
  const handleToggle = async (t) => {
    const res = await completeTask(t.id, !isCompleted(t));
    res?.success ? toast.success('Updated!') : toast.error('Failed');
  };

  return (
    <div className="w-full bg-gray-50">
      <SectionHeader
        title="Task Management"
        description="Organize and track activities"
        buttonText="Create Task"
        onButtonClick={() => setModalOpen(true)}
      >
        <div className="flex flex-wrap gap-3">
          <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 min-w-[220px]" />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={FILTER_OPTIONS.status} label="Status" />
          <FilterSelect value={priorityFilter} onChange={setPriorityFilter} options={FILTER_OPTIONS.priority} label="Priority" />
          <FilterSelect value={typeFilter} onChange={setTypeFilter} options={FILTER_OPTIONS.type} label="Type" />
        </div>
      </SectionHeader>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {['overdue', 'pending', 'completed', 'total'].map((k, i) => (
            <StatCard key={k} type={k} title={k[0].toUpperCase() + k.slice(1)} value={stats[k]} delay={i * 0.1} />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="max-h-[520px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {currentTasks.map((t, i) => (
                <TaskRow key={t.id} t={t} i={i} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
            {!currentTasks.length && <div className="p-10 text-center text-gray-500">No tasks found</div>}
          </div>
          <Pagination
            current={currentPage}
            total={pageCount}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
            onJump={setCurrentPage}
          />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} task={selectedTask} mode={selectedTask ? 'edit' : 'create'} />
    </div>
  );
};

export default TaskManagementDashboard;
