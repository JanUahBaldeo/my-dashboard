// src/component/CalendarSection.jsx  – streamlined & theme-aware
import { useState, useEffect, useContext, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import toast, { Toaster } from 'react-hot-toast';

import { TaskContext } from '../context/TaskContext';
import { useTheme } from '../hooks/useTheme';          // ✅ global theme hook
import './Calendar.css';

const categoryColors = {
  Activity: '#f59e0b',
  Campaign: '#ec4899',
  Email:    '#0ea5e9',
  Task:     '#6366f1',
};

const getEmoji = (cat) =>
  cat === 'Email'    ? '📧'
  : cat === 'Campaign' ? '📢'
  : '🎯';

const getNextWeekISO = (start, weeks) => {
  const d = new Date(start);
  d.setDate(d.getDate() + 7 * weeks);
  return d.toISOString().split('T')[0];
};

const CalendarSection = () => {
  const { tasksByCategory } = useContext(TaskContext);
  const { isDark } = useTheme();                       // ✅ consume global theme
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editId, setEditId]             = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Activity', repeat: false });

  /* -----------------------------------------------------------
     Load / persist calendar events in localStorage
  ------------------------------------------------------------*/
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('calendarEvents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  /* -----------------------------------------------------------
     Inject tasks from pipeline → calendar
  ------------------------------------------------------------*/
  useEffect(() => {
    const taskEvents = Object.values(tasksByCategory).flatMap(({ items }) =>
      items.map((task) => ({
        id:        `task-${task.id}`,
        title:     `📌 ${task.title}`,
        start:     task.date,
        category:  'Task',
        color:     categoryColors.Task,
      }))
    );
    setEvents((prev) => [
      ...prev.filter((e) => !e.id?.startsWith('task-')),
      ...taskEvents,
    ]);
  }, [tasksByCategory]);

  /* -----------------------------------------------------------
     Cull anything older than ±2 months on initial load
  ------------------------------------------------------------*/
  useEffect(() => {
    const threshold = new Date();
    threshold.setMonth(threshold.getMonth() - 2);
    setEvents((prev) => prev.filter((e) => new Date(e.start) > threshold));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /* -----------------------------------------------------------
     Derived list for current search / filter
  ------------------------------------------------------------*/
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          (filter === 'All' || e.category === filter) &&
          e.title.toLowerCase().includes(search.toLowerCase())
      ),
    [events, filter, search]
  );

  /* -----------------------------------------------------------
     Modal helpers
  ------------------------------------------------------------*/
  const openAddModal = (dateStr) => {
    setSelectedDate(dateStr);
    setForm({ title: '', category: 'Activity', repeat: false });
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = ({ event, startStr }) => {
    setSelectedDate(startStr);
    setForm({
      title:    event.title.replace(/^[^ ]+ /, ''), // strip emoji
      category: event.extendedProps.category,
      repeat:   false,
    });
    setEditId(event.id);
    setModalOpen(true);
  };

  const saveEvent = () => {
    if (!form.title || !selectedDate) return;
    const base = {
      title: `${getEmoji(form.category)} ${form.title}`,
      category: form.category,
      color: categoryColors[form.category] || '#3498db',
    };

    if (editId) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editId ? { ...e, ...base, start: selectedDate } : e))
      );
      toast.success('Event updated');
    } else {
      const id = Date.now().toString();
      const newEntries = form.repeat
        ? [...Array(4)].map((_, i) => ({
            ...base,
            id: `${id}-${i}`,
            start: getNextWeekISO(selectedDate, i),
          }))
        : [{ ...base, id, start: selectedDate }];
      setEvents((prev) => [...prev, ...newEntries]);
      toast.success(form.repeat ? 'Recurring events added!' : 'Event added');
    }
    setModalOpen(false);
  };

  const deleteEvent = () => {
    setEvents((prev) => prev.filter((e) => e.id !== editId));
    toast.success('Event deleted');
    setModalOpen(false);
  };

  /* ============================================================== */

  return (
    <section className="p-4 sm:p-6 md:p-8 transition-colors bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right" />

      <div className="shadow-md rounded-xl p-6 bg-white dark:bg-gray-800 transition-all">
        {/* ─── Top Controls ─────────────────────────────────────── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">📅 Calendar</h2>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="text-sm border rounded px-3 py-1"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {['All', 'Activity', 'Campaign', 'Email', 'Task'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {/* Add-appointment button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              ➕ Add appointment
            </button>
          </div>
        </div>

        {/* ─── FullCalendar ─────────────────────────────────────── */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          dateClick={(info) => openAddModal(info.dateStr)}
          eventClick={openEditModal}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          events={filteredEvents}
          dayMaxEventRows
          fixedWeekCount={false}
        />
      </div>

      {/* ─── Add/Edit Modal ────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit Event' : 'Add Event'}</h3>

            <input
              type="text"
              className="w-full mb-3 p-2 border rounded"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <select
              className="w-full mb-3 p-2 border rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {['Activity', 'Campaign', 'Email'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {!editId && (
              <label className="flex items-center gap-2 mb-4 text-sm">
                <input
                  type="checkbox"
                  checked={form.repeat}
                  onChange={(e) => setForm({ ...form, repeat: e.target.checked })}
                />
                Repeat weekly for 4 weeks
              </label>
            )}

            <div className="flex justify-end gap-2">
              {editId && (
                <button
                  onClick={deleteEvent}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CalendarSection;
