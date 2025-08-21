// ========================================
// 👤 ASSIGNEE DROPDOWN COMPONENT
// ========================================

import { useState, useEffect, useRef } from 'react';
import { createLogger } from '@utils/logger';
import { fetchUsers, testGHLUsersConnection, getGHLUserId, testDirectCurlFormat } from '@api/userApi';
import { toast } from 'react-hot-toast';

const assigneeLogger = createLogger('AssigneeDropdown');

const AssigneeDropdown = ({ value, onChange, placeholder = 'Select assignee' }) => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMockData, setIsMockData] = useState(false);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch users from GHL using the new API service
  const fetchUsersFromAPI = async () => {
    setIsLoading(true);
    assigneeLogger.info('🔄 Fetching users from GHL API...');
    try {
      const result = await fetchUsers();

      if (result.success) {
        assigneeLogger.info('✅ API call successful', {
          userCount: result.data.length,
          isMockData: result.isMockData,
          url: result.url,
        });

        setUsers(result.data);
        setIsMockData(result.isMockData || false);

        if (result.isMockData) {
          assigneeLogger.warn('Using mock users - GHL API not available');
          // Only show warning if we're actually using mock data
          toast.warning('⚠️ Using demo users - GHL connection not available');
        } else {
          assigneeLogger.info('Users fetched successfully from GHL', {
            count: result.data.length,
            url: result.url,
          });
          // Show success message for real GHL users
          if (result.data.length > 0) {
            toast.success(`✅ Loaded ${result.data.length} users from GHL`);
          }
        }
      } else {
        assigneeLogger.error('❌ API call failed:', {
          error: result.error,
          userCount: result.data?.length || 0,
          isMockData: result.isMockData,
        });
        // Only show error if we don't have any users to display
        if (result.data.length === 0) {
          toast.error('❌ Failed to load users');
        }
      }
    } catch (error) {
      assigneeLogger.error('Error fetching users:', error);
      // Only show error if we don't have any users to display
      if (users.length === 0) {
        toast.error('❌ Error loading users');
      }
    } finally {
      setIsLoading(false);

      // If we still don't have users after the API call, try the test curl command as fallback
      if (users.length === 0 && !hasTriedFallback) {
        console.log('🔄 No users loaded, trying test curl command as fallback...');
        setHasTriedFallback(true);
        testCurlCommand(true); // Pass true to indicate this is a fallback call
      }
    }
  };

  // Test the exact curl command
  const testCurlCommand = async (isFallback = false) => {
    setIsLoading(true);
    try {
      const result = await testDirectCurlFormat();

      if (result.success) {
        assigneeLogger.success('Curl command test successful', {
          count: result.data.length,
          message: result.message,
        });

        // Only show success toast if not used as fallback
        if (!isFallback) {
          toast.success('✅ Curl command test successful!');
        }

        // Update users with the test results
        setUsers(result.data);
        setIsMockData(false);
      } else {
        assigneeLogger.error('Curl command test failed:', result.error);
        if (!isFallback) {
          toast.error(`❌ Curl test failed: ${result.message}`);
        }
      }
    } catch (error) {
      assigneeLogger.error('Error testing curl command:', error);
      if (!isFallback) {
        toast.error('❌ Error testing curl command');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load users when component mounts
  useEffect(() => {
    // Always fetch users when component mounts to ensure we get real GHL users
    console.log('🔄 AssigneeDropdown: Loading users on mount...');
    fetchUsersFromAPI();
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
      const user = users.find(u => u.ghlId === value || u.id === value || u._id === value);
      setSelectedUser(user || null);
      if (user) {
        console.log('🎯 Found selected user:', { value, user });
      }
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
    // Use the standardized GHL ID
    const ghlId = getGHLUserId(user);
    console.log('🎯 Selected user:', { user, ghlId });
    onChange(ghlId);
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
        {isMockData && (
          <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Demo
          </div>
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
                      {user.ghlId && (
                        <span className="text-xs text-blue-600 font-mono">ID: {user.ghlId.substring(0, 12)}...</span>
                      )}
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
              onClick={fetchUsersFromAPI}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              {isMockData ? 'Try Connect to GHL' : 'Refresh Users'}
            </button>
            <button
              type="button"
              onClick={testCurlCommand}
              className="w-full px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors mt-1"
            >
              Test Curl Command
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssigneeDropdown;
