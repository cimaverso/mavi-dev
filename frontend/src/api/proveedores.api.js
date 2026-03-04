/**
 * API module para proveedores
 */

import httpClient from './httpClient.js';

const proveedoresApi = {

  getAll: async () => {
    const response = await httpClient.get('/api/proveedores')

    if (response.success) {
      return {
        success: true,
        data: response.data.map(p => ({
          ...p,
          id: p.prov_id,
          nombre: p.prov_nombre,
          telefono: p.prov_telefono
        }))
      }
    }

    return response
  },

  getById: (id) => {
    return httpClient.get(`/api/proveedores/${id}`);
  },

  create: (data) => {

    const payload = {
      prov_nombre: data.nombre,
      prov_telefono: data.telefono
    }

    return httpClient.post('/api/proveedores', payload);
  },

  update: (id, data) => {

    const payload = {}

    if (data.nombre !== undefined) {
      payload.prov_nombre = data.nombre
    }

    if (data.telefono !== undefined) {
      payload.prov_telefono = data.telefono
    }

    return httpClient.patch(`/api/proveedores/${id}`, payload)
  },

  delete: (id) => {
    return httpClient.delete(`/api/proveedores/${id}`);
  },

};

export default proveedoresApi;