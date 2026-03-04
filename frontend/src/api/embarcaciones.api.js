/**
 * API module para embarcaciones
 */

import httpClient from './httpClient.js';

const embarcacionesApi = {

  // Obtener todas
  getAll: async () => {

    const response = await httpClient.get('/api/embarcaciones')

    if (response.success) {
      return {
        success: true,
        data: response.data.map(e => ({
          ...e,
          id: e.emb_id,
          nombre: e.emb_nombre,
          tipoId: e.emb_idtipo,
          proveedorId: e.emb_idproveedor,
          capacidad: e.emb_capacidad,
          valorProveedor: e.emb_valorproveedor,
          valorCliente: e.emb_valorclientefinal,
          caracteristicas: e.emb_caracteristicas
        }))
      }
    }

    return response
  },

  // Obtener por ID
  getById: (id) => {
    return httpClient.get(`/api/embarcaciones/${id}`)
  },

  // Crear
  create: (data) => {

    const payload = {
      emb_nombre: data.nombre,
      emb_idtipo: data.tipoId,
      emb_idproveedor: data.proveedorId,
      emb_capacidad: data.capacidad,
      emb_valorproveedor: data.valorProveedor,
      valorCliente: data.valorClienteFinal,
      emb_caracteristicas: data.caracteristicas
    }

    return httpClient.post('/api/embarcaciones', payload)
  },

  // Actualizar
  update: (id, data) => {

    const payload = {}

    if (data.nombre !== undefined)
      payload.emb_nombre = data.nombre

    if (data.tipoId !== undefined)
      payload.emb_idtipo = data.tipoId

    if (data.proveedorId !== undefined)
      payload.emb_idproveedor = data.proveedorId

    if (data.capacidad !== undefined)
      payload.emb_capacidad = data.capacidad

    if (data.valorProveedor !== undefined)
      payload.emb_valorproveedor = data.valorProveedor

    if (data.valorCliente !== undefined)
      payload.emb_valorclientefinal = data.valorClienteFinal

    if (data.caracteristicas !== undefined)
      payload.emb_caracteristicas = data.caracteristicas

    return httpClient.patch(`/api/embarcaciones/${id}`, payload)
  },

  // Eliminar
  delete: (id) => {
    return httpClient.delete(`/api/embarcaciones/${id}`)
  }

}

export default embarcacionesApi;