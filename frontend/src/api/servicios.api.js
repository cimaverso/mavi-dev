/**
 * API module para servicios
 */

import httpClient from './httpClient.js';
import { mockUpdate, mockDelete } from './mockData.js';
import ENV from '../config/env.js';

const serviciosApi = {
  /**
   * Obtener todos los servicios
   * @returns {Promise<object>} Lista de servicios
   */
  getAll: () => {
    return httpClient.get('/api/servicios');
  },

  /**
   * Obtener un servicio por ID
   * @param {number} id - ID del servicio
   * @returns {Promise<object>} Servicio
   */
  getById: (id) => {
    return httpClient.get(`/api/servicios/${id}`);
  },

  /**
   * Crear nuevo servicio
   * @param {object} data - Datos del servicio
   * @returns {Promise<object>} Servicio creado
   */
  create: (data) => {
    return httpClient.post('/api/servicios', data);
  },

  /**
   * Actualizar servicio
   * @param {number} id - ID del servicio
   * @param {object} data - Campos a actualizar
   * @returns {Promise<object>} Servicio actualizado
   */
  update: (id, data) => {
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUpdate('servicios', id, data));
        }, 300);
      });
    }

    return httpClient.patch(`/api/servicios/${id}`, data);
  },

  /**
   * Eliminar servicio
   * @param {number} id - ID del servicio
   * @returns {Promise<object>}
   */
  delete: (id) => {
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockDelete('servicios', id));
        }, 300);
      });
    }

    return httpClient.delete(`/api/servicios/${id}`);
  },

  /**
   * Obtener métricas de servicios
   * @returns {Promise<object>} Total de servicios
   */
  getMetrics: () => {
    return httpClient.get('/api/metrics/servicios');
  },
};

export default serviciosApi;