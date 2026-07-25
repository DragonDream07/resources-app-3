import { useState, useEffect, useCallback, useRef } from 'react';

const POLL_INTERVAL_MS = 30000;

async function fetchNotifications() {
  const token = localStorage.getItem('token');
  const res = await fetch('/notifications', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

async function postMarkRead(notificationId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/notifications/${notificationId}/read`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

async function postReadAll() {
  const token = localStorage.getItem('token');
  const res = await fetch('/notifications/read-all', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to mark all notifications as read');
  return res.json();
}

export function useNotifications() {
  const [list, setList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      const notifications = data.notifications ?? data.data ?? data;
      setList(notifications);
      setUnreadCount(
        Array.isArray(notifications)
          ? notifications.filter((n) => !n.read).length
          : 0
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  const markRead = useCallback(
    async (notificationId) => {
      try {
        await postMarkRead(notificationId);
        setList((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        setError(err.message);
      }
    },
    []
  );

  const markAllRead = useCallback(async () => {
    try {
      await postReadAll();
      setList((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { list, unreadCount, markRead, markAllRead, loading, error, reload: load };
}
