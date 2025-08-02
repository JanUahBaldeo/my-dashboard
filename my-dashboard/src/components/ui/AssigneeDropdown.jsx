// ========================================
// 👤 ASSIGNEE DROPDOWN COMPONENT
// ========================================

import { useState, useEffect, useRef } from 'react';
import { createLogger } from '@utils/logger';
import { GHL_CONFIG, getGHLHeaders } from '@config/ghlConfig';

const assigneeLogger = createLogger('AssigneeDropdown');

const AssigneeDropdown = ({ value, onChange, placeholder = 'Select assignee' }) => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch users from GHL
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${GHL_CONFIG.baseUrl}/users`,
        {
          method: 'GET',
          headers: getGHLHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const userList = data.users || data || [];
      setUsers(userList);
      assigneeLogger.info('Users fetched successfully', { count: userList.length });
    } catch (error) {
      assigneeLogger.error('Error fetching users', error);
      // Fallback to mock users if API fails
      const mockUsers = [
        { _id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { _id: 'user-2', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@example.com' },
        { _id: 'user-3', firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com' },
        { _id: 'user-4', firstName: 'Emily', lastName: 'Johnson', email: 'emily.johnson@example.com' },
        { _id: 'user-5', firstName: 'Michael', lastName: 'Smith', email: 'michael.smith@example.com' },
      ];
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
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

  // Set selected user when value changes
  useEffect(() => {
    if (value && users.length > 0) {
      const user = users.find(u => u._id === value || u.id === value);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }
  }, [value, users]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(query)
    );
  });

  // Get user initials
  const getInitials = (user) => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  // Get user full name
  const getFullName = (user) => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  };

  // Get random color for user avatar
  const getUserColor = (user) => {
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
    const index = (user._id || user.id || '').length % colors.length;
    return colors[index];
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    onChange(user._id || user.id);
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
      {/* Selected User Display */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-left flex items-center justify-between"
      >
        {selectedUser ? (
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getUserColor(selectedUser)}`}>
              {getInitials(selectedUser)}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{getFullName(selectedUser)}</span>
              <span className="text-xs text-gray-500">{selectedUser.email}</span>
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Users List */}
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user._id || user.id}
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className={`w-full px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    (user._id || user.id) === value ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getUserColor(user)}`}>
                      {getInitials(user)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{getFullName(user)}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
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
              onClick={fetchUsers}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Refresh Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssigneeDropdown;
