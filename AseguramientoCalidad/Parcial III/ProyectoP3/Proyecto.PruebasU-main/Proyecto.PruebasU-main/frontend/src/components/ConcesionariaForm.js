import React, { useState, useEffect } from "react";

function ConcesionariaForm({ onGuardar, editConcesionaria, onCancelEdit }) {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    ciudad: "",
    gerente: "",
  });

  useEffect(() => {
    if (editConcesionaria) {
      setForm(editConcesionaria);
    }
  }, [editConcesionaria]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
    setForm({
      nombre: "",
      direccion: "",
      telefono: "",
      ciudad: "",
      gerente: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="section-heading">
        {editConcesionaria ? "Editar Concesionaria" : "Nueva Concesionaria"}
      </h2>

      <div className="form-row">
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Nombre de la concesionaria"
            value={form.nombre}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="gerente">Gerente</label>
          <input
            id="gerente"
            type="text"
            name="gerente"
            placeholder="Nombre del gerente"
            value={form.gerente}
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
            placeholder="Dirección de la sucursal"
            value={form.direccion}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn">
          {editConcesionaria ? "Actualizar" : "Guardar"}
        </button>

        {editConcesionaria && (
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

export default ConcesionariaForm;
