// src/context/TaskContext.jsx
import { createContext, useEffect, useState } from 'react';

export const TaskContext = createContext();

const LOCAL_STORAGE_KEY = 'task_data';

const defaultTasks = {
  "Today's Tasks": {
    color: 'teal',
    items: [
      {
        id: 1,
        title: 'Lorem ipsum',
        date: '2024-07-01',
        tags: ['High priority', 'Meeting'],
        actions: ['Reassign', 'Meeting'],
      },
      {
        id: 2,
        title: 'Lorem ipsum',
        date: '2024-07-02',
        tags: ['Low priority'],
        actions: ['Reassign', 'Call'],
      },
    ],
  },
  'Overdue Tasks': {
    color: 'orange',
    items: [
      {
        id: 3,
        title: 'Lorem ipsum',
        date: '2024-06-20',
        tags: ['High priority', 'Meeting'],
        actions: ['Reassign', 'Meeting'],
      },
      {
        id: 4,
        title: 'Lorem ipsum',
        date: '2024-06-18',
        tags: ['High priority'],
        actions: ['Completed', 'Call'],
      },
    ],
  },
  'Upcoming in 48 Hours': {
    color: 'blue',
    items: [
      {
        id: 5,
        title: 'Lorem ipsum',
        date: '2024-06-28',
        tags: ['High priority', 'Meeting'],
        actions: ['Snooze', 'Schedule Now'],
      },
      {
        id: 6,
        title: 'Lorem ipsum',
        date: '2024-06-29',
        tags: ['Low priority'],
        actions: ['Reassign', 'Call'],
      },
    ],
  },
};

export const TaskProvider = ({ children }) => {
  const [tasksByCategory, setTasksByCategory] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  // Save tasks to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasksByCategory));
  }, [tasksByCategory]);

  // Add task to a category
  const addTask = (category, task) => {
    setTasksByCategory((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: [...prev[category].items, task],
      },
    }));
  };

  // Update a task by ID (search all categories)
  const updateTask = (updatedTask) => {
    setTasksByCategory((prev) => {
      const newState = {};
      for (const category in prev) {
        newState[category] = {
          ...prev[category],
          items: prev[category].items.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        };
      }
      return newState;
    });
  };

  // Delete task from all categories
  const deleteTask = (taskId) => {
    setTasksByCategory((prev) => {
      const newState = {};
      for (const category in prev) {
        newState[category] = {
          ...prev[category],
          items: prev[category].items.filter((task) => task.id !== taskId),
        };
      }
      return newState;
    });
  };

  // Optional: reorder tasks in a category
  const reorderTasks = (category, newItemOrder) => {
    setTasksByCategory((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: newItemOrder,
      },
    }));
  };

  return (
    <TaskContext.Provider
      value={{
        tasksByCategory,
        setTasksByCategory,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks, // future use
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
