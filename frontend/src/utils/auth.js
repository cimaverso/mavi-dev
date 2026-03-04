/**
 * Utilidades para manejo de autenticación
 * Token JWT, localStorage, login/logout
 */

const AUTH_KEYS = {
  TOKEN: 'cimaverso_auth_token',
  USER: 'cimaverso_user_data',
};

/**
 * Guardar token y datos de usuario en localStorage
 * @param {string} token - JWT token
 * @param {object} usuario - Datos del usuario
 */
export function saveAuth(token, usuario) {
  try {
    localStorage.setItem(AUTH_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(usuario));
  } catch (error) {
    console.error('Error guardando autenticación:', error);
  }
}

/**
 * Obtener token del localStorage
 * @returns {string|null} Token o null si no existe
 */
export function getToken() {
  try {
    return localStorage.getItem(AUTH_KEYS.TOKEN);
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
}

/**
 * Obtener datos del usuario del localStorage
 * @returns {object|null} Datos del usuario o null si no existe
 */
export function getUser() {
  try {
    const userData = localStorage.getItem(AUTH_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error obteniendo datos de usuario:', error);
    return null;
  }
}

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean} true si está autenticado
 */
export function isAuthenticated() {
  const token = getToken();
  return token !== null && token !== '';
}

/**
 * Limpiar toda la información de autenticación
 */
export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);
  } catch (error) {
    console.error('Error limpiando autenticación:', error);
  }
}

/**
 * Verificar si el token está expirado (solo si es JWT válido)
 * NOTA: Esta es una verificación básica del lado del cliente
 * El servidor SIEMPRE debe validar el token
 * @returns {boolean} true si está expirado o inválido
 */
export function isTokenExpired() {
  const token = getToken();
  
  if (!token) {
    return true;
  }

  try {
    // Decodificar JWT (formato: header.payload.signature)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verificar si tiene campo 'exp' (expiration time en segundos)
    if (!payload.exp) {
      // Si no tiene expiración, asumir que es válido
      return false;
    }
    
    // Comparar con tiempo actual
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    // Si no se puede decodificar, asumir que está expirado
    console.error('Error decodificando token:', error);
    return true;
  }
}

/**
 * Obtener información del payload del token sin verificar firma
 * ADVERTENCIA: Esto es solo para mostrar información, NO para validación de seguridad
 * @returns {object|null} Payload del token o null
 */
export function getTokenPayload() {
  const token = getToken();
  
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

/**
 * Validar formato de token JWT básico
 * @param {string} token - Token a validar
 * @returns {boolean} true si tiene formato válido
 */
export function isValidJWTFormat(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // JWT debe tener 3 partes separadas por puntos
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * Renovar sesión (para implementar en el futuro)
 * @returns {Promise<boolean>} true si se renovó exitosamente
 */
export async function renewSession() {
  // TODO: Implementar endpoint de renovación de token en backend
  // Por ahora solo verificamos si está autenticado
  return isAuthenticated() && !isTokenExpired();
}

/**
 * Hook para verificar autenticación antes de renderizar
 * Retorna función para usar en componentes
 */
export function createAuthGuard(redirectTo = '/login') {
  return () => {
    if (!isAuthenticated()) {
      window.location.href = redirectTo;
      return false;
    }
    
    if (isTokenExpired()) {
      clearAuth();
      window.location.href = redirectTo;
      return false;
    }
    
    return true;
  };
}