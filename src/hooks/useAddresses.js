import { useState, useCallback, useEffect } from 'react';

const BASE = '/users/me/addresses';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed: ${path}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(BASE);
      setAddresses(data.addresses ?? data.data ?? data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`${BASE}/${addressId}`);
      setAddress(data.address ?? data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(BASE, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setAddresses((prev) => [...prev, data.address ?? data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`${BASE}/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const updated = data.address ?? data;
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? updated : a))
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`${BASE}/${addressId}`, { method: 'DELETE' });
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    address,
    loading,
    error,
    fetchAddresses,
    fetchAddress,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
