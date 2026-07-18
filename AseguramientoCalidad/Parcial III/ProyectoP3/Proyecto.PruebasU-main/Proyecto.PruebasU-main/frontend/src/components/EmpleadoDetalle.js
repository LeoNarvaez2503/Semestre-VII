import React, { useState } from "react";
import AutosManager from "./AutosManager";
import ClientesManager from "./ClientesManager";
import VendedoresManager from "./VendedoresManager";
import ConcesionariasManager from "./ConcesionariasManager";

function EmpleadoDetalle({ detalle }) {
  const [modo, setModo] = useState("autos");

  return (
    <div className="panel">
      <h2 className="panel-title">Gestión de Concesionarias</h2>
      <p className="panel-subtitle">
        Usuario: {detalle?.nombreCompleto || "N/A"} — ID: {detalle?.id || "N/A"}
      </p>

      <nav className="panel-nav">
        <button 
          className="nav-btn" 
          onClick={() => setModo("autos")} 
          disabled={modo === "autos"}
        >
          Autos
        </button>
        <button 
          className="nav-btn" 
          onClick={() => setModo("clientes")} 
          disabled={modo === "clientes"}
        >
          Clientes
        </button>
        <button 
          className="nav-btn" 
          onClick={() => setModo("vendedores")} 
          disabled={modo === "vendedores"}
        >
          Vendedores
        </button>
        <button 
          className="nav-btn" 
          onClick={() => setModo("concesionarias")} 
          disabled={modo === "concesionarias"}
        >
          Concesionarias
        </button>
      </nav>

      {modo === "autos" && <AutosManager />}
      {modo === "clientes" && <ClientesManager />}
      {modo === "vendedores" && <VendedoresManager />}
      {modo === "concesionarias" && <ConcesionariasManager />}
    </div>
  );
}

export default EmpleadoDetalle;