import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token);
  const isGuest = user?.role === 'guest';
  const isAdmin = user?.role === 'admin';

  const persistToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(newToken);
  }, []);

  const persistUser = useCallback((newUser) => {
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(newUser);
  }, []);

  const login = useCallback((newToken, newUser) => {
    persistToken(newToken);
    persistUser(newUser);
    setError(null);
  }, [persistToken, persistUser]);

  const logout = useCallback(() => {
    persistToken(null);
    persistUser(null);
    setError(null);
  }, [persistToken, persistUser]);

  const updateUser = useCallback((updatedUser) => {
    persistUser(updatedUser);
  }, [persistUser]);

  const setGuestToken = useCallback((newToken, guestUser) => {
    persistToken(newToken);
    persistUser({ ...guestUser, role: 'guest' });
    setError(null);
  }, [persistToken, persistUser]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);

  const value = {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isGuest,
    isAdmin,
    login,
    logout,
    updateUser,
    setGuestToken,
    setLoading,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
