import { useContext, useCallback } from 'react';
import { ToastContext } from '@/context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, toasts } = context;

  const toast = useCallback(
    (message, options = {}) => {
      const { type = 'info', duration = 4000, title = '' } = options;
      addToast({ message, type, duration, title });
    },
    [addToast]
  );

  const success = useCallback(
    (message, options = {}) => toast(message, { ...options, type: 'success' }),
    [toast]
  );

  const error = useCallback(
    (message, options = {}) => toast(message, { ...options, type: 'error' }),
    [toast]
  );

  const warning = useCallback(
    (message, options = {}) => toast(message, { ...options, type: 'warning' }),
    [toast]
  );

  const info = useCallback(
    (message, options = {}) => toast(message, { ...options, type: 'info' }),
    [toast]
  );

  return { toast, success, error, warning, info, removeToast, toasts };
}
