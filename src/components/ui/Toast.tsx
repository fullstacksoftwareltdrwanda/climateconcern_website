import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 max-w-md z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 flex items-start gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 pr-2">
          <h4 className="text-sm font-bold text-gray-900">Message Sent Successfully</h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
