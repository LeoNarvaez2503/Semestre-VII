import { getApiUrl } from './config';

const API_URL = getApiUrl('/auth');

/**
 * Login de usuario
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Error al hacer login");
    }

    const data = await response.json();
    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener perfil");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getProfile:", error);
    throw error;
  }
};

/**
 * Logout - eliminar token
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

/**
 * Obtener usuario actual del localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Obtener token actual
 */
export const getToken = () => {
  return localStorage.getItem("token");
};
