/**
 * Datos mock para desarrollo sin backend
 * Simula respuestas del API según el contrato definido
 */

/**
 * Mock data storage (simula BD en memoria)
 */
let mockDB = {
  embarcaciones: [
    {
      id: 1,
      nombre: 'Yacht Luxury Premium',
      tipo: { id: 1, nombre: 'Yate' },
      proveedor: { id: 1, nombre: 'Nautical Elite' },
      capacidad: 12,
      valorProveedor: 5000.00,
      valorCliente: 7500.00,
      caracteristicas: 'Yate de lujo con 3 camarotes, cocina completa, sistema de sonido premium y GPS navegación.',
      media: [
        { id: 1, path: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800' },
        { id: 2, path: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
      ],
    },
    {
      id: 2,
      nombre: 'Catamarán Paradise',
      tipo: { id: 2, nombre: 'Catamarán' },
      proveedor: { id: 1, nombre: 'Nautical Elite' },
      capacidad: 20,
      valorProveedor: 8000.00,
      valorCliente: 12000.00,
      caracteristicas: 'Amplio catamarán ideal para grupos grandes. Incluye trampolín, zona de snorkel y bar.',
      media: [
        { id: 3, path: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
      ],
    },
    {
      id: 3,
      nombre: 'Lancha Rápida Speed',
      tipo: { id: 3, nombre: 'Lancha' },
      proveedor: { id: 2, nombre: 'Ocean Adventures' },
      capacidad: 8,
      valorProveedor: 3000.00,
      valorCliente: 4500.00,
      caracteristicas: 'Lancha deportiva de alta velocidad. Perfecta para deportes acuáticos y paseos rápidos.',
      media: [],
    },
  ],

  tiposEmbarcacion: [
    { id: 1, nombre: 'Yate', descripcion: 'Embarcaciones de lujo para navegación y estadía prolongada' },
    { id: 2, nombre: 'Catamarán', descripcion: 'Embarcación de doble casco, muy estable' },
    { id: 3, nombre: 'Lancha', descripcion: 'Embarcación rápida para paseos cortos' },
    { id: 4, nombre: 'Velero', descripcion: 'Embarcación propulsada por viento' },
  ],

  proveedores: [
    { id: 1, nombre: 'Nautical Elite', telefono: '+573001234567' },
    { id: 2, nombre: 'Ocean Adventures', telefono: '+573009876543' },
    { id: 3, nombre: 'Caribbean Boats', telefono: '+573005551234' },
  ],

  servicios: [
    { id: 1, nombre: 'Catering Premium', precio: 2500.00 },
    { id: 2, nombre: 'Fotografía Profesional', precio: 1500.00 },
    { id: 3, nombre: 'DJ y Sonido', precio: 2000.00 },
    { id: 4, nombre: 'Decoración Temática', precio: 1800.00 },
    { id: 5, nombre: 'Snorkel Equipment', precio: 500.00 },
  ],

  reservas: [
    {
      id: 1,
      embarcacion: { id: 1, nombre: 'Yacht Luxury Premium' },
      usuario: { id: 1, nombre: 'Juan Pérez' },
      fechaReserva: '2026-02-15',
      estado: 'PENDIENTE',
      resuelto: false,
      fechaRegistro: '2026-02-01T10:30:00',
    },
    {
      id: 2,
      embarcacion: { id: 2, nombre: 'Catamarán Paradise' },
      usuario: { id: 2, nombre: 'María García' },
      fechaReserva: '2026-02-20',
      estado: 'CONFIRMADA',
      resuelto: false,
      fechaRegistro: '2026-02-03T14:20:00',
    },
    {
      id: 3,
      embarcacion: { id: 1, nombre: 'Yacht Luxury Premium' },
      usuario: { id: 3, nombre: 'Carlos Rodríguez' },
      fechaReserva: '2026-02-22',
      estado: 'PENDIENTE',
      resuelto: false,
      fechaRegistro: '2026-02-05T09:15:00',
    },
    {
      id: 4,
      embarcacion: { id: 3, nombre: 'Lancha Rápida Speed' },
      usuario: { id: 4, nombre: 'Ana Martínez' },
      fechaReserva: '2026-02-25',
      estado: 'CANCELADA',
      resuelto: true,
      fechaRegistro: '2026-01-28T16:45:00',
    },
  ],

  usuarios: [
    { id: 1, nombre: 'Admin User' },
  ],

  // Contadores para IDs autoincrementales
  nextId: {
    embarcaciones: 4,
    tiposEmbarcacion: 5,
    proveedores: 4,
    servicios: 6,
    reservas: 5,
    media: 4,
  },
};

/**
 * Helper para generar respuesta exitosa
 */
const successResponse = (data) => ({
  success: true,
  data,
});

/**
 * Helper para generar respuesta de error
 */
const errorResponse = (message, code = 'ERROR') => ({
  success: false,
  error: { message, code },
});

/**
 * Definición de respuestas mock por endpoint
 */
export const MOCK_RESPONSES = {
  // AUTH
  '/api/auth/login': {
    POST: (body) => {
      const { username, password } = body;
      
      // Validar credenciales mock
      if (username === 'admin' && password === 'admin123') {
        return successResponse({
          token: 'mock-jwt-token-12345',
          usuario: { nombre: 'Admin User' },
        });
      }
      
      return errorResponse('Credenciales inválidas', 'INVALID_CREDENTIALS');
    },
  },

  // EMBARCACIONES
  '/api/embarcaciones': {
    GET: successResponse(mockDB.embarcaciones),
    
    POST: (body) => {
      const newEmbarcacion = {
        id: mockDB.nextId.embarcaciones++,
        ...body,
        tipo: mockDB.tiposEmbarcacion.find(t => t.id === body.idTipo) || { id: body.idTipo, nombre: 'Tipo Desconocido' },
        proveedor: mockDB.proveedores.find(p => p.id === body.idProveedor) || { id: body.idProveedor, nombre: 'Proveedor Desconocido' },
        media: [],
      };
      
      mockDB.embarcaciones.push(newEmbarcacion);
      return successResponse(newEmbarcacion);
    },
  },

  // PATCH y DELETE dinámicos se manejan en mockRequest de httpClient

  // TIPOS DE EMBARCACIÓN
  '/api/tipos-embarcacion': {
    GET: successResponse(mockDB.tiposEmbarcacion),
    
    POST: (body) => {
      // Validar si ya existe
      const existe = mockDB.tiposEmbarcacion.find(
        t => t.nombre.toLowerCase() === body.nombre.toLowerCase()
      );
      
      if (existe) {
        return errorResponse('Este tipo de embarcación ya existe', 'DUPLICATE_ENTRY');
      }
      
      const newTipo = {
        id: mockDB.nextId.tiposEmbarcacion++,
        ...body,
      };
      
      mockDB.tiposEmbarcacion.push(newTipo);
      return successResponse(newTipo);
    },
  },

  // PROVEEDORES
  '/api/proveedores': {
    GET: successResponse(mockDB.proveedores),
    
    POST: (body) => {
      const newProveedor = {
        id: mockDB.nextId.proveedores++,
        ...body,
      };
      
      mockDB.proveedores.push(newProveedor);
      return successResponse(newProveedor);
    },
  },

  // SERVICIOS
  '/api/servicios': {
    GET: successResponse(mockDB.servicios),
    
    POST: (body) => {
      // Validar si ya existe
      const existe = mockDB.servicios.find(
        s => s.nombre.toLowerCase() === body.nombre.toLowerCase()
      );
      
      if (existe) {
        return errorResponse('Este servicio ya existe', 'DUPLICATE_ENTRY');
      }
      
      const newServicio = {
        id: mockDB.nextId.servicios++,
        ...body,
      };
      
      mockDB.servicios.push(newServicio);
      return successResponse(newServicio);
    },
  },

  // RESERVAS
  '/api/reservas': {
    GET: successResponse(mockDB.reservas),
    
    POST: (body) => {
      const embarcacion = mockDB.embarcaciones.find(e => e.id === body.idEmbarcacion);
      
      const newReserva = {
        id: mockDB.nextId.reservas++,
        embarcacion: embarcacion ? { id: embarcacion.id, nombre: embarcacion.nombre } : { id: body.idEmbarcacion, nombre: 'Desconocida' },
        usuario: { id: body.idUsuario || 1, nombre: 'Usuario Mock' },
        fechaReserva: body.fechaReserva,
        estado: body.estado || 'PENDIENTE',
        resuelto: false,
        fechaRegistro: new Date().toISOString(),
      };
      
      mockDB.reservas.push(newReserva);
      return successResponse(newReserva);
    },
  },

  // MÉTRICAS
  '/api/metrics/embarcaciones': {
    GET: () => {
      const total = mockDB.embarcaciones.length;
      const porTipo = {};
      
      mockDB.embarcaciones.forEach(emb => {
        const tipoNombre = emb.tipo.nombre;
        porTipo[tipoNombre] = (porTipo[tipoNombre] || 0) + 1;
      });
      
      return successResponse({
        total,
        porTipo: Object.entries(porTipo).map(([tipo, cantidad]) => ({
          tipo,
          cantidad,
        })),
      });
    },
  },

  '/api/metrics/proveedores': {
    GET: successResponse({
      total: mockDB.proveedores.length,
    }),
  },

  '/api/metrics/servicios': {
    GET: successResponse({
      total: mockDB.servicios.length,
    }),
  },

  // SOPORTE
  '/api/support/tickets': {
    POST: (body) => {
      console.log('[MOCK] Ticket enviado:', body);
      return successResponse({
        message: 'Ticket enviado correctamente. Recibirás respuesta en las próximas 24 horas.',
      });
    },
  },
};

/**
 * Helper para actualizar un item en mockDB
 * @param {string} collection - Nombre de la colección
 * @param {number} id - ID del item
 * @param {object} updates - Campos a actualizar
 */
export function mockUpdate(collection, id, updates) {
  const index = mockDB[collection].findIndex(item => item.id === id);
  
  if (index === -1) {
    return errorResponse('Recurso no encontrado', 'NOT_FOUND');
  }
  
  mockDB[collection][index] = {
    ...mockDB[collection][index],
    ...updates,
  };
  
  return successResponse(mockDB[collection][index]);
}

/**
 * Helper para eliminar un item en mockDB
 * @param {string} collection - Nombre de la colección
 * @param {number} id - ID del item
 */
export function mockDelete(collection, id) {
  const index = mockDB[collection].findIndex(item => item.id === id);
  
  if (index === -1) {
    return errorResponse('Recurso no encontrado', 'NOT_FOUND');
  }
  
  mockDB[collection].splice(index, 1);
  
  return successResponse({
    message: 'Recurso eliminado correctamente',
  });
}

/**
 * Resetear mockDB a su estado inicial (útil para testing)
 */
export function resetMockDB() {
  // Implementar reset si es necesario en el futuro
  console.log('Mock DB reseteada');
}