import React from "react";

function ClientesList({ clientes, onEliminar, onEditar }) {
  return (
    <div>
      <h2 className="section-heading">Clientes Registrados</h2>
      {clientes.length === 0 ? (
        <p className="panel-subtitle">No hay clientes registrados.</p>
      ) : (
        <div className="table-container">
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td><strong>{cliente.nombre}</strong></td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.ciudad}</td>
                  <td>{cliente.direccion}</td>
                  <td>
                    <button
                      onClick={() => onEditar(cliente)}
                      className="action-btn edit"
                      title="Editar"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onEliminar(cliente.id)}
                      className="action-btn delete"
                      title="Eliminar"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientesList;
