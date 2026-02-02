import React from 'react';
/**
 * Contenedor de toasts
 * Renderiza todos los toasts activos
 */

import { useToast } from '../../../context/ToastContext.jsx';
import Toast from './Toast.jsx';
import './ToastContainer.css';

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

export default ToastContainer;