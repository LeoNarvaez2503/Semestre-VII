// URL base del backend
const API_URL = "http://localhost:3000/api/obreros";

// Servicio para manejar todas las peticiones relacionadas con empleados

/**
 * Obtener todos los empleados
 */
export const obtenerTodosLosEmpleados = async () => {
  try {
    const response = await fetch(API_URL); // Llamada a la API
    if (!response.ok) {
      throw new Error("Error al obtener empleados");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodosLosEmpleados:", error);
    throw error;
  }
};

/**
 * Obtener un empleado por ID
 */
export const obtenerEmpleadoPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el empleado");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerEmpleadoPorId:", error);
    throw error;
  }
};

/**
 * Crear un nuevo empleado
 */
export const crearEmpleado = async (empleado) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleado),
    });
    if (!response.ok) {
      throw new Error("Error al crear el empleado");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en crearEmpleado:", error);
    throw error;
  }
};

/**
 * Actualizar un empleado existente
 */
export const actualizarEmpleado = async (id, empleado) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleado),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el empleado");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarEmpleado:", error);
    throw error;
  }
};

/**
 * Eliminar un empleado
 */
export const eliminarEmpleado = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el empleado");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en eliminarEmpleado:", error);
    throw error;
  }
};

/**
 * Obtener el detalle del salario de un empleado
 */
export const obtenerSalarioEmpleado = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/salario`);
    if (!response.ok) {
      throw new Error("Error al calcular el salario");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerSalarioEmpleado:", error);
    throw error;
  }
};
