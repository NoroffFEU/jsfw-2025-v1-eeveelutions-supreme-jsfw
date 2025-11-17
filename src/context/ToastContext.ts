import { createContext, useContext } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastOptions {
  message: string;
  type?: ToastType;
}

export interface ToastContextValue {
  showToast: (options: ToastOptions | string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
