import React, { useState, useEffect } from "react";
import {
  obtenerTodasLasConcesionarias,
  crearConcesionaria,
  actualizarConcesionaria,
  eliminarConcesionaria,
} from "../services/concesionariaService";

function ConcesionariasManager() {
  const [concesionarias, setConcesionarias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Unificado en un solo estado form
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    direccion: "",
    telefono: "",
    ciudad: "",
    gerente: "",
  });

  useEffect(() => {
    cargarConcesionarias();
  }, []);

  const cargarConcesionarias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodasLasConcesionarias();
      setConcesionarias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar concesionarias");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nombre: "",
      direccion: "",
      telefono: "",
      ciudad: "",
      gerente: "",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación básica de campos requeridos
    if (!form.nombre || !form.direccion || !form.telefono || !form.ciudad || !form.gerente) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      const payload = {
        nombre: form.nombre,
        direccion: form.direccion,
        telefono: form.telefono,
        ciudad: form.ciudad,
        gerente: form.gerente,
      };

      if (form.id) {
        await actualizarConcesionaria(form.id, payload);
      } else {
        await crearConcesionaria(payload);
      }

      resetForm();
      await cargarConcesionarias();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  };

  const handleEdit = (concesionaria) => {
    setForm({
      id: concesionaria.id ?? concesionaria._id,
      nombre: concesionaria.nombre ?? "",
      direccion: concesionaria.direccion ?? "",
      telefono: concesionaria.telefono ?? "",
      ciudad: concesionaria.ciudad ?? "",
      gerente: concesionaria.gerente ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta concesionaria?")) return;
    setError(null);
    try {
      await eliminarConcesionaria(id);
      await cargarConcesionarias();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  return (
    <div>
      {/* Formulario Section */}
      <section className="panel-section">
        <h3 className="section-heading">
          {form.id ? "Editar Concesionaria" : "Crear Concesionaria"}
        </h3>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                className="input"
                name="nombre"
                type="text"
                placeholder="Nombre de la concesionaria"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="gerente">Gerente</label>
              <input
                id="gerente"
                className="input"
                name="gerente"
                type="text"
                placeholder="Nombre del gerente"
                value={form.gerente}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                className="input"
                name="telefono"
                type="tel"
                placeholder="Ej: 022123456"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="ciudad">Ciudad</label>
              <input
                id="ciudad"
                className="input"
                name="ciudad"
                type="text"
                placeholder="Ej: Ambato"
                value={form.ciudad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                className="input"
                name="direccion"
                type="text"
                placeholder="Dirección de la sucursal"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">
              {form.id ? "Actualizar" : "Crear"}
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={resetForm}
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      {/* Lista Section */}
      <section className="panel-section">
        <h3 className="section-heading">Concesionarias Registradas</h3>

        {loading ? (
          <p>Cargando...</p>
        ) : concesionarias.length === 0 ? (
          <p>No hay concesionarias registradas.</p>
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
                {concesionarias.map((c) => (
                  <tr key={c.id ?? c._id}>
                    <td>{c.id ?? c._id}</td>
                    <td><strong>{c.nombre}</strong></td>
                    <td>{c.direccion}</td>
                    <td>{c.ciudad}</td>
                    <td>{c.telefono}</td>
                    <td>{c.gerente}</td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(c)}
                        title="Editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(c.id ?? c._id)}
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
      </section>
    </div>
  );
}

export default ConcesionariasManager;
