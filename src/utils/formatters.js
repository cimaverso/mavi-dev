/**
 * Funciones de formateo de datos
 * Para mostrar información al usuario de forma legible
 */

/**
 * Formatear número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (ISO 4217)
 * @param {string} locale - Locale para el formato
 * @returns {string} Cantidad formateada
 */
export function formatCurrency(amount, currency = 'USD', locale = 'es-CO') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatear número con separadores de miles
 * @param {number} number - Número a formatear
 * @param {number} decimals - Número de decimales
 * @returns {string} Número formateado
 */
export function formatNumber(number, decimals = 0) {
  if (number === null || number === undefined || isNaN(number)) {
    return '-';
  }
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

/**
 * Formatear fecha a formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato: 'short', 'medium', 'long'
 * @returns {string} Fecha formateada
 */
export function formatDate(date, format = 'medium') {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }
  
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'long', day: 'numeric' },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    },
  };
  
  return new Intl.DateTimeFormat('es-CO', options[format] || options.medium).format(dateObj);
}

/**
 * Formatear fecha y hora
 * @param {string|Date} datetime - Fecha/hora a formatear
 * @returns {string} Fecha y hora formateada
 */
export function formatDateTime(datetime) {
  if (!datetime) return '-';
  
  const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Formatear fecha a formato ISO (YYYY-MM-DD)
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha en formato ISO
 */
export function formatDateISO(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Formatear teléfono
 * @param {string} phone - Teléfono a formatear
 * @returns {string} Teléfono formateado
 */
export function formatPhone(phone) {
  if (!phone) return '-';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 50, suffix = '...') {
  if (!text || text.length <= maxLength) return text || '';
  
  return text.substring(0, maxLength).trim() + suffix;
}

/**
 * Capitalizar primera letra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitalizar cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalizeWords(text) {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Formatear tamaño de archivo
 * @param {number} bytes - Tamaño en bytes
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Tamaño formateado
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '-';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Formatear porcentaje
 * @param {number} value - Valor (0-1 o 0-100)
 * @param {boolean} isDecimal - Si el valor está en decimal (0-1)
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Porcentaje formateado
 */
export function formatPercentage(value, isDecimal = false, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }
  
  const percentage = isDecimal ? value * 100 : value;
  return `${formatNumber(percentage, decimals)}%`;
}

/**
 * Formatear duración en minutos a horas y minutos
 * @param {number} minutes - Minutos
 * @returns {string} Duración formateada
 */
export function formatDuration(minutes) {
  if (!minutes || minutes === 0) return '-';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  
  return `${hours}h ${mins}m`;
}

/**
 * Obtener iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales
 */
export function getInitials(name) {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Formatear mes y año desde fecha ISO
 * @param {string} isoDate - Fecha en formato YYYY-MM-DD
 * @returns {string} Mes y año (ej: "Febrero 2026")
 */
export function formatMonthYear(isoDate) {
  if (!isoDate) return '-';
  
  const date = new Date(isoDate);
  
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
  }).format(date);
}