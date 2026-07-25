import { useState, useCallback, useEffect } from 'react';

async function apiFetch(path) {
  const token = localStorage.getItem('token');
  const res = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed: ${path}`);
  }
  return res.json();
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/orders', window.location.origin);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
      });
      const data = await apiFetch(url.pathname + url.search);
      setOrders(data.orders ?? data.data ?? data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}`);
      setOrder(data.order ?? data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTimeline = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}/timeline`);
      setTimeline(data.timeline ?? data.data ?? data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTracking = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}/tracking`);
      setTracking(data.tracking ?? data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Cancel failed');
      }
      return res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    order,
    timeline,
    tracking,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    fetchTimeline,
    fetchTracking,
    cancelOrder,
  };
}
