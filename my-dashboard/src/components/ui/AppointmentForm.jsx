// 📝 Appointment Form Component
// Handles appointment form fields and validation

import { useState } from 'react';
import { FiUser, FiMapPin, FiFileText, FiPlus, FiX } from 'react-icons/fi';
import ContactDropdown from './ContactDropdown';

const AppointmentForm = ({
  form,
  setForm,
  errors,
  setErrors,
  activeTab,
  isSubmitting,
  onAddNote,
  onRemoveNote,
  newNote,
  setNewNote,
  showDescription,
  setShowDescription,
  titleInputRef
}) => {
  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed', className: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'pending', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'cancelled', label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  ];

  const meetingLocations = [
    { value: 'calendar-default', label: 'Calendar Default' },
    { value: 'office', label: 'Office' },
    { value: 'virtual', label: 'Virtual Meeting' },
    { value: 'client-location', label: 'Client Location' },
  ];

  const slotTypes = [
    { value: 'default', label: 'Default' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'closing', label: 'Closing' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = activeTab === 'appointment' ? 'Appointment title is required' : 'Title is required';
    }

    if (!form.date) {
      newErrors.date = 'Date is required';
    }

    if (!form.timeSlot) {
      newErrors.timeSlot = 'Time slot is required';
    }

    if (!form.timezone) {
      newErrors.timezone = 'Timezone is required';
    }

    if (activeTab === 'appointment' && !form.contactId) {
      newErrors.contactId = 'Contact is required for appointments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {activeTab === 'appointment' ? 'Appointment Title' : 'Title'}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          ref={titleInputRef}
          type="text"
          value={form.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          disabled={isSubmitting}
          className={`w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.title ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : ''
          }`}
          placeholder={activeTab === 'appointment' ? 'Enter appointment title...' : 'Enter title...'}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiFileText className="inline w-4 h-4 mr-2" />
            Description
          </label>
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showDescription ? 'Hide' : 'Add Description'}
          </button>
        </div>
        
        {showDescription && (
          <textarea
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={isSubmitting}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter description..."
          />
        )}
      </div>

      {/* Contact Selection (Appointment Tab Only) */}
      {activeTab === 'appointment' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiUser className="inline w-4 h-4 mr-2" />
            Contact
            <span className="text-red-500 ml-1">*</span>
          </label>
          <ContactDropdown
            selectedContactId={form.contactId}
            onContactSelect={(contactId) => handleInputChange('contactId', contactId)}
            disabled={isSubmitting}
            error={errors.contactId}
          />
          {errors.contactId && (
            <p className="text-red-500 text-sm mt-1">{errors.contactId}</p>
          )}
        </div>
      )}

      {/* Meeting Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FiMapPin className="inline w-4 h-4 mr-2" />
          Meeting Location
        </label>
        <select
          value={form.meetingLocation}
          onChange={(e) => handleInputChange('meetingLocation', e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {meetingLocations.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>
      </div>

      {/* Slot Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Slot Type
        </label>
        <select
          value={form.slotType}
          onChange={(e) => handleInputChange('slotType', e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {slotTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => handleInputChange('status', status.value)}
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                form.status === status.value
                  ? status.className
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Internal Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Internal Notes
        </label>
        
        {/* Add Note Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Add a note..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddNote();
              }
            }}
          />
          <button
            type="button"
            onClick={onAddNote}
            disabled={isSubmitting || !newNote.trim()}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Notes List */}
        {form.internalNotes.length > 0 && (
          <div className="space-y-2">
            {form.internalNotes.map((note, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{note}</span>
                <button
                  type="button"
                  onClick={() => onRemoveNote(index)}
                  disabled={isSubmitting}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentForm; 