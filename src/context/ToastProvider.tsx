import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';
import { ToastContext, type ToastOptions, type ToastType } from './ToastContext';

interface ToastStateItem {
  id: number;
  message: string;
  type: ToastType;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastStateItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((options: ToastOptions | string, maybeType?: ToastType) => {
    const toastData: ToastStateItem = typeof options === 'string'
      ? { id: Date.now(), message: options, type: maybeType ?? 'success' }
      : { id: Date.now(), message: options.message, type: options.type ?? 'success' };

    setToasts((current) => [...current, toastData]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
