import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, token } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const computeUnreadCount = useCallback((list) => {
    return list.filter((n) => !n.readAt && !n.read_at).length;
  }, []);

  const setNotificationList = useCallback((list) => {
    setNotifications(list);
    setUnreadCount(computeUnreadCount(list));
  }, [computeUnreadCount]);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      setUnreadCount(computeUnreadCount(updated));
      return updated;
    });
  }, [computeUnreadCount]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notificationId ? { ...n, read_at: new Date().toISOString(), readAt: new Date().toISOString() } : n
      );
      setUnreadCount(computeUnreadCount(updated));
      return updated;
    });
  }, [computeUnreadCount]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({
        ...n,
        read_at: n.read_at || new Date().toISOString(),
        readAt: n.readAt || new Date().toISOString(),
      }));
      setUnreadCount(0);
      return updated;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      clearNotifications();
    }
  }, [isAuthenticated, clearNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    setNotificationList,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    setLoading,
    setError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
