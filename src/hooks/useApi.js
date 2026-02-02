/**
 * Hook personalizado para llamadas API
 * Maneja estados de loading, error y data automáticamente
 */

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Hook para manejar llamadas API con estados
 * @param {Function} apiFunction - Función que hace la petición
 * @param {object} options - Opciones de configuración
 * @returns {object} Estado de la petición
 */
export function useApi(apiFunction, options = {}) {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operación exitosa',
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  /**
   * Ejecutar la función API
   */
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);

      if (response.success) {
        setData(response.data);

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(response.data);
        }

        return { success: true, data: response.data };
      } else {
        const errorMessage = response.error?.message || 'Error en la operación';
        setError(errorMessage);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(errorMessage);
        }

        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, toast]);

  /**
   * Reset del estado
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Ejecutar automáticamente si immediate = true
   */
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook especializado para operaciones CRUD
 * Incluye estados separados para cada operación
 */
export function useCrud(apiModule) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar todos los items
   */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.getAll();
      
      if (response.success) {
        setItems(response.data);
        return { success: true, data: response.data };
      }

      setError(response.error?.message);
      return { success: false, error: response.error?.message };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [apiModule, toast]);

  /**
   * Crear nuevo item
   */
  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.create(data);
      
      if (response.success) {
        setItems((prev) => [...prev, response.data]);
        toast.success('Creado correctamente');
        return { success: true, data: response.data };
      }

      setError(response.error?.message);
      toast.error(response.error?.message || 'Error al crear');
      return { success: false, error: response.error?.message };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [apiModule, toast]);

  /**
   * Actualizar item existente
   */
  const update = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.update(id, data);
      
      if (response.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
        toast.success('Actualizado correctamente');
        return { success: true, data: response.data };
      }

      setError(response.error?.message);
      toast.error(response.error?.message || 'Error al actualizar');
      return { success: false, error: response.error?.message };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [apiModule, toast]);

  /**
   * Eliminar item
   */
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.delete(id);
      
      if (response.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success('Eliminado correctamente');
        return { success: true };
      }

      setError(response.error?.message);
      toast.error(response.error?.message || 'Error al eliminar');
      return { success: false, error: response.error?.message };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [apiModule, toast]);

  return {
    items,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    setItems,
  };
}