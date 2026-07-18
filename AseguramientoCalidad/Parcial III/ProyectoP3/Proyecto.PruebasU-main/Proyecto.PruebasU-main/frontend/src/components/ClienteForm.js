import React, { useState, useEffect } from "react";

function ClienteForm({ onGuardar, editCliente, onCancelEdit }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
  });

  useEffect(() => {
    if (editCliente) {
      setForm(editCliente);
    }
  }, [editCliente]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
    setForm({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="section-heading">
        {editCliente ? "Editar Cliente" : "Nuevo Cliente"}
      </h2>

      <div className="form-row">
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="tel"
            name="telefono"
            placeholder="+593..."
            value={form.telefono}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="ciudad">Ciudad</label>
          <input
            id="ciudad"
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
      </div>

      <div className="form-row">
        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            type="text"
            name="direccion"
            placeholder="Dirección completa"
            value={form.direccion}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn">
          {editCliente ? "Actualizar" : "Guardar"}
        </button>

        {editCliente && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ClienteForm;
