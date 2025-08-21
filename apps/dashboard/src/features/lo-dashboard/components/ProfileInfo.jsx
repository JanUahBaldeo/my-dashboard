// ========================================
// 🎯 ENHANCED PROFILE INFO COMPONENT
// ========================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSettings, FiBell, FiHelpCircle, FiShield } from 'react-icons/fi';

const ProfileInfo = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // User data
  const user = {
    name: 'User',
    email: 'user@example.com',
    tier: 'Premium',
    avatar: 'https://i.ibb.co/rK44TsnC/logo.png',
    role: 'Loan Officer',
    status: 'online',
  };

  // Menu items
  const menuItems = [
    { id: 'profile', label: 'View Profile', icon: FiUser, action: () => console.log('Profile clicked') },
    { id: 'settings', label: 'Settings', icon: FiSettings, action: () => console.log('Settings clicked') },
    { id: 'notifications', label: 'Notifications', icon: FiBell, action: () => console.log('Notifications clicked') },
    { id: 'help', label: 'Help & Support', icon: FiHelpCircle, action: () => console.log('Help clicked') },
    { id: 'security', label: 'Security', icon: FiShield, action: () => console.log('Security clicked') },
  ];

  /* ─── Close dropdown on outside click ───────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (item) => {
    item.action();
    setOpen(false);
  };

  return (
    <div className="relative flex items-center gap-3" ref={menuRef}>
      {/* User Info */}
      <div
        className="text-right leading-tight cursor-pointer select-none hidden sm:block"
        onClick={() => setOpen(!open)}
        role="button"
        aria-expanded={open}
      >
        <span className="block text-sm font-semibold text-white truncate max-w-24">
          {user.name}
        </span>
        <span className="block text-xs text-teal-100 font-light">
          {user.role}
        </span>
      </div>

      {/* Avatar with Status */}
      <div className="relative">
        <img
          src={user.avatar}
          alt={`${user.name} avatar`}
          className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow-md
                     hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-800
                       text-gray-800 dark:text-gray-100 rounded-xl shadow-xl z-50
                       border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* User Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={`${user.name} avatar`}
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {user.tier}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left
                      ${item.danger
                        ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${item.danger ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Session active
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileInfo;
