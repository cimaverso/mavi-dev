/**
 * Context de notificaciones Toast
 * Maneja mensajes de éxito, error, advertencia e información
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Agregar un nuevo toast
   * @param {object} toast - Configuración del toast
   * @returns {number} ID del toast creado
   */
  const addToast = useCallback((toast) => {
    const id = toastIdCounter++;
    const newToast = {
      id,
      message: toast.message || '',
      type: toast.type || 'info', // success, error, warning, info
      duration: toast.duration || 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-eliminar después de duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  /**
   * Eliminar un toast por ID
   * @param {number} id - ID del toast
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Limpiar todos los toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Mostrar toast de éxito
   * @param {string} message - Mensaje
   * @param {object} options - Opciones adicionales
   */
  const success = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'success',
      ...options,
    });
  }, [addToast]);

  /**
   * Mostrar toast de error
   * @param {string} message - Mensaje
   * @param {object} options - Opciones adicionales
   */
  const error = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'error',
      duration: 7000, // Errores duran más
      ...options,
    });
  }, [addToast]);

  /**
   * Mostrar toast de advertencia
   * @param {string} message - Mensaje
   * @param {object} options - Opciones adicionales
   */
  const warning = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'warning',
      ...options,
    });
  }, [addToast]);

  /**
   * Mostrar toast de información
   * @param {string} message - Mensaje
   * @param {object} options - Opciones adicionales
   */
  const info = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'info',
      ...options,
    });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook para usar el contexto de toasts
 * @returns {object} Contexto de toasts
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  
  return context;
}