/**
 * API module para tipos de embarcación
 */

import httpClient from './httpClient.js';

const typesApi = {
  getAll: () => {
    return httpClient.get('/api/tipos-embarcacion');
  },

  getById: (id) => {
    return httpClient.get(`/api/tipos-embarcacion/${id}`);
  },

  create: (data) => {
    return httpClient.post('/api/tipos-embarcacion', data);
  },

  update: (id, data) => {
    return httpClient.patch(`/api/tipos-embarcacion/${id}`, data);
  },

  delete: (id) => {
    return httpClient.delete(`/api/tipos-embarcacion/${id}`);
  },
};

export default typesApi;