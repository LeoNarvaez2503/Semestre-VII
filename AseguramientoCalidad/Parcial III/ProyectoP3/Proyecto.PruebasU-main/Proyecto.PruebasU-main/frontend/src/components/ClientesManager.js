import React, { useState, useEffect } from "react";
import {
  obtenerTodosLosClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../services/clienteService";

function ClientesManager() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Unificado en un solo estado, igual que VendedoresManager
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodosLosClientes();
      // El backend puede devolver { message: "...", clientes: [...] } o array directo
      if (data.clientes && Array.isArray(data.clientes)) {
        setClientes(data.clientes);
      } else if (Array.isArray(data)) {
        setClientes(data);
      } else {
        setClientes([]);
      }
    } catch (err) {
      setError(err.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
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

    // Validación básica
    if (!form.nombre || !form.email || !form.telefono || !form.direccion || !form.ciudad) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        ciudad: form.ciudad,
      };

      if (form.id) {
        await actualizarCliente(form.id, payload);
      } else {
        await crearCliente(payload);
      }

      resetForm();
      await cargarClientes();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  };

  const handleEdit = (cliente) => {
    setForm({
      id: cliente.id ?? cliente._id,
      nombre: cliente.nombre ?? "",
      email: cliente.email ?? "",
      telefono: cliente.telefono ?? "",
      direccion: cliente.direccion ?? "",
      ciudad: cliente.ciudad ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    setError(null);
    try {
      await eliminarCliente(id);
      await cargarClientes();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  return (
    <div>
      {/* Formulario Section */}
      <section className="panel-section">
        <h3 className="section-heading">
          {form.id ? "Editar Cliente" : "Crear Cliente"}
        </h3>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                id="nombre"
                className="input"
                name="nombre"
                type="text"
                placeholder="Ej: Juan Pérez"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
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
                placeholder="Ej: 0991234567"
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
                placeholder="Ej: Quito"
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
                placeholder="Dirección completa"
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
        <h3 className="section-heading">Listado de Clientes</h3>

        {loading ? (
          <p>Cargando...</p>
        ) : clientes.length === 0 ? (
          <p>No hay clientes registrados.</p>
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
                {clientes.map((c) => (
                  <tr key={c.id ?? c._id}>
                    <td>{c.id ?? c._id}</td>
                    <td><strong>{c.nombre}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.telefono}</td>
                    <td>{c.ciudad}</td>
                    <td>{c.direccion}</td>
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

export default ClientesManager;
