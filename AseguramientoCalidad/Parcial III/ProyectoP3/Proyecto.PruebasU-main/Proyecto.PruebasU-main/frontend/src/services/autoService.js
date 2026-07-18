import { getApiUrl } from './config';

// URL base del backend para autos
const API_URL = getApiUrl('/autos');

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
 * Obtener todos los autos
 */
export const obtenerTodosLosAutos = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Error al obtener autos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodosLosAutos:", error);
    throw error;
  }
};

/**
 * Crear un nuevo auto
 */
export const crearAuto = async (auto) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(auto),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el auto");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en crearAuto:", error);
    throw error;
  }
};

/**
 * Actualizar un auto existente
 */
export const actualizarAuto = async (id, auto) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(auto),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar el auto");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarAuto:", error);
    throw error;
  }
};

/**
 * Eliminar un auto
 */
export const eliminarAuto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar el auto");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en eliminarAuto:", error);
    throw error;
  }
};
