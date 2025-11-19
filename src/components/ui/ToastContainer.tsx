import React from 'react';
import { createPortal } from 'react-dom';
import { useToast } from './ToastContext';
import Toast from './Toast';

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: '420px' }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={hideToast} />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
