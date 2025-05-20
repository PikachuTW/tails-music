import React, { useEffect } from 'react';

export interface ToastInfo {
  message: string;
  type: 'alert-success' | 'alert-error' | 'alert-info' | 'alert-warning';
  id: number; // Used as a key to re-trigger animation or effect for same message
}

interface ToastDisplayProps {
  toast: ToastInfo | null;
  onDismiss: () => void;
}

const ToastDisplay: React.FC<ToastDisplayProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) {
    return null;
  }

  return (
    <div className="toast toast-center" key={toast.id}>
      <div className={`alert ${toast.type} shadow-lg`}>
        <div>
          <span>{toast.message}</span>
        </div>
      </div>
    </div>
  );
};

export default ToastDisplay; 