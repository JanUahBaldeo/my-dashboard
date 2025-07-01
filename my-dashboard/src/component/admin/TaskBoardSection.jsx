import { useTheme } from '../../hooks/useTheme';
import TaskColumn from './TaskColumn';
import DocumentChecklist from './DocumentChecklist';

const TaskBoardSection = () => {
  const { darkMode } = useTheme();

  return (
    <section
      className={`space-y-10 rounded-xl p-6 shadow transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-[#0f172a] to-[#0d1a2f] text-white'
          : 'bg-white text-gray-800 border border-gray-200'
      }`}
    >
      {/* Section Title */}
      <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        📌 <span>Task Status & Documentation</span>
      </h2>

      {/* Task Columns */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <TaskColumn
          title="Due Today"
          color="red"
          items={[
            { title: 'Finalize contract', dueDate: '06/30/2024', statuses: ['Overdue'] },
            { title: 'Call supplier', dueDate: '06/30/2024', statuses: ['Pending'] },
            { title: 'Prepare pitch deck', dueDate: '06/30/2024', statuses: ['Pending'] },
          ]}
        />
        <TaskColumn
          title="Follow-up"
          color="yellow"
          items={[
            { title: 'Send reminder email', dueDate: '07/01/2024', statuses: ['Pending'] },
            { title: 'Review feedback', dueDate: '07/02/2024', statuses: ['On Track'] },
          ]}
        />
        <TaskColumn
          title="Pending"
          color="green"
          items={[
            { title: 'Schedule meeting', dueDate: '07/05/2024', statuses: ['On Track'] },
            { title: 'Upload assets', dueDate: '07/06/2024', statuses: ['Pending'] },
          ]}
        />
      </div>

      {/* Documentation Checklist */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🗂 <span>Documentation Checklist</span>
        </h3>
        <DocumentChecklist
          documents={[
            { status: 'REQUIRED', name: 'Document 1', date: '06/01/2024' },
            { status: 'REQUIRED', name: 'Document 2', date: '06/03/2024' },
            { status: 'RECEIVED', name: 'Document 3', date: '06/05/2024', checked: true },
            { status: 'PENDING', name: 'Document 4', date: '06/10/2024' },
          ]}
        />
      </div>
    </section>
  );
};

export default TaskBoardSection;
