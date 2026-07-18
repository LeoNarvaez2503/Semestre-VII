// Servicio para interactuar con el endpoint de ventas del backend
const API_VENTAS = "http://localhost:3000/api/ventas";

export const procesarVentas = async (ventas) => {
  try {
    const response = await fetch(API_VENTAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ventas }),
    });
    if (!response.ok) throw new Error("Error al procesar ventas");
    return await response.json();
  } catch (error) {
    console.error("ventaService.procesarVentas:", error);
    throw error;
  }
};
