import React from "react";

function VentasResultado({ resultado }) {
  if (!resultado) return null;

  // Mostrar N y CN según la especificación original
  const N = resultado.N ?? resultado.ventasProcesadas ?? 0;
  const CN = resultado.CN ?? N;

  return (
    <div style={{ marginTop: "1.5rem", background: "#f2f2f2", padding: "1rem", borderRadius: 6 }}>
      <h3>Resultado del Procesamiento de Ventas</h3>
      <p><b>N (Número de ventas):</b> {N}</p>
      <p><b>CN (Contador de ventas procesadas):</b> {CN}</p>
      <p><b>Ventas &gt; $1000 (A):</b> {resultado.A} — Total: ${resultado.T1}</p>
      <p><b>Ventas &gt; $500 y ≤ $1000 (B):</b> {resultado.B} — Total: ${resultado.T2}</p>
      <p><b>Ventas ≤ $500 (C):</b> {resultado.C} — Total: ${resultado.T3}</p>
      <h4><b>Total General (TT):</b> ${resultado.TT}</h4>
    </div>
  );
}

export default VentasResultado;
