/**
 * Funciones de validación para formularios
 * Retornan mensaje de error o null si es válido
 */

/**
 * Validar que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @param {string} fieldName - Nombre del campo para el mensaje
 * @returns {string|null} Mensaje de error o null
 */
export function validateRequired(value, fieldName = 'Este campo') {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} es requerido`;
  }
  return null;
}

/**
 * Validar longitud mínima
 * @param {string} value - Valor a validar
 * @param {number} min - Longitud mínima
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null}
 */
export function validateMinLength(value, min, fieldName = 'Este campo') {
  if (value && value.length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  return null;
}

/**
 * Validar longitud máxima
 * @param {string} value - Valor a validar
 * @param {number} max - Longitud máxima
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null}
 */
export function validateMaxLength(value, max, fieldName = 'Este campo') {
  if (value && value.length > max) {
    return `${fieldName} no puede exceder ${max} caracteres`;
  }
  return null;
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {string|null}
 */
export function validateEmail(email) {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return null;
}

/**
 * Validar teléfono (formato internacional)
 * @param {string} phone - Teléfono a validar
 * @returns {string|null}
 */
export function validatePhone(phone) {
  if (!phone) return null;
  
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
    return 'Teléfono inválido (use formato internacional)';
  }
  return null;
}

/**
 * Validar número
 * @param {any} value - Valor a validar
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null}
 */
export function validateNumber(value, fieldName = 'Este campo') {
  if (value === '' || value === null || value === undefined) return null;
  
  if (isNaN(value)) {
    return `${fieldName} debe ser un número`;
  }
  return null;
}

/**
 * Validar rango numérico
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null}
 */
export function validateRange(value, min, max, fieldName = 'Este campo') {
  if (value === '' || value === null || value === undefined) return null;
  
  const num = Number(value);
  if (num < min || num > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }
  return null;
}

/**
 * Validar número positivo
 * @param {number} value - Valor a validar
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null}
 */
export function validatePositive(value, fieldName = 'Este campo') {
  if (value === '' || value === null || value === undefined) return null;
  
  const num = Number(value);
  if (num < 0) {
    return `${fieldName} debe ser positivo`;
  }
  return null;
}

/**
 * Validar fecha (no puede ser pasada)
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null}
 */
export function validateFutureDate(date, fieldName = 'La fecha') {
  if (!date) return null;
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return `${fieldName} no puede ser una fecha pasada`;
  }
  return null;
}

/**
 * Validar formato de fecha
 * @param {string} date - Fecha a validar
 * @returns {string|null}
 */
export function validateDateFormat(date) {
  if (!date) return null;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return 'Formato de fecha inválido (use YYYY-MM-DD)';
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  return null;
}

/**
 * Validar archivo
 * @param {File} file - Archivo a validar
 * @param {string[]} allowedTypes - Tipos MIME permitidos
 * @param {number} maxSizeMB - Tamaño máximo en MB
 * @returns {string|null}
 */
export function validateFile(file, allowedTypes = [], maxSizeMB = 10) {
  if (!file) return null;
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`;
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `El archivo no puede exceder ${maxSizeMB}MB`;
  }
  
  return null;
}

/**
 * Validar múltiples archivos
 * @param {FileList|File[]} files - Archivos a validar
 * @param {number} maxFiles - Número máximo de archivos
 * @param {string[]} allowedTypes - Tipos MIME permitidos
 * @param {number} maxSizeMB - Tamaño máximo por archivo
 * @returns {string|null}
 */
export function validateMultipleFiles(files, maxFiles = 10, allowedTypes = [], maxSizeMB = 10) {
  if (!files || files.length === 0) return null;
  
  if (files.length > maxFiles) {
    return `No puede subir más de ${maxFiles} archivos`;
  }
  
  for (let i = 0; i < files.length; i++) {
    const error = validateFile(files[i], allowedTypes, maxSizeMB);
    if (error) return error;
  }
  
  return null;
}

/**
 * Validar que un valor sea único en una lista
 * @param {any} value - Valor a validar
 * @param {any[]} list - Lista existente
 * @param {string} key - Propiedad a comparar (si son objetos)
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null}
 */
export function validateUnique(value, list, key = null, fieldName = 'Este valor') {
  if (!value || !list || list.length === 0) return null;
  
  const normalizedValue = typeof value === 'string' ? value.toLowerCase().trim() : value;
  
  const exists = list.some(item => {
    const itemValue = key ? item[key] : item;
    const normalizedItem = typeof itemValue === 'string' ? itemValue.toLowerCase().trim() : itemValue;
    return normalizedItem === normalizedValue;
  });
  
  if (exists) {
    return `${fieldName} ya existe`;
  }
  
  return null;
}

/**
 * Validar comparación entre dos valores
 * @param {number} value1 - Primer valor
 * @param {number} value2 - Segundo valor
 * @param {string} operator - Operador: 'gt', 'gte', 'lt', 'lte', 'eq'
 * @param {string} message - Mensaje de error personalizado
 * @returns {string|null}
 */
export function validateComparison(value1, value2, operator, message) {
  if (value1 === '' || value1 === null || value1 === undefined) return null;
  if (value2 === '' || value2 === null || value2 === undefined) return null;
  
  const num1 = Number(value1);
  const num2 = Number(value2);
  
  let valid = false;
  
  switch (operator) {
    case 'gt':
      valid = num1 > num2;
      break;
    case 'gte':
      valid = num1 >= num2;
      break;
    case 'lt':
      valid = num1 < num2;
      break;
    case 'lte':
      valid = num1 <= num2;
      break;
    case 'eq':
      valid = num1 === num2;
      break;
    default:
      return null;
  }
  
  return valid ? null : message;
}

/**
 * Validar objeto completo con múltiples reglas
 * @param {object} data - Datos a validar
 * @param {object} rules - Reglas de validación
 * @returns {object} Objeto con errores por campo
 */
export function validateObject(data, rules) {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
}