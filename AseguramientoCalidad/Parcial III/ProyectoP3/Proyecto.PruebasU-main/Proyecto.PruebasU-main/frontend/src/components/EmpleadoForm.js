import React, { useState, useEffect } from "react";

// Componente funcional del formulario
function EmpleadoForm({ onGuardar, editEmpleado, onCancelEdit }) {
  const [form, setForm] = useState({
    nombreCompleto: "",
    horasTrabajadas: "",
  });

  useEffect(() => {
    if (editEmpleado) {
      setForm(editEmpleado);
    }
  }, [editEmpleado]);

  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: las horas no pueden ser negativas
    if (Number(form.horasTrabajadas) < 0) {
      alert("Las horas trabajadas deben ser positivas");
      return;
    }

    // Envía los datos
    onGuardar({
      nombreCompleto: form.nombreCompleto,
      horasTrabajadas: Number(form.horasTrabajadas),
    });

    // Limpia el formulario
    setForm({ nombreCompleto: "", horasTrabajadas: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editEmpleado ? "Editar Empleado" : "Nuevo Empleado"}</h2>
      <input
        type="text"
        name="nombreCompleto"
        placeholder="Nombre Completo"
        value={form.nombreCompleto}
        onChange={handleChange}
        required
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <input
        type="number"
        name="horasTrabajadas"
        placeholder="Horas Trabajadas"
        value={form.horasTrabajadas}
        onChange={handleChange}
        required
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button type="submit">{editEmpleado ? "Actualizar" : "Guardar"}</button>

      {editEmpleado && (
        <button
          type="button"
          onClick={onCancelEdit}
          style={{ marginLeft: "10px" }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

// Exportar el componente
export default EmpleadoForm;