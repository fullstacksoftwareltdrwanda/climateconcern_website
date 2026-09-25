import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

const DURATION = 4000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, variant: ToastVariant) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => remove(id), DURATION);
  }, [remove]);

  const value: ToastContextValue = {
    success: (msg) => add(msg, 'success'),
    error: (msg) => add(msg, 'error'),
    info: (msg) => add(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Stack — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const variantStyles: Record<ToastVariant, { bar: string; icon: React.ReactNode; label: string }> = {
  success: {
    bar: 'bg-[#00a859]',
    icon: <CheckCircle2 className="w-5 h-5 text-[#00a859]" />,
    label: 'Success',
  },
  error: {
    bar: 'bg-rose-500',
    icon: <XCircle className="w-5 h-5 text-rose-500" />,
    label: 'Error',
  },
  info: {
    bar: 'bg-blue-500',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    label: 'Info',
  },
};

const ToastCard: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const { bar, icon, label } = variantStyles[toast.variant];

  return (
    <div
      className={`pointer-events-auto w-[340px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Left accent bar */}
      <div className={`w-1 shrink-0 ${bar}`} />

      {/* Content */}
      <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
        <div className="shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 mb-0.5">{label}</p>
          <p className="text-xs text-gray-600 leading-relaxed break-words">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <style>{`
        @keyframes cc-toast-shrink { from { width: 100%; } to { width: 0%; } }
        .cc-toast-progress { animation: cc-toast-shrink ${DURATION}ms linear forwards; }
      `}</style>
      <div className="absolute bottom-0 left-1 right-0 h-0.5 bg-gray-100">
        <div className={`h-full cc-toast-progress ${bar} opacity-40`} />
      </div>
    </div>
  );
};
