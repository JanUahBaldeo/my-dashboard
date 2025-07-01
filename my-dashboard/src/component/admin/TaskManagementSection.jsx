import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import Modal from '../Modal';
import { TaskContext } from '../../context/TaskContext';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../lib/supabaseClient';

const TaskManagementSection = () => {
  const { darkMode } = useTheme();
  const { addTask } = useContext(TaskContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitles, setTaskTitles] = useState([]);

  const fallbackTitles = [
    'Documentation Collection',
    'Order Services',
    'Compliance & Disclosures',
    'LO/Processor Follow-ups',
    'Client Communication Touchpoints',
  ];

  useEffect(() => {
    const fetchTitles = async () => {
      const { data, error } = await supabase.from('task_templates').select('title');
      if (error || !data?.length) {
        console.warn('Using fallback task titles.');
        setTaskTitles(fallbackTitles);
      } else {
        setTaskTitles(data.map((item) => item.title));
      }
    };

    fetchTitles();
  }, []);

  const handleCreate = (newTask) => {
    addTask("Today's Tasks", {
      ...newTask,
      id: Date.now(),
    });
  };

  return (
    <section className="relative space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Task Management</h2>

      <div className="relative">
        <div
          className={`absolute right-0 top-0 h-full w-10 pointer-events-none z-10 ${
            darkMode ? 'bg-gradient-to-l from-gray-900' : 'bg-gradient-to-l from-white'
          }`}
        />

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory pr-6 scroll-smooth">
          {taskTitles.map((title, idx) => (
            <motion.div
              key={idx}
              className="snap-start cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setSelectedTask({ title });
                setModalOpen(true);
              }}
            >
              <TaskCard title={title} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating FAB Button */}
      <button
        onClick={() => {
          setSelectedTask(null);
          setModalOpen(true);
        }}
        className={`fixed bottom-8 right-8 z-50 shadow-lg rounded-full w-14 h-14 text-2xl font-bold 
          flex items-center justify-center transition-all ${
            darkMode
              ? 'bg-blue-700 hover:bg-blue-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        title="Add New Task"
      >
        +
      </button>

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
    </section>
  );
};

export default TaskManagementSection;
