import { useState, useEffect, useContext, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import toast, { Toaster } from 'react-hot-toast';
import { TaskContext } from '@context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import { CalendarEventForm, CalendarStats, CalendarFilters } from './calendar';
import '@styles/Calendar.css';

const getNextWeekISO = (start, weeks) => {
  const date = new Date(start);
  date.setDate(date.getDate() + (weeks * 7));
  return date.toISOString().split('T')[0];
};

const CalendarSection = () => {
  const { tasksByCategory } = useContext(TaskContext);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editId, setEditId] = useState(null);
  const [moreEventsPopover, setMoreEventsPopover] = useState({
    isOpen: false,
    date: null,
    events: [],
    position: { x: 0, y: 0 },
  });
  const [form, setForm] = useState({
    title: '',
    category: 'Activity',
    repeat: false,
    description: '',
    location: '',
    attendees: '',
  });
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [
      {
        id: '1',
        title: 'Client Meeting',
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        category: 'Activity',
        description: 'Discuss loan application progress',
        location: 'Conference Room A',
        attendees: 'John Doe, Jane Smith',
      },
      {
        id: '2',
        title: 'Document Review',
        start: getNextWeekISO(new Date(), 1),
        end: getNextWeekISO(new Date(), 1),
        category: 'Task',
        description: 'Review client documents',
        location: 'Office',
        attendees: 'Legal Team',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const taskEvents = useMemo(() => {
    try {
      const allTasks = tasksByCategory?.['All Tasks']?.items || [];
      console.log('📅 Calendar Task Integration Debug:');
      console.log('All Tasks:', allTasks);
      console.log('TasksByCategory:', tasksByCategory);

      // If no tasks are found, add some test tasks for debugging
      let tasksToProcess = allTasks;
      if (allTasks.length === 0) {
        console.log('📅 No tasks found, adding test tasks...');
        tasksToProcess = [
          {
            id: 'test-task-1',
            title: 'Client Meeting',
            description: 'This is a test task for calendar integration',
            dueDate: new Date(),
            assigneeName: 'John Doe',
            priority: 'high',
            status: 'pending',
          },
          {
            id: 'test-task-2',
            title: 'Document Review',
            description: 'Another test task for calendar',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            assigneeName: 'Jane Smith',
            priority: 'medium',
            status: 'in-progress',
          },
        ];
      }

      return tasksToProcess.map(task => ({
        id: `task-${task.id}`,
        title: task.title,
        start: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        end: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: 'Task',
        description: task.description || 'Task from system',
        location: 'Office',
        attendees: task.assigneeName || 'Unassigned',
        backgroundColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981',
        borderColor: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#059669',
        textColor: '#ffffff',
        extendedProps: {
          type: 'task',
          taskId: task.id,
          priority: task.priority,
          status: task.status,
        },
      }));
    } catch (error) {
      console.error('Error processing tasks for calendar:', error);
      return [];
    }
  }, [tasksByCategory]);

  const allEvents = [...events, ...taskEvents];

  const openAddModal = (dateStr) => {
    setSelectedDate(dateStr);
    setForm({
      title: '',
      category: 'Activity',
      repeat: false,
      description: '',
      location: '',
      attendees: '',
    });
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = ({ event, startStr }) => {
    setSelectedDate(startStr);
    setForm({
      title: event.title,
      category: event.extendedProps?.category || 'Activity',
      repeat: false,
      description: event.extendedProps?.description || '',
      location: event.extendedProps?.location || '',
      attendees: event.extendedProps?.attendees || '',
    });
    setEditId(event.id);
    setModalOpen(true);
  };

  const handleMoreLinkClick = (arg) => {
    const date = arg.date;
    const dayEvents = allEvents.filter(event => {
      const eventDate = new Date(event.start).toDateString();
      const clickDate = date.toDateString();
      return eventDate === clickDate;
    });

    if (dayEvents.length > 3) {
      setMoreEventsPopover({
        isOpen: true,
        date: date,
        events: dayEvents.slice(3),
        position: { x: arg.jsEvent.clientX, y: arg.jsEvent.clientY },
      });
    }
  };

  const closeMoreEventsPopover = () => {
    setMoreEventsPopover({
      isOpen: false,
      date: null,
      events: [],
      position: { x: 0, y: 0 },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreEventsPopover.isOpen) {
        const popover = document.getElementById('more-events-popover');
        if (popover && !popover.contains(event.target)) {
          closeMoreEventsPopover();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreEventsPopover.isOpen]);

  const saveEvent = () => {
    if (!form.title.trim()) {
      toast.error('Please enter a title for the event');
      return;
    }

    const newEvent = {
      id: editId || Date.now().toString(),
      title: form.title,
      start: selectedDate,
      end: selectedDate,
      category: form.category,
      description: form.description,
      location: form.location,
      attendees: form.attendees,
      backgroundColor: form.category === 'Activity' ? '#3b82f6' : '#10b981',
      borderColor: form.category === 'Activity' ? '#2563eb' : '#059669',
      textColor: '#ffffff',
      extendedProps: {
        category: form.category,
        description: form.description,
        location: form.location,
        attendees: form.attendees,
      },
    };

    if (editId) {
      setEvents(prev => prev.map(event => event.id === editId ? newEvent : event));
      toast.success('Event updated successfully!');
    } else {
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event added successfully!');
    }

    setModalOpen(false);
    setForm({ title: '', category: 'Activity', repeat: false, description: '', location: '', attendees: '' });
  };

  const deleteEvent = () => {
    if (editId) {
      setEvents(prev => prev.filter(event => event.id !== editId));
      toast.success('Event deleted successfully!');
    }
    setModalOpen(false);
    setForm({ title: '', category: 'Activity', repeat: false, description: '', location: '', attendees: '' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Calendar & Events
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your schedule and track important events
              </p>
            </div>
          </div>
          <button
            onClick={() => openAddModal(new Date().toISOString().split('T')[0])}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium"
          >
            <FiPlus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Stats */}
      <CalendarStats events={events} taskEvents={taskEvents} />

      {/* Calendar Filters */}
      <CalendarFilters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3}
          weekends={true}
          events={allEvents}
          select={openAddModal}
          eventClick={openEditModal}
          moreLinkClick={handleMoreLinkClick}
          height="auto"
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
        />
      </div>

      {/* Event Form Modal */}
      <CalendarEventForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        form={form}
        setForm={setForm}
        saveEvent={saveEvent}
        deleteEvent={deleteEvent}
        editId={editId}
      />

      {/* More Events Popover */}
      <AnimatePresence>
        {moreEventsPopover.isOpen && (
          <motion.div
            id="more-events-popover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
            style={{
              left: moreEventsPopover.position.x,
              top: moreEventsPopover.position.y,
            }}
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                More Events - {moreEventsPopover.date?.toLocaleDateString()}
              </h3>
              {moreEventsPopover.events.map((event, index) => (
                <div key={index} className="p-2 rounded bg-gray-50 dark:bg-gray-700">
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {event.title}
                  </div>
                  {event.extendedProps?.description && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {event.extendedProps.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
};

export default CalendarSection;
