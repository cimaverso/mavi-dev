/**
 * API module para tickets de soporte
 */

import httpClient from './httpClient.js';

const supportApi = {
  /**
   * Enviar ticket de soporte
   * @param {object} ticketData - Datos del ticket
   * @param {File} file - Archivo adjunto (opcional)
   * @returns {Promise<object>}
   */
  sendTicket: (ticketData, file = null) => {
    const formData = new FormData();
    
    formData.append('asunto', ticketData.asunto);
    formData.append('categoria', ticketData.categoria);
    formData.append('descripcion', ticketData.descripcion);
    
    if (file) {
      formData.append('adjunto', file);
    }

    return httpClient.upload('/api/support/tickets', formData);
  },

  /**
   * Validar datos del ticket antes de enviar
   * @param {object} ticketData - Datos a validar
   * @returns {object} { valid: boolean, errors: object }
   */
  validateTicket: (ticketData) => {
    const errors = {};

    if (!ticketData.asunto || ticketData.asunto.trim().length === 0) {
      errors.asunto = 'El asunto es requerido';
    } else if (ticketData.asunto.length > 200) {
      errors.asunto = 'El asunto no puede exceder 200 caracteres';
    }

    if (!ticketData.categoria) {
      errors.categoria = 'La categoría es requerida';
    } else if (!['Técnico', 'Información', 'Reclamo'].includes(ticketData.categoria)) {
      errors.categoria = 'Categoría inválida';
    }

    if (!ticketData.descripcion || ticketData.descripcion.trim().length < 10) {
      errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export default supportApi;