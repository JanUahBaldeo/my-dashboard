// ========================================
// 🎯 ENHANCED HEADER COMPONENT WITH ALIASED IMPORTS
// ========================================

import { useState, useEffect } from 'react';
import { SearchBox, ProfileInfo, Breadcrumb } from '@components';
import RoleSwitcher from './RoleSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '@context/RoleContext';
import { useNotifications } from '@hooks/useNotifications';
import { FiBell, FiMenu, FiX, FiPlus, FiSettings } from 'react-icons/fi';
import styles from './Header.module.css';

const Header = () => {
  const { currentRole } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Mock user data
  const displayName = 'Demo User';
  const greeting = `Welcome back, ${displayName}`;
  const subtext = "Let's take a detailed look at your financial situation today";

  // Get current path for breadcrumb
  const currentPath = window.location.pathname.split('/').filter(Boolean);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationOpen) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);

  return (
    <header className={styles.headerGradient}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${styles.container} ${styles.fadeInUp}`}
      >
        {/* Left: Logo + Greeting */}
        <div className={styles.logoSection}>
          <img
            src="https://i.ibb.co/rK44TsnC/logo.png"
            alt="logo"
            className={styles.logo}
          />
          <div className={styles.greetingSection}>
            <h1 className={styles.titleGlow}>
              Welcome back, {displayName}!
            </h1>
            <p className={styles.subtitle}>
              Let's take a detailed look at your financial situation today
            </p>
            {/* Breadcrumb below subtitle */}
            <div className="mt-3">
              <Breadcrumb path={currentPath} />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className={styles.actionsGlassy}>
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <button
              className={styles.actionButton}
              title="Add New Lead"
              aria-label="Add New Lead"
            >
              <FiPlus className="w-4 h-4" />
            </button>
            <button
              className={styles.actionButton}
              title="Settings"
              aria-label="Settings"
            >
              <FiSettings className="w-4 h-4" />
            </button>
          </div>

                     {/* Notifications */}
           <div className={styles.notificationSection}>
             <button
               className={styles.notificationButton}
               title="Notifications"
               aria-label="Notifications"
               onClick={() => setIsNotificationOpen(!isNotificationOpen)}
             >
               <FiBell className="w-5 h-5" />
               {unreadCount > 0 && (
                 <span className={styles.notificationBadge}>
                   {unreadCount > 9 ? '9+' : unreadCount}
                 </span>
               )}
             </button>

             {/* Notifications Dropdown */}
             <AnimatePresence>
               {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={styles.notificationDropdown}
                >
                  <div className={styles.notificationHeader}>
                    <h3 className={styles.notificationTitle}>Notifications</h3>
                    <button
                      className={styles.markAllRead}
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className={styles.notificationList}>
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`${styles.notificationItem} ${notification.unread ? styles.unread : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={styles.notificationContent}>
                          <p className={styles.notificationMessage}>{notification.message}</p>
                          <span className={styles.notificationTime}>{notification.time}</span>
                        </div>
                        {notification.unread && <div className={styles.unreadDot} />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Box */}
          <SearchBox />

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Profile Info */}
          <ProfileInfo />
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.mobileMenu}
          >
            <div className={styles.mobileMenuContent}>
              <div className={styles.mobileBreadcrumb}>
                <Breadcrumb path={currentPath} />
              </div>
              <div className={styles.mobileActions}>
                <SearchBox />
                <RoleSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
