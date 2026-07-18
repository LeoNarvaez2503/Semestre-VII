import { getApiUrl } from './config';

// URL base del backend para clientes
const API_URL = getApiUrl('/clientes');

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
 * Obtener todos los clientes
 */
export const obtenerTodosLosClientes = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al obtener clientes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodosLosClientes:", error);
    throw error;
  }
};

/**
 * Crear un nuevo cliente
 */
export const crearCliente = async (cliente) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(cliente),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al crear el cliente");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en crearCliente:", error);
    throw error;
  }
};

/**
 * Actualizar un cliente existente
 */
export const actualizarCliente = async (id, cliente) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(cliente),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al actualizar el cliente");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarCliente:", error);
    throw error;
  }
};

/**
 * Eliminar un cliente
 */
export const eliminarCliente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al eliminar el cliente");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en eliminarCliente:", error);
    throw error;
  }
};
