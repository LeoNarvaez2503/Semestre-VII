import { getApiUrl } from './config';

// URL base del backend para vendedores
const API_URL = getApiUrl('/vendedores');

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
 * Obtener todos los vendedores
 */
export const obtenerTodosLosVendedores = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Error al obtener vendedores");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodosLosVendedores:", error);
    throw error;
  }
};

/**
 * Crear un nuevo vendedor
 */
export const crearVendedor = async (vendedor) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(vendedor),
    });
    if (!response.ok) {
      throw new Error("Error al crear el vendedor");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en crearVendedor:", error);
    throw error;
  }
};

/**
 * Actualizar un vendedor existente
 */
export const actualizarVendedor = async (id, vendedor) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(vendedor),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el vendedor");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarVendedor:", error);
    throw error;
  }
};

/**
 * Eliminar un vendedor
 */
export const eliminarVendedor = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el vendedor");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en eliminarVendedor:", error);
    throw error;
  }
};
