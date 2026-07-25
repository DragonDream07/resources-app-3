import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Auth Context
// ---------------------------------------------------------------------------
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);

  const login = useCallback((userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', accessToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  const value = useMemo(
    () => ({ user, token, login, logout, isAuthenticated: Boolean(token) }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// ---------------------------------------------------------------------------
// Cart Context
// ---------------------------------------------------------------------------
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => localStorage.getItem('cart_id') || null);
  const [cartCount, setCartCount] = useState(0);

  const initCart = useCallback((id) => {
    setCartId(id);
    localStorage.setItem('cart_id', id);
  }, []);

  const updateCartCount = useCallback((count) => {
    setCartCount(count);
  }, []);

  const clearCart = useCallback(() => {
    setCartId(null);
    setCartCount(0);
    localStorage.removeItem('cart_id');
  }, []);

  const value = useMemo(
    () => ({ cartId, cartCount, initCart, updateCartCount, clearCart }),
    [cartId, cartCount, initCart, updateCartCount, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

// ---------------------------------------------------------------------------
// Notifications Context
// ---------------------------------------------------------------------------
export const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const setAll = useCallback((items) => {
    setNotifications(items);
    setUnreadCount(items.filter((n) => !n.read).length);
  }, []);

  const value = useMemo(
    () => ({ notifications, unreadCount, addNotification, markRead, markAllRead, setAll }),
    [notifications, unreadCount, addNotification, markRead, markAllRead, setAll]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

// ---------------------------------------------------------------------------
// Root App
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <Routes>
              {/* Routes will be added by individual screen work items */}
              <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-gray-500">Loading…</div>} />
            </Routes>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
