/**
 * Constantes de la aplicación
 */

/**
 * Estados de reserva
 */
export const RESERVATION_STATUS = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  CANCELADA: 'CANCELADA',
};

/**
 * Opciones de estado de reserva para select
 */
export const RESERVATION_STATUS_OPTIONS = [
  { id: 'PENDIENTE', nombre: 'Pendiente', color: '#FFC107' },
  { id: 'CONFIRMADA', nombre: 'Confirmada', color: '#00E57E' },
  { id: 'CANCELADA', nombre: 'Cancelada', color: '#FF5252' },
];

/**
 * Categorías de tickets de soporte
 */
export const SUPPORT_CATEGORIES = [
  { id: 'Técnico', nombre: 'Técnico' },
  { id: 'Información', nombre: 'Información' },
  { id: 'Reclamo', nombre: 'Reclamo' },
];

/**
 * Tipos de archivo permitidos para media
 */
export const MEDIA_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  videos: ['video/mp4', 'video/quicktime'],
};

/**
 * Todos los tipos de media permitidos
 */
export const ALLOWED_MEDIA_TYPES = [
  ...MEDIA_FILE_TYPES.images,
  ...MEDIA_FILE_TYPES.videos,
];

/**
 * Extensiones permitidas para media
 */
export const MEDIA_FILE_EXTENSIONS = {
  images: ['.jpg', '.jpeg', '.png', '.webp'],
  videos: ['.mp4', '.mov'],
};

/**
 * Tamaño máximo de archivo en MB
 */
export const MAX_FILE_SIZE_MB = 10;

/**
 * Número máximo de archivos por upload
 */
export const MAX_FILES_PER_UPLOAD = 10;

/**
 * Tipos de archivo permitidos para adjuntos de soporte
 */
export const SUPPORT_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Tamaño máximo para adjuntos de soporte (5MB)
 */
export const MAX_SUPPORT_FILE_SIZE_MB = 5;

/**
 * Límites de longitud de campos
 */
export const FIELD_LIMITS = {
  embarcacion: {
    nombre: 200,
    caracteristicas: 5000,
  },
  tipo: {
    nombre: 100,
    descripcion: 1000,
  },
  proveedor: {
    nombre: 200,
    telefono: 20,
  },
  servicio: {
    nombre: 200,
  },
  support: {
    asunto: 200,
    descripcion: 2000,
  },
};

/**
 * Validación de campos numéricos
 */
export const NUMERIC_LIMITS = {
  capacidad: {
    min: 1,
    max: 999,
  },
  precio: {
    min: 0,
    max: 999999999,
  },
};

/**
 * Mensajes de confirmación
 */
export const CONFIRMATION_MESSAGES = {
  delete: '¿Estás seguro que deseas eliminar este elemento?',
  deleteEmbarcacion: '¿Estás seguro que deseas eliminar esta embarcación?',
  deleteProveedor: '¿Estás seguro que deseas eliminar este proveedor?',
  deleteServicio: '¿Estás seguro que deseas eliminar este servicio?',
  deleteReserva: '¿Estás seguro que deseas eliminar esta reserva?',
  deleteMedia: '¿Estás seguro que deseas eliminar este archivo?',
  logout: '¿Estás seguro que deseas cerrar sesión?',
};

/**
 * Mensajes de éxito
 */
export const SUCCESS_MESSAGES = {
  created: 'Creado correctamente',
  updated: 'Actualizado correctamente',
  deleted: 'Eliminado correctamente',
  saved: 'Guardado correctamente',
  uploaded: 'Archivo(s) subido(s) correctamente',
  sent: 'Enviado correctamente',
};

/**
 * Mensajes de error
 */
export const ERROR_MESSAGES = {
  generic: 'Ocurrió un error. Intenta nuevamente.',
  network: 'Error de conexión. Verifica tu internet.',
  notFound: 'No se encontró el recurso solicitado.',
  unauthorized: 'No tienes permisos para esta acción.',
  validation: 'Por favor corrige los errores del formulario.',
  fileSize: `El archivo no puede exceder ${MAX_FILE_SIZE_MB}MB`,
  fileType: 'Tipo de archivo no permitido',
};

/**
 * Debounce delay para autosave (ms)
 */
export const AUTOSAVE_DELAY = 500;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  LOGIN: '/login',
  EMBARCACIONES: '/embarcaciones',
  PROVEEDORES: '/proveedores',
  SERVICIOS: '/servicios',
  RESERVAS: '/reservas',
  SOPORTE: '/soporte',
  AGENTE: '/agente',
};

/**
 * Roles de usuario (para futuro)
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};