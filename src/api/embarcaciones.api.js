/**
 * API module para embarcaciones
 */

import httpClient from './httpClient.js';
import { mockUpdate, mockDelete } from './mockData.js';
import ENV from '../config/env.js';

const embarcacionesApi = {
  /**
   * Obtener todas las embarcaciones
   * @returns {Promise<object>} Lista de embarcaciones
   */
  getAll: () => {
    return httpClient.get('/api/embarcaciones');
  },

  /**
   * Obtener una embarcación por ID
   * @param {number} id - ID de la embarcación
   * @returns {Promise<object>} Embarcación
   */
  getById: (id) => {
    return httpClient.get(`/api/embarcaciones/${id}`);
  },

  /**
   * Crear nueva embarcación
   * @param {object} data - Datos de la embarcación
   * @returns {Promise<object>} Embarcación creada
   */
  create: (data) => {
    return httpClient.post('/api/embarcaciones', data);
  },

  /**
   * Actualizar embarcación (para autosave)
   * @param {number} id - ID de la embarcación
   * @param {object} data - Campos a actualizar
   * @returns {Promise<object>} Embarcación actualizada
   */
  update: (id, data) => {
    // Si estamos en mock, usar helper de mockData
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUpdate('embarcaciones', id, data));
        }, 300);
      });
    }

    return httpClient.patch(`/api/embarcaciones/${id}`, data);
  },

  /**
   * Eliminar embarcación
   * @param {number} id - ID de la embarcación
   * @returns {Promise<object>}
   */
  delete: (id) => {
    // Si estamos en mock, usar helper de mockData
    if (ENV.USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockDelete('embarcaciones', id));
        }, 300);
      });
    }

    return httpClient.delete(`/api/embarcaciones/${id}`);
  },

  /**
   * Subir media (fotos/videos) para una embarcación
   * @param {number} id - ID de la embarcación
   * @param {File[]} files - Archivos a subir
   * @returns {Promise<object>} URLs de los archivos subidos
   */
  uploadMedia: (id, files) => {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    return httpClient.upload(`/api/embarcaciones/${id}/media`, formData);
  },

  /**
   * Eliminar un archivo media
   * @param {number} mediaId - ID del archivo media
   * @returns {Promise<object>}
   */
  deleteMedia: (mediaId) => {
    return httpClient.delete(`/api/embarcaciones/media/${mediaId}`);
  },

  /**
   * Obtener métricas de embarcaciones
   * @returns {Promise<object>} Total y por tipo
   */
  getMetrics: () => {
    return httpClient.get('/api/metrics/embarcaciones');
  },
};

export default embarcacionesApi;