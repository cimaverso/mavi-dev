import httpClient from './httpClient.js';

const typesApi = {

  getAll: async () => {

    const response = await httpClient.get('/api/tipos_embarcacion');

    if (response.success) {
      return {
        success: true,
        data: response.data.map(t => ({
          id: t.tp_id,
          nombre: t.tp_nombre,
          descripcion: t.tp_descripcion
        }))
      };
    }

    return response;
  },

  getById: (id) => {
    return httpClient.get(`/api/tipos_embarcacion/${id}`);
  },

  create: (data) => {

    const payload = {
      tp_nombre: data.nombre,
      tp_descripcion: data.descripcion
    };

    return httpClient.post('/api/tipos_embarcacion', payload);
  },

  update: (id, data) => {

    const payload = {};

    if (data.nombre !== undefined)
      payload.tp_nombre = data.nombre;

    if (data.descripcion !== undefined)
      payload.tp_descripcion = data.descripcion;

    return httpClient.patch(`/api/tipos_embarcacion/${id}`, payload);
  },

  delete: (id) => {
    return httpClient.delete(`/api/tipos_embarcacion/${id}`);
  }

};

export default typesApi;