/**
 * Hook para debounce de valores
 * Útil para autosave y búsquedas
 */

import { useState, useEffect } from 'react';

/**
 * Hook que retorna un valor debounced
 * @param {any} value - Valor a debounce
 * @param {number} delay - Delay en milisegundos
 * @returns {any} Valor debounced
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para debounce de funciones
 * @param {Function} callback - Función a ejecutar
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} Función debounced
 */
export function useDebouncedCallback(callback, delay = 500) {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
}