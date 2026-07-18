import { getApiUrl } from './config';

// URL base del backend para concesionarias
const API_URL = getApiUrl('/concesionarias');

/**
 * Obtener headers de autenticación
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

/**
 * Obtener todas las concesionarias
 */
export const obtenerTodasLasConcesionarias = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Error al obtener concesionarias");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodasLasConcesionarias:", error);
    throw error;
  }
};

/**
 * Crear una nueva concesionaria
 */
export const crearConcesionaria = async (concesionaria) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(concesionaria),
    });
    if (!response.ok) {
      throw new Error("Error al crear la concesionaria");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en crearConcesionaria:", error);
    throw error;
  }
};

/**
 * Actualizar una concesionaria existente
 */
export const actualizarConcesionaria = async (id, concesionaria) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(concesionaria),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar la concesionaria");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarConcesionaria:", error);
    throw error;
  }
};

/**
 * Eliminar una concesionaria
 */
export const eliminarConcesionaria = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Error al eliminar la concesionaria");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en eliminarConcesionaria:", error);
    throw error;
  }
};
