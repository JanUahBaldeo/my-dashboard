// ========================================
// 🎯 TASK SECTION COMPONENT WITH ALIASED IMPORTS
// ========================================

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

import { TaskContext } from '@context/TaskContext';
import TaskCard from './TaskCard';

// Hook for draggable TaskCard
const DraggableCard = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {typeof children === 'function'
        ? children({ isDragging, listeners, attributes, setNodeRef })
        : children}
    </div>
  );
};

const TaskSection = () => {
  const { tasksByCategory } = useContext(TaskContext);
  const [filter, setFilter] = useState('All');

  // Add null check and default values
  const categories = tasksByCategory ? Object.keys(tasksByCategory) : [];
  const [categoryOrder, setCategoryOrder] = useState(categories);

  // Update categoryOrder when tasksByCategory changes
  useEffect(() => {
    if (tasksByCategory) {
      setCategoryOrder(Object.keys(tasksByCategory));
    }
  }, [tasksByCategory]);

  const filteredCategories =
    filter === 'All' ? categoryOrder : categoryOrder.filter((c) => c === filter);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = categoryOrder.indexOf(active.id);
      const newIndex = categoryOrder.indexOf(over.id);
      setCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      filter: 'blur(6px)',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  // Show loading state if tasksByCategory is null
  if (!tasksByCategory) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full p-8"
      >
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-600">Loading tasks...</div>
        </div>
      </motion.section>
    );
  }
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="w-full bg-white overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-3">
                Task Overview
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-[#01818E] to-cyan-400 rounded-full" />
            </div>
            {/* Category Filter */}
            <motion.select
              key={filter}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onChange={handleFilterChange}
              value={filter}
              className="px-4 py-2.5 text-sm bg-white text-gray-700 border border-gray-200 rounded-full shadow-sm hover:ring-2 hover:ring-[#01818E] focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent transition-all"
            >
              <option>All</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </motion.select>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Draggable Cards */}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredCategories} strategy={verticalListSortingStrategy}>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {filteredCategories.map((category, idx) => (
                    <motion.div
                      key={category}
                      custom={idx}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="will-change-transform"
                    >
                      <DraggableCard id={category}>
                        {({ isDragging, listeners, attributes, setNodeRef }) => (
                          <div className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
                            <TaskCard
                              id={category}
                              title={category}
                              color={tasksByCategory[category]?.color || 'gray'}
                              tasks={tasksByCategory[category]?.items || []}
                              listeners={listeners}
                              attributes={attributes}
                              setNodeRef={setNodeRef}
                              isDragging={isDragging}
                            />
                          </div>
                        )}
                      </DraggableCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </motion.section>
  );
};

export default TaskSection;
