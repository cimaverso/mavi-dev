/**
 * Cliente HTTP centralizado para todas las peticiones al API
 * Maneja autenticación, errores y timeouts
 */

import ENV from '../config/env.js';
import { getToken, clearAuth } from '../utils/auth.js';

const HTTP_CONFIG = {
  timeout: 30000,
};

async function request(endpoint, options = {}) {
  const url = ENV.getApiUrl(endpoint);
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HTTP_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return await handleResponse(response);

  } catch (error) {
    clearTimeout(timeoutId);
    throw handleError(error, endpoint);
  }
}

async function handleResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('Respuesta inválida del servidor');
  }


  if (response.ok) {
    return {
      success: true,
      data: data,
    };
  }


  switch (response.status) {

    case 401:
      clearAuth();
      throw new Error('Sesión expirada. Inicia sesión nuevamente.');

    case 403:
      throw new Error('No tienes permisos.');

    case 404:
      throw new Error('Recurso no encontrado.');

    case 400:
    case 422: {
      let message = 'Datos inválidos.';

      if (Array.isArray(data?.detail)) {
        message = data.detail.map(e => e.msg).join(', ');
      } else if (typeof data?.detail === 'string') {
        message = data.detail;
      }

      throw new Error(message);
    }

    case 500:
      throw new Error('Error interno del servidor.');

    default:
      throw new Error('Error desconocido.');
  }
}

function handleError(error, endpoint) {
  console.error(`Error en ${endpoint}:`, error);

  if (error.name === 'AbortError') {
    return new Error('La petición tardó demasiado.');
  }

  if (error.message === 'Failed to fetch') {
    return new Error('No se pudo conectar al servidor.');
  }

  return error;
}

const httpClient = {

  get: (endpoint, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'GET',
    }),

  post: (endpoint, data, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (endpoint, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'DELETE',
    }),

  upload: (endpoint, formData, options = {}) => {

    const token = getToken();
    const url = ENV.getApiUrl(endpoint);

    const headers = {};

    if (token && !endpoint.includes('/auth/login')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      ...options,
    })
      .then(handleResponse)
      .catch(error => {
        throw handleError(error, endpoint);
      });
  },
};

export default httpClient;