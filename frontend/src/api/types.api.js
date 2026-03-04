/**
 * API module para tipos de embarcación
 */

import httpClient from './httpClient.js';
import { mockUpdate, mockDelete } from './mockData.js';
import ENV from '../config/env.js';

const typesApi = {
  /**
   * Obtener todos los tipos de embarcación
   * @returns {Promise<object>} Lista de tipos
   */
  getAll: () => {
    return httpClient.get('/api/tipos-embarcacion');
  },

  /**
   * Obtener un tipo por ID
   * @param {number} id - ID del tipo
   * @returns {Promise<object>} Tipo de embarcación
   */
  getById: (id) => {
    return httpClient.get(`/api/tipos-embarcacion/${id}`);
  },

  /**
   * Crear nuevo tipo de embarcación
   * @param {object} data - Datos del tipo
   * @returns {Promise<object>} Tipo creado
   */
  create: (data) => {
    return httpClient.post('/api/tipos-embarcacion', data);
  },

  /**
   * Actualizar tipo de embarcación
   * @param {number} id - ID del tipo
   * @param {object} data - Campos a actualizar
   * @returns {Promise<object>} Tipo actualizado
   */
  update: (id, data) => {
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUpdate('tiposEmbarcacion', id, data));
        }, 300);
      });
    }

    return httpClient.patch(`/api/tipos-embarcacion/${id}`, data);
  },

  /**
   * Eliminar tipo de embarcación
   * @param {number} id - ID del tipo
   * @returns {Promise<object>}
   */
  delete: (id) => {
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockDelete('tiposEmbarcacion', id));
        }, 300);
      });
    }

    return httpClient.delete(`/api/tipos-embarcacion/${id}`);
  },
};

export default typesApi;