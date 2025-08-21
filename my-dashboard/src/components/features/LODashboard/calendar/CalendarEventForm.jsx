import { useState } from 'react';
import { FiCalendar, FiMapPin, FiUser, FiTag } from 'react-icons/fi';
import AppointmentModal from '@components/ui/AppointmentModal';

const categoryColors = {
  Activity: '#4F46E5',    // Indigo
  Campaign: '#7C3AED',    // Violet
  Email: '#059669',       // Emerald
  Task: '#EA580C',        // Orange
  Meeting: '#DC2626',     // Red
  Call: '#0891B2',        // Sky
  FollowUp: '#16A34A',    // Green
  Review: '#CA8A04',      // Yellow
};

const CalendarEventForm = ({
  modalOpen,
  setModalOpen,
  form,
  setForm,
  editId,
  saveEvent,
  deleteEvent,
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEvent();
  };

  return (
    <AppointmentModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title={editId ? 'Edit Event' : 'Add New Event'}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {Object.keys(categoryColors).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter event description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attendees
          </label>
          <input
            type="text"
            name="attendees"
            value={form.attendees}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter attendees"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="repeat"
            checked={form.repeat}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Repeat this event
          </label>
        </div>

        {editId && (
          <button
            type="button"
            onClick={deleteEvent}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Event
          </button>
        )}
      </div>
    </AppointmentModal>
  );
};

export default CalendarEventForm;
