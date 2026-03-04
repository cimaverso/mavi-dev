/**
 * Configuración centralizada de variables de entorno
 * Lee variables desde .env usando el prefijo VITE_
 */

const ENV = {
  // URL base del API de FastAPI
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  // Modo de desarrollo con datos mock
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  
  // Entorno actual
  ENV: import.meta.env.VITE_ENV || 'development',
  
  // Validar si estamos en desarrollo
  isDevelopment() {
    return this.ENV === 'development';
  },
  
  // Validar si estamos en producción
  isProduction() {
    return this.ENV === 'production';
  },
  
  // Obtener URL completa de un endpoint
  getApiUrl(endpoint) {
    // Remover slash inicial del endpoint si existe
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    // Remover slash final de API_URL si existe
    const cleanBaseUrl = this.API_URL.endsWith('/') ? this.API_URL.slice(0, -1) : this.API_URL;
    
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  },
  
  // Validar que las variables necesarias existen
  validate() {
    const required = ['API_URL'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      console.error('Variables de entorno faltantes:', missing);
      throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
    }
    
    console.log('Configuracion de entorno validada:', {
      API_URL: this.API_URL,
      USE_MOCK_DATA: this.USE_MOCK_DATA,
      ENV: this.ENV
    });
  }
};

// Validar configuración al importar el módulo
ENV.validate();

export default ENV;