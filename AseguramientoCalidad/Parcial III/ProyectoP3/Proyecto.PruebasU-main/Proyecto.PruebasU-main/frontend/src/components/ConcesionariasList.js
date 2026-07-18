import React from "react";

function ConcesionariasList({ concesionarias, onEliminar, onEditar }) {
  return (
    <div>
      <h2 className="section-heading">Concesionarias Registradas</h2>
      {concesionarias.length === 0 ? (
        <p className="panel-subtitle">No hay concesionarias registradas.</p>
      ) : (
        <div className="table-container">
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Teléfono</th>
                <th>Gerente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {concesionarias.map((concesionaria) => (
                <tr key={concesionaria.id}>
                  <td>{concesionaria.id}</td>
                  <td><strong>{concesionaria.nombre}</strong></td>
                  <td>{concesionaria.direccion}</td>
                  <td>{concesionaria.ciudad}</td>
                  <td>{concesionaria.telefono}</td>
                  <td>{concesionaria.gerente}</td>
                  <td>
                    <button
                      onClick={() => onEditar(concesionaria)}
                      className="action-btn edit"
                      title="Editar"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onEliminar(concesionaria.id)}
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

export default ConcesionariasList;
