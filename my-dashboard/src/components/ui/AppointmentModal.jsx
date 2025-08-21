// 📅 Appointment Modal Component
// Main modal component for creating and editing appointments

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiClock, FiUser, FiMapPin, FiX, FiPlus, FiSearch, FiCheck } from 'react-icons/fi';
import ContactDropdown from './ContactDropdown';
import TimeSlotSelector from './TimeSlotSelector';
import AppointmentForm from './AppointmentForm';

const AppointmentModal = ({ isOpen, onClose, selectedDate = null, mode = 'create' }) => {
  const [activeTab, setActiveTab] = useState('appointment');
  const [form, setForm] = useState({
    calendar: 'Book Now With {{ custom_values.dfy_snapshot_mlo_full_n...',
    title: '',
    description: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    timeSlot: '8:00 am - 8:30 am',
    timezone: 'GMT-07:00 America/Los_Angeles (PDT)',
    slotType: 'default',
    meetingLocation: 'calendar-default',
    status: 'confirmed',
    contactId: '',
    internalNotes: [],
    // Blocked time specific fields
    userCalendar: 'Joel Morgan',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16),
  });
  const [showDescription, setShowDescription] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate) {
      setForm(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'create') {
        toast.success('✅ Appointment created successfully!');
      } else {
        toast.success('✅ Appointment updated successfully!');
      }
      
      onClose();
    } catch (error) {
      toast.error('❌ Failed to save appointment');
      console.error('Error saving appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInternalNote = () => {
    if (newNote.trim()) {
      setForm(prev => ({
        ...prev,
        internalNotes: [...prev.internalNotes, newNote.trim()]
      }));
      setNewNote('');
    }
  };

  const removeInternalNote = (noteId) => {
    setForm(prev => ({
      ...prev,
      internalNotes: prev.internalNotes.filter((_, index) => index !== noteId)
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'create' ? 'Create Appointment' : 'Edit Appointment'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'appointment' ? 'Schedule a new appointment' : 'Block time on your calendar'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('appointment')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'appointment'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiCalendar className="inline w-4 h-4 mr-2" />
                Appointment
              </button>
              <button
                onClick={() => setActiveTab('blocked-time')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'blocked-time'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiClock className="inline w-4 h-4 mr-2" />
                Blocked Time
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Appointment Form */}
                <AppointmentForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  setErrors={setErrors}
                  activeTab={activeTab}
                  isSubmitting={isSubmitting}
                  onAddNote={addInternalNote}
                  onRemoveNote={removeInternalNote}
                  newNote={newNote}
                  setNewNote={setNewNote}
                  showDescription={showDescription}
                  setShowDescription={setShowDescription}
                  titleInputRef={titleInputRef}
                />

                {/* Time Slot Selector */}
                <TimeSlotSelector
                  selectedSlot={form.timeSlot}
                  onSlotChange={(slot) => setForm(prev => ({ ...prev, timeSlot: slot }))}
                  selectedDate={form.date}
                  onDateChange={(date) => setForm(prev => ({ ...prev, date: date }))}
                  selectedTimezone={form.timezone}
                  onTimezoneChange={(timezone) => setForm(prev => ({ ...prev, timezone: timezone }))}
                  disabled={isSubmitting}
                />

                {/* Blocked Time Specific Fields */}
                {activeTab === 'blocked-time' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Calendar
                      </label>
                      <input
                        type="text"
                        value={form.userCalendar}
                        onChange={(e) => setForm(prev => ({ ...prev, userCalendar: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="datetime-local"
                          value={form.startTime}
                          onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="datetime-local"
                          value={form.endTime}
                          onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Appointment' : 'Update Appointment'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;
