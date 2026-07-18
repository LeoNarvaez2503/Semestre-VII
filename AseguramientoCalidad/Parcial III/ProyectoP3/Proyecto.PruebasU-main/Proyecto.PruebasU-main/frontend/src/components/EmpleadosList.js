import React from "react";

function EmpleadosList({ empleados, onEliminar, onEditar, onVer }) {
  return (
    <div>
      <h2>Empleados Registrados</h2>
      {empleados.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Horas Trabajadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.nombreCompleto}</td>
                <td>{emp.horasTrabajadas}</td>
                <td>
                  <button onClick={() => onVer(emp)}>Ver Salario</button>{" "}
                  <button onClick={() => onEditar(emp)}>Editar</button>{" "}
                  <button onClick={() => onEliminar(emp.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmpleadosList;