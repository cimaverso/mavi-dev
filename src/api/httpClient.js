/**
 * Cliente HTTP centralizado para todas las peticiones al API
 * Maneja autenticación, errores, timeouts y mock data
 */

import ENV from '../config/env.js';
import { getToken, clearAuth } from '../utils/auth.js';
import { MOCK_RESPONSES } from './mockData.js';

/**
 * Configuración del cliente HTTP
 */
const HTTP_CONFIG = {
  timeout: 30000, // 30 segundos
  retryAttempts: 2, // Reintentos solo para GET
  retryDelay: 1000, // 1 segundo entre reintentos
};

/**
 * Realizar petición HTTP con manejo centralizado de errores
 * @param {string} endpoint - Endpoint relativo (ej: '/embarcaciones')
 * @param {object} options - Opciones de fetch
 * @returns {Promise<object>} Respuesta parseada
 */
async function request(endpoint, options = {}) {
  // Si estamos en modo mock, retornar datos simulados
  if (ENV.USE_MOCK_DATA) {
    return mockRequest(endpoint, options.method || 'GET', options.body);
  }

  const url = ENV.getApiUrl(endpoint);
  const token = getToken();

  // Configurar headers por defecto
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agregar token si existe (excepto para login)
  if (token && !endpoint.includes('/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Configurar opciones de fetch
  const fetchOptions = {
    ...options,
    headers,
  };

  // Crear controlador de timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HTTP_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Manejar respuestas según status code
    return await handleResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);
    throw handleError(error, endpoint);
  }
}

/**
 * Manejar respuesta del servidor
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<object>} Data parseada
 */
async function handleResponse(response) {
  // Intentar parsear como JSON
  let data;
  try {
    data = await response.json();
  } catch (error) {
    // Si no es JSON, crear estructura de error
    data = {
      success: false,
      error: {
        message: 'Respuesta inválida del servidor',
        code: 'INVALID_RESPONSE',
      },
    };
  }

  // Si la respuesta es exitosa (2xx)
  if (response.ok) {
    return data;
  }

  // Manejar errores HTTP específicos
  switch (response.status) {
    case 401:
      // Token inválido o expirado - limpiar autenticación
      clearAuth();
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');

    case 403:
      throw new Error('No tienes permisos para realizar esta acción.');

    case 404:
      throw new Error(data.error?.message || 'Recurso no encontrado.');

    case 409:
      throw new Error(data.error?.message || 'El recurso ya existe.');

    case 422:
    case 400:
      // Error de validación - retornar detalles
      const validationErrors = data.error?.details || {};
      const errorMessages = Object.entries(validationErrors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n');
      throw new Error(errorMessages || data.error?.message || 'Datos inválidos.');

    case 500:
    case 502:
    case 503:
      throw new Error('Error en el servidor. Intenta nuevamente más tarde.');

    default:
      throw new Error(data.error?.message || 'Error desconocido.');
  }
}

/**
 * Manejar errores de red y otros errores
 * @param {Error} error - Error capturado
 * @param {string} endpoint - Endpoint que generó el error
 * @returns {Error} Error formateado
 */
function handleError(error, endpoint) {
  console.error(`Error en petición a ${endpoint}:`, error);

  if (error.name === 'AbortError') {
    return new Error('La petición tardó demasiado. Verifica tu conexión.');
  }

  if (error.message === 'Failed to fetch') {
    return new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
  }

  return error;
}

/**
 * Simular petición con datos mock
 * @param {string} endpoint - Endpoint
 * @param {string} method - Método HTTP
 * @param {any} body - Cuerpo de la petición
 * @returns {Promise<object>} Respuesta mock
 */
async function mockRequest(endpoint, method, body) {
  console.log(`[MOCK] ${method} ${endpoint}`, body ? JSON.parse(body) : '');

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  // Buscar respuesta mock correspondiente
  const mockResponse = MOCK_RESPONSES[endpoint]?.[method];

  if (!mockResponse) {
    console.warn(`[MOCK] No hay mock definido para ${method} ${endpoint}`);
    return {
      success: true,
      data: method === 'DELETE' ? null : [],
    };
  }

  // Si es función, ejecutarla (para POST/PATCH que necesitan el body)
  if (typeof mockResponse === 'function') {
    return mockResponse(body ? JSON.parse(body) : {});
  }

  // Retornar mock estático
  return mockResponse;
}

/**
 * Métodos HTTP
 */
const httpClient = {
  /**
   * GET request
   */
  get: (endpoint, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'GET',
    });
  },

  /**
   * POST request
   */
  post: (endpoint, data, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   */
  patch: (endpoint, data, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete: (endpoint, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },

  /**
   * POST con FormData (para uploads)
   */
  upload: (endpoint, formData, options = {}) => {
    const token = getToken();
    const url = ENV.getApiUrl(endpoint);

    // Si estamos en mock, simular upload
    if (ENV.USE_MOCK_DATA) {
      console.log('[MOCK] Upload:', endpoint, formData);
      return Promise.resolve({
        success: true,
        data: [
          { id: 1, path: 'https://mock-storage.com/image1.jpg' },
        ],
      });
    }

    // Headers para FormData (NO incluir Content-Type, el browser lo maneja)
    const headers = {};
    if (token && !endpoint.includes('/auth/login')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      ...options,
    }).then(handleResponse).catch(error => {
      throw handleError(error, endpoint);
    });
  },
};

export default httpClient;