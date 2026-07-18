// Configuración de API para desarrollo y producción

// URL del backend en Render
const RENDER_BACKEND_URL = 'https://proyecto-pruebasu.onrender.com/api';
const LOCAL_BACKEND_URL = 'http://localhost:5000/api';

// Determinar URL base según el entorno
// Si estamos en producción (build de React), usar Render
// Si estamos en desarrollo local, se puede usar local o Render según preferencia.
// Por defecto en desarrollo usaremos Local para no afectar la DB de producción.

export const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? RENDER_BACKEND_URL
    : LOCAL_BACKEND_URL;

// Helper para construir URLs completas
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
