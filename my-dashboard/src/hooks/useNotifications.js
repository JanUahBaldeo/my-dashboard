// ========================================
// 🎯 NOTIFICATIONS HOOK
// ========================================

import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'New lead assigned',
      time: '2m ago',
      unread: true,
      type: 'lead',
      priority: 'high',
    },
    {
      id: 2,
      message: 'Document review required',
      time: '15m ago',
      unread: true,
      type: 'document',
      priority: 'medium',
    },
    {
      id: 3,
      message: 'Pipeline updated',
      time: '1h ago',
      unread: false,
      type: 'pipeline',
      priority: 'low',
    },
    {
      id: 4,
      message: 'Meeting reminder',
      time: '30m ago',
      unread: true,
      type: 'meeting',
      priority: 'high',
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n),
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false })),
    );
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      unread: true,
      time: 'Just now',
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
  };
};
