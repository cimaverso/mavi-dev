/**
 * API module para reservas
 */
import httpClient from './httpClient.js';
import ENV from '../config/env.js';

const reservasApi = {
  /**
   * Obtener reservas con filtros opcionales
   * @param {object} filters - { month: 'YYYY-MM', estado: 'PENDIENTE' }
   * @returns {Promise<object>}
   */
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.month) {
      params.append('month', filters.month);
    }
    
    if (filters.estado) {
      params.append('estado', filters.estado);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/api/reservas?${queryString}` : '/api/reservas';
    
    return httpClient.get(url);
  },

  /**
   * Obtener una reserva por ID
   * @param {number} id
   * @returns {Promise<object>}
   */
  getById: (id) => {
    return httpClient.get(`/api/reservas/${id}`);
  },

  /**
   * Actualizar estado o resolución de reserva
   * @param {number} id
   * @param {object} data - { estado?, resuelto? }
   * @returns {Promise<object>}
   */
  update: (id, data) => {
    return httpClient.patch(`/api/reservas/${id}`, data);
  },

  /**
   * Cambiar estado de reserva
   * @param {number} id
   * @param {string} nuevoEstado - PENDIENTE | CONFIRMADA | CANCELADA
   * @returns {Promise<object>}
   */
  cambiarEstado: (id, nuevoEstado) => {
    return reservasApi.update(id, { estado: nuevoEstado });
  },

  /**
   * Marcar reserva como resuelta
   * @param {number} id
   * @param {boolean} resuelto
   * @returns {Promise<object>}
   */
  marcarResuelto: (id, resuelto = true) => {
    return reservasApi.update(id, { resuelto });
  },

  /**
   * Obtener métricas de reservas
   * @returns {Promise<object>}
   */
  getMetrics: () => {
    return httpClient.get('/api/metrics/reservas');
  },
};

export default reservasApi;