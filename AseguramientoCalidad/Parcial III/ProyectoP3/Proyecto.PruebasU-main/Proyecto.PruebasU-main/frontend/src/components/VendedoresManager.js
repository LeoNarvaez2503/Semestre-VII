import React, { useState, useEffect } from "react";
import {
  obtenerTodosLosVendedores,
  crearVendedor,
  actualizarVendedor,
  eliminarVendedor,
} from "../services/vendedorService";

function VendedoresManager() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    telefono: "",
    comision: "",
    codigoEmpleado: "",
  });

  useEffect(() => {
    cargarVendedores();
  }, []);

  const cargarVendedores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodosLosVendedores();
      setVendedores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar vendedores");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", email: "", telefono: "", comision: "", codigoEmpleado: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "codigoEmpleado") {
      setForm(f => ({ ...f, [name]: value.toUpperCase() }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.telefono || !form.comision || !form.codigoEmpleado) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        telefono: form.telefono,
        comision: form.comision,
        codigoEmpleado: form.codigoEmpleado.toUpperCase(),
      };

      if (form.id) {
        await actualizarVendedor(form.id, payload);
      } else {
        await crearVendedor(payload);
      }

      resetForm();
      await cargarVendedores();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  };

  const handleEdit = (vendedor) => {
    setForm({
      id: vendedor.id ?? vendedor._id ?? null,
      name: vendedor.name ?? "",
      email: vendedor.email ?? "",
      telefono: vendedor.telefono ?? "",
      comision: vendedor.comision ?? "",
      codigoEmpleado: vendedor.codigoEmpleado ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este vendedor?")) return;
    setError(null);
    try {
      await eliminarVendedor(id);
      await cargarVendedores();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  return (
    <div>
      <section className="panel-section">
        <h3 className="section-heading">
          {form.id ? "Editar Vendedor" : "Crear Vendedor"}
        </h3>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label htmlFor="name">Nombre Completo</label>
              <input
                id="name"
                className="input"
                name="name"
                type="text"
                placeholder="Nombre del vendedor"
                value={form.name}
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
                type="text"
                placeholder="Ej: 0991234567"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="comision">Comisión (%)</label>
              <input
                id="comision"
                className="input"
                name="comision"
                type="text"
                placeholder="Ej: 10"
                value={form.comision}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="codigoEmpleado">Código Empleado</label>
              <input
                id="codigoEmpleado"
                className="input"
                name="codigoEmpleado"
                type="text"
                placeholder="Ej: EMP-001"
                value={form.codigoEmpleado}
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

      <section className="panel-section">
        <h3 className="section-heading">Listado de Vendedores</h3>

        {loading ? (
          <p>Cargando...</p>
        ) : vendedores.length === 0 ? (
          <p>No hay vendedores registrados.</p>
        ) : (
          <div className="table-container">
            <table className="panel-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Comisión</th>
                  <th>Cód. Empleado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vendedores.map((v) => (
                  <tr key={v.id ?? v._id}>
                    <td>{v.id ?? v._id}</td>
                    <td><strong>{v.name}</strong></td>
                    <td>{v.email}</td>
                    <td>{v.telefono}</td>
                    <td>{v.comision}%</td>
                    <td>
                      <span style={{
                        background: '#e0e7ff',
                        color: '#4338ca',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {v.codigoEmpleado}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(v)}
                        title="Editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(v.id ?? v._id)}
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

export default VendedoresManager;
