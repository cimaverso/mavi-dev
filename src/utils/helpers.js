/**
 * Funciones helper generales
 * Utilidades varias para la aplicación
 */

/**
 * Generar ID único
 * @returns {string} ID único
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Delay asíncrono
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copiar texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} true si tuvo éxito
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error('Error copiando al portapapeles:', error);
    return false;
  }
}

/**
 * Descargar archivo desde URL
 * @param {string} url - URL del archivo
 * @param {string} filename - Nombre del archivo
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convertir File a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} String base64
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Crear URL de preview para archivo
 * @param {File} file - Archivo
 * @returns {string} URL de preview
 */
export function createFilePreviewURL(file) {
  return URL.createObjectURL(file);
}

/**
 * Liberar URL de preview
 * @param {string} url - URL a liberar
 */
export function revokeFilePreviewURL(url) {
  URL.revokeObjectURL(url);
}

/**
 * Verificar si un archivo es imagen
 * @param {File} file - Archivo a verificar
 * @returns {boolean} true si es imagen
 */
export function isImageFile(file) {
  return file && file.type.startsWith('image/');
}

/**
 * Verificar si un archivo es video
 * @param {File} file - Archivo a verificar
 * @returns {boolean} true si es video
 */
export function isVideoFile(file) {
  return file && file.type.startsWith('video/');
}

/**
 * Ordenar array de objetos por propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad por la cual ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export function sortByKey(array, key, order = 'asc') {
  if (!array || array.length === 0) return [];
  
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filtrar array de objetos por término de búsqueda
 * @param {Array} array - Array a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @param {string[]} keys - Propiedades a buscar
 * @returns {Array} Array filtrado
 */
export function filterBySearch(array, searchTerm, keys) {
  if (!searchTerm || searchTerm.trim() === '') return array;
  if (!array || array.length === 0) return [];
  
  const term = searchTerm.toLowerCase().trim();
  
  return array.filter(item => {
    return keys.some(key => {
      const value = getNestedValue(item, key);
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
}

/**
 * Obtener valor anidado de un objeto
 * @param {object} obj - Objeto
 * @param {string} path - Ruta (ej: 'tipo.nombre')
 * @returns {any} Valor
 */
export function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Agrupar array por propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} key - Propiedad por la cual agrupar
 * @returns {object} Objeto agrupado
 */
export function groupBy(array, key) {
  if (!array || array.length === 0) return {};
  
  return array.reduce((result, item) => {
    const groupKey = getNestedValue(item, key);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Eliminar duplicados de array
 * @param {Array} array - Array con posibles duplicados
 * @param {string} key - Propiedad para comparar (si son objetos)
 * @returns {Array} Array sin duplicados
 */
export function removeDuplicates(array, key = null) {
  if (!array || array.length === 0) return [];
  
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = getNestedValue(item, key);
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
}

/**
 * Combinar arrays sin duplicados
 * @param {...Array} arrays - Arrays a combinar
 * @returns {Array} Array combinado sin duplicados
 */
export function mergeUnique(...arrays) {
  return [...new Set(arrays.flat())];
}

/**
 * Chunk array (dividir en grupos)
 * @param {Array} array - Array a dividir
 * @param {number} size - Tamaño de cada chunk
 * @returns {Array} Array de arrays
 */
export function chunkArray(array, size) {
  if (!array || array.length === 0) return [];
  
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Verificar si un objeto está vacío
 * @param {object} obj - Objeto a verificar
 * @returns {boolean} true si está vacío
 */
export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Deep clone de objeto
 * @param {any} obj - Objeto a clonar
 * @returns {any} Clon profundo
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Obtener query params de URL
 * @returns {object} Query params
 */
export function getQueryParams() {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);
  
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Construir query string desde objeto
 * @param {object} params - Parámetros
 * @returns {string} Query string
 */
export function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Scroll suave hacia elemento
 * @param {string} elementId - ID del elemento
 * @param {number} offset - Offset en píxeles
 */
export function scrollToElement(elementId, offset = 0) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

/**
 * Scroll al inicio de la página
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/**
 * Detectar si el usuario está en mobile
 * @returns {boolean} true si es mobile
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Obtener mes actual en formato YYYY-MM
 * @returns {string} Mes actual
 */
export function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Obtener primer y último día del mes
 * @param {string} monthStr - Mes en formato YYYY-MM
 * @returns {object} { firstDay, lastDay } en formato Date
 */
export function getMonthRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  return { firstDay, lastDay };
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
export function escapeHtml(text) {
  if (!text) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Generar color aleatorio hex
 * @returns {string} Color hex
 */
export function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Calcular diferencia en días entre dos fechas
 * @param {Date|string} date1 - Primera fecha
 * @param {Date|string} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export function daysDifference(date1, date2) {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Throttle function
 * @param {Function} func - Función a throttle
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función throttled
 */
export function throttle(func, wait) {
  let timeout;
  let previous = 0;
  
  return function executedFunction(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}