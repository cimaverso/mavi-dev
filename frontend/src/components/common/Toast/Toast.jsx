import React from 'react';
/**
 * Componente Toast individual
 * Muestra notificaciones temporales
 */

import { useToast } from '../../../context/ToastContext.jsx';
import './Toast.css';

function Toast({ id, message, type = 'info' }) {
  const { removeToast } = useToast();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="bi bi-check-circle-fill"></i>;
      case 'error':
        return <i className="bi bi-x-circle-fill"></i>;
      case 'warning':
        return <i className="bi bi-exclamation-triangle-fill"></i>;
      case 'info':
      default:
        return <i className="bi bi-info-circle-fill"></i>;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button
        type="button"
        className="toast-close"
        onClick={() => removeToast(id)}
        aria-label="Cerrar notificación"
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}

export default Toast;