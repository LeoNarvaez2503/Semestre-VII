// Utilidades del Sistema de Concesionaria
function calcularComision(ventaTotal, porcentaje) {
    return ventaTotal * (porcentaje / 100);
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD'
    }).format(precio);
}

function calcularIVA(precio, iva = 12) {
    return precio * (iva / 100);
}

function precioConIVA(precio) {
    return precio + calcularIVA(precio);
}

// Mostrar estado del sistema
const precioAuto = 25000;
const comision = calcularComision(precioAuto, 5);

document.getElementById("out").textContent = 
    `Sistema activo | Ejemplo: Auto ${formatearPrecio(precioAuto)} - Comisión vendedor: ${formatearPrecio(comision)}`;