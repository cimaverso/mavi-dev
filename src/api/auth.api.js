/**
 * API module para autenticación
 */

import httpClient from './httpClient.js';

const authApi = {
  /**
   * Login de usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<object>} Token y datos del usuario
   */
  login: (username, password) => {
    return httpClient.post('/api/auth/login', {
      username,
      password,
    });
  },

  /**
   * Logout (opcional - para cuando se implemente en backend)
   * @returns {Promise<object>}
   */
  logout: () => {
    // Por ahora solo limpiamos el cliente
    // En el futuro podría invalidar el token en el servidor
    return Promise.resolve({ success: true });
  },

  /**
   * Renovar token (para implementar en el futuro)
   * @returns {Promise<object>}
   */
  refreshToken: () => {
    return httpClient.post('/api/auth/refresh');
  },
};

export default authApi;