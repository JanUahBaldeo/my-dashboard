// ========================================
// 📞 CONTACT DROPDOWN COMPONENT
// ========================================

import { useState, useEffect, useRef } from 'react';
import { searchContacts } from '@api/contactApi';
import { createLogger } from '@utils/logger';

const contactLogger = createLogger('ContactDropdown');

const ContactDropdown = ({ value, onChange, placeholder = 'Select contact' }) => {
  const [contacts, setContacts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch contacts from GHL
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const result = await searchContacts({ limit: 50 }); // Get first 50 contacts
      if (result.success) {
        setContacts(result.data || []);
        contactLogger.info('Contacts fetched successfully', { count: result.data?.length });
      } else {
        contactLogger.error('Failed to fetch contacts', result.error);
        setContacts([]);
      }
    } catch (error) {
      contactLogger.error('Error fetching contacts', error);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set selected contact when value changes
  useEffect(() => {
    if (value && contacts.length > 0) {
      const contact = contacts.find(c => c._id === value || c.id === value);
      setSelectedContact(contact || null);
    } else {
      setSelectedContact(null);
    }
  }, [value, contacts]);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.firstName?.toLowerCase().includes(query) ||
      contact.lastName?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase().includes(query)
    );
  });

  // Get contact initials
  const getInitials = (contact) => {
    const firstName = contact.firstName || '';
    const lastName = contact.lastName || '';
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  // Get contact full name
  const getFullName = (contact) => {
    const firstName = contact.firstName || '';
    const lastName = contact.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown Contact';
  };

  // Get random color for contact avatar
  const getContactColor = (contact) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    const index = (contact._id || contact.id || '').length % colors.length;
    return colors[index];
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    onChange(contact._id || contact.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Contact Display */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-left flex items-center justify-between"
      >
        {selectedContact ? (
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getContactColor(selectedContact)}`}>
              {getInitials(selectedContact)}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{getFullName(selectedContact)}</span>
              <span className="text-xs text-gray-500">{selectedContact.email}</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <svg className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Contacts List */}
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm">Loading contacts...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No contacts found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact._id || contact.id}
                  type="button"
                  onClick={() => handleContactSelect(contact)}
                  className={`w-full px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    (contact._id || contact.id) === value ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getContactColor(contact)}`}>
                      {getInitials(contact)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{getFullName(contact)}</span>
                      <span className="text-xs text-gray-500">{contact.email}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Refresh Button */}
          <div className="p-2 border-t border-gray-200">
            <button
              type="button"
              onClick={fetchContacts}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Refresh Contacts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDropdown;
