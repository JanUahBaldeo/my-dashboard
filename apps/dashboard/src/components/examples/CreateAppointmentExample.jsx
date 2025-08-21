// ========================================
// 🎯 CREATE APPOINTMENT EXAMPLE COMPONENT
// ========================================
// Shows how to create appointments using your GHL API with location ID

import React, { useState, useEffect } from 'react';
import { useGHLIntegration } from '@shared/hooks';

const CreateAppointmentExample = () => {
  const { appointments, contacts, calendar, loading, error } = useGHLIntegration();

  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    calendarId: '',
    assignedUserId: '',
    startTime: '',
    endTime: '',
    address: 'Online Meeting',
    notes: '',
  });

  const [availableContacts, setAvailableContacts] = useState([]);
  const [availableCalendars, setAvailableCalendars] = useState([]);
  const [createdAppointments, setCreatedAppointments] = useState([]);

  // ========================================================================
  // 🔄 LOAD DATA
  // ========================================================================

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load contacts and calendars for the dropdowns
      const [contactsResult, calendarsResult] = await Promise.all([
        contacts.getAll({ limit: 50 }),
        calendar.getAll({ limit: 20 }),
      ]);

      setAvailableContacts(contactsResult || []);
      setAvailableCalendars(calendarsResult || []);

      // Auto-select first contact and calendar if available
      if (contactsResult && contactsResult.length > 0) {
        setFormData(prev => ({
          ...prev,
          contactId: contactsResult[0]._id || contactsResult[0].id,
        }));
      }

      if (calendarsResult && calendarsResult.length > 0) {
        setFormData(prev => ({
          ...prev,
          calendarId: calendarsResult[0]._id || calendarsResult[0].id,
        }));
      }

    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  // ========================================================================
  // 📅 APPOINTMENT CREATION METHODS
  // ========================================================================

  // Method 1: Using the complete create method (matches your cURL exactly)
  const handleCreateAppointment = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.contactId || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // This uses your exact cURL structure with location ID: b7vHWUGVUNQGoIlAXabY
      const appointmentData = {
        title: formData.title,
        contactId: formData.contactId,
        calendarId: formData.calendarId || 'CVokAlI8fgw4WYWoCtQz', // Default from your cURL
        assignedUserId: formData.assignedUserId || '0007BWpSzSwfiuSl0tR2', // Default from your cURL
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        address: formData.address,
        notes: formData.notes,
        // These are set automatically by the API service with your location ID
        locationId: 'b7vHWUGVUNQGoIlAXabY',
        appointmentStatus: 'new',
        meetingLocationType: 'custom',
        meetingLocationId: 'default',
        overrideLocationConfig: true,
        ignoreDateRange: false,
        toNotify: false,
        ignoreFreeSlotValidation: true,
      };

      const result = await appointments.create(appointmentData);

      if (result) {
        console.log('✅ Appointment created:', result);
        setCreatedAppointments(prev => [result, ...prev]);

        // Reset form
        setFormData({
          title: '',
          contactId: availableContacts[0]?._id || '',
          calendarId: availableCalendars[0]?._id || '',
          assignedUserId: '',
          startTime: '',
          endTime: '',
          address: 'Online Meeting',
          notes: '',
        });
      }

    } catch (error) {
      console.error('Create appointment failed:', error);
    }
  };

  // Method 2: Using the quick create method (with smart defaults)
  const handleQuickCreate = async () => {
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert('Please fill in title and times for quick create');
      return;
    }

    try {
      const result = await appointments.createQuick({
        title: formData.title,
        contactId: formData.contactId,
        calendarId: formData.calendarId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        assignedUserId: formData.assignedUserId,
        address: formData.address,
        notes: formData.notes,
      });

      if (result) {
        console.log('✅ Quick appointment created:', result);
        setCreatedAppointments(prev => [result, ...prev]);
      }

    } catch (error) {
      console.error('Quick create appointment failed:', error);
    }
  };

  // Method 3: Create appointment exactly matching your cURL example
  const handleCreateExampleAppointment = async () => {
    try {
      // This exactly matches your cURL command structure
      const exampleAppointment = {
        title: 'Test Event',
        meetingLocationType: 'custom',
        meetingLocationId: 'default',
        overrideLocationConfig: true,
        appointmentStatus: 'new',
        assignedUserId: '0007BWpSzSwfiuSl0tR2',
        address: 'Zoom',
        ignoreDateRange: false,
        toNotify: false,
        ignoreFreeSlotValidation: true,
        calendarId: 'CVokAlI8fgw4WYWoCtQz',
        locationId: 'b7vHWUGVUNQGoIlAXabY', // Your location ID
        contactId: formData.contactId || '0007BWpSzSwfiuSl0tR2',
        startTime: new Date().toISOString(), // Now
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      };

      const result = await appointments.create(exampleAppointment);

      if (result) {
        console.log('✅ Example appointment created:', result);
        setCreatedAppointments(prev => [result, ...prev]);
      }

    } catch (error) {
      console.error('Example appointment creation failed:', error);
    }
  };

  // ========================================================================
  // 🎨 FORM HELPERS
  // ========================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const setQuickDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // 10 AM tomorrow

    const endTime = new Date(tomorrow);
    endTime.setHours(11, 0, 0, 0); // 11 AM tomorrow

    setFormData(prev => ({
      ...prev,
      startTime: tomorrow.toISOString().slice(0, 16), // Format for datetime-local input
      endTime: endTime.toISOString().slice(0, 16),
    }));
  };

  // ========================================================================
  // 🎨 RENDER COMPONENT
  // ========================================================================

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          📅 Create GHL Appointments
        </h1>

        {/* Location Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900">📍 Location Configuration</h3>
          <p className="text-sm text-blue-800">Location ID: <code>b7vHWUGVUNQGoIlAXabY</code></p>
          <p className="text-sm text-blue-800">API Endpoint: <code>https://services.leadconnectorhq.com/calendars/events/appointments</code></p>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">🚀 Quick Actions</h3>
          <div className="flex space-x-3">
            <button
              onClick={handleCreateExampleAppointment}
              disabled={loading || !availableContacts.length}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              📋 Create Example Appointment
            </button>
            <button
              onClick={setQuickDateTime}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              🕐 Set Tomorrow 10-11 AM
            </button>
            <button
              onClick={loadInitialData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Appointment Form */}
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Loan Consultation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact *
              </label>
              <select
                name="contactId"
                value={formData.contactId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Contact</option>
                {availableContacts.map(contact => (
                  <option key={contact._id || contact.id} value={contact._id || contact.id}>
                    {contact.firstName} {contact.lastName} ({contact.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Calendar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calendar
              </label>
              <select
                name="calendarId"
                value={formData.calendarId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Calendar</option>
                {availableCalendars.map(cal => (
                  <option key={cal._id || cal.id} value={cal._id || cal.id}>
                    {cal.name || cal.title || `Calendar ${cal._id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned User ID
              </label>
              <input
                type="text"
                name="assignedUserId"
                value={formData.assignedUserId}
                onChange={handleInputChange}
                placeholder="e.g., 0007BWpSzSwfiuSl0tR2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address/Location
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., Zoom, Office, Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional appointment details..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {loading ? '⏳ Creating...' : '📅 Create Appointment'}
            </button>

            <button
              type="button"
              onClick={handleQuickCreate}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              ⚡ Quick Create
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Created Appointments */}
      {createdAppointments.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ✅ Created Appointments ({createdAppointments.length})
          </h2>

          <div className="space-y-3">
            {createdAppointments.map((appointment, index) => (
              <div key={appointment.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                    <p className="text-sm text-gray-600">
                      📅 {appointment.startTime ? new Date(appointment.startTime).toLocaleString() : 'No date'}
                      {appointment.endTime && ` - ${new Date(appointment.endTime).toLocaleTimeString()}`}
                    </p>
                    <p className="text-sm text-gray-600">📍 {appointment.address}</p>
                    <p className="text-sm text-gray-500">ID: {appointment.id}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => appointments.updateStatus(appointment.id, 'confirmed')}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => appointments.cancel(appointment.id)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Usage Instructions</h3>
        <div className="text-blue-800 text-sm space-y-1">
          <p>• <strong>Location ID</strong>: Your appointments use location ID <code>b7vHWUGVUNQGoIlAXabY</code></p>
          <p>• <strong>API Version</strong>: Uses version <code>2021-04-15</code> as specified in your cURL</p>
          <p>• <strong>Smart Defaults</strong>: The API automatically sets required fields from your cURL example</p>
          <p>• <strong>Quick Create</strong>: Uses simplified data with smart defaults for faster appointment creation</p>
          <p>• <strong>Example Button</strong>: Creates an appointment exactly matching your cURL command structure</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointmentExample;
