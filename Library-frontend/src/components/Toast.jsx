import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      default:
        return '✅';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'info':
        return '#00c6fb';
      case 'warning':
        return '#ff9800';
      default:
        return '#4caf50';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${getColor()}`,
        borderRadius: 15,
        padding: '16px 24px',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: `0 4px 20px ${getColor()}40`,
        zIndex: 9999,
        minWidth: 300,
        maxWidth: 500,
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: 24 }}>{getIcon()}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: 20,
          cursor: 'pointer',
          padding: 0,
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.target.style.opacity = 1)}
        onMouseOut={(e) => (e.target.style.opacity = 0.7)}
      >
        ×
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;