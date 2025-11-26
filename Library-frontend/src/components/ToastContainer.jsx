import { useState } from 'react';
import Toast from './Toast';

let addToastFunc = null;

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  addToastFunc = (message, type, duration) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: 20 + index * 90,
            right: 20,
            zIndex: 9999,
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

export const toast = {
  success: (message, duration = 3000) => {
    if (addToastFunc) addToastFunc(message, 'success', duration);
  },
  error: (message, duration = 3000) => {
    if (addToastFunc) addToastFunc(message, 'error', duration);
  },
  info: (message, duration = 3000) => {
    if (addToastFunc) addToastFunc(message, 'info', duration);
  },
  warning: (message, duration = 3000) => {
    if (addToastFunc) addToastFunc(message, 'warning', duration);
  },
};

export default ToastContainer;