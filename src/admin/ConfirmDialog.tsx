import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
}

type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFunction | null>(null);

export const useConfirm = (): ConfirmFunction => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a <ConfirmProvider>');
  }
  return ctx;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
  }>({
    isOpen: false,
    options: { message: '' },
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialogState({ isOpen: true, options });
    });
  }, []);

  const handleClose = (confirmed: boolean) => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(confirmed);
      resolverRef.current = null;
    }
  };

  useEffect(() => {
    if (!dialogState.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogState.isOpen]);

  const { options } = dialogState;
  const variant = options.variant || 'danger';

  const variantConfig = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
      iconBg: 'bg-rose-100 border-rose-200',
      confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20 focus:ring-rose-500',
      defaultTitle: 'Are you sure?',
      defaultConfirm: 'Delete',
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-100 border-amber-200',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20 focus:ring-amber-500',
      defaultTitle: 'Confirm Action',
      defaultConfirm: 'Confirm',
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-100 border-emerald-200',
      confirmBtn: 'bg-[#00a859] hover:bg-[#00c968] text-white shadow-emerald-900/20 focus:ring-emerald-500',
      defaultTitle: 'Confirm Approval',
      defaultConfirm: 'Confirm',
    },
  }[variant];

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {dialogState.isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => handleClose(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header with icon & close */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${variantConfig.iconBg}`}>
                  {variantConfig.icon}
                </div>
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-display text-lg font-bold text-gray-900">
                  {options.title || variantConfig.defaultTitle}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {options.message}
                </p>
              </div>
            </div>

            {/* Actions footer */}
            <div className="p-4 sm:p-6 pt-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                {options.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => handleClose(true)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all focus:outline-none focus:ring-2 ${variantConfig.confirmBtn}`}
              >
                {options.confirmText || variantConfig.defaultConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
