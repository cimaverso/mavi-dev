/**
 * API module para proveedores
 */

import httpClient from './httpClient.js';
import { mockUpdate, mockDelete } from './mockData.js';
import ENV from '../config/env.js';

const proveedoresApi = {
  /**
   * Obtener todos los proveedores
   * @returns {Promise<object>} Lista de proveedores
   */
  getAll: () => {
    return httpClient.get('/api/proveedores');
  },

  /**
   * Obtener un proveedor por ID
   * @param {number} id - ID del proveedor
   * @returns {Promise<object>} Proveedor
   */
  getById: (id) => {
    return httpClient.get(`/api/proveedores/${id}`);
  },

  /**
   * Crear nuevo proveedor
   * @param {object} data - Datos del proveedor
   * @returns {Promise<object>} Proveedor creado
   */
  create: (data) => {
    return httpClient.post('/api/proveedores', data);
  },

  /**
   * Actualizar proveedor
   * @param {number} id - ID del proveedor
   * @param {object} data - Campos a actualizar
   * @returns {Promise<object>} Proveedor actualizado
   */
  update: (id, data) => {
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUpdate('proveedores', id, data));
        }, 300);
      });
    }

    return httpClient.patch(`/api/proveedores/${id}`, data);
  },

  /**
   * Eliminar proveedor
   * @param {number} id - ID del proveedor
   * @returns {Promise<object>}
   */
  delete: (id) => {
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockDelete('proveedores', id));
        }, 300);
      });
    }

    return httpClient.delete(`/api/proveedores/${id}`);
  },

  /**
   * Obtener métricas de proveedores
   * @returns {Promise<object>} Total de proveedores
   */
  getMetrics: () => {
    return httpClient.get('/api/metrics/proveedores');
  },
};

export default proveedoresApi;