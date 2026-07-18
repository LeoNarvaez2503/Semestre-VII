import React, { useState, useEffect } from "react";
import {
  obtenerTodosLosAutos,
  crearAuto,
  actualizarAuto,
  eliminarAuto,
} from "../services/autoService";

const marcasComunes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan",
  "Volkswagen", "Hyundai", "Kia", "BMW", "Mercedes-Benz", "Audi"
];

const modelosPorMarca = {
  Toyota: ["Corolla", "Camry", "RAV4", "Hilux"],
  Honda: ["Civic", "Accord", "CR-V"],
  Ford: ["Fiesta", "Focus", "Mustang", "Explorer"],
  Chevrolet: ["Spark", "Cruze", "Camaro", "Trailblazer"],
  Nissan: ["Sentra", "Altima", "Qashqai"],
  Volkswagen: ["Golf", "Polo", "Jetta", "Tiguan"],
  Hyundai: ["Accent", "Elantra", "Tucson"],
  Kia: ["Rio", "Sportage", "Sorento"],
  BMW: ["3 Series", "5 Series", "X3"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLA"],
  Audi: ["A3", "A4", "Q5"]
};

const coloresComunes = [
  { name: "Negro", hex: "#000000" },
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Rojo", hex: "#FF0000" },
  { name: "Azul", hex: "#0000FF" },
  { name: "Gris", hex: "#6B7280" },
  { name: "Plata", hex: "#C0C0C0" },
  { name: "Verde", hex: "#10B981" },
  { name: "Amarillo", hex: "#F59E0B" }
];

function nombreAHex(name) {
  const found = coloresComunes.find(c => c.name === name);
  return found ? found.hex : "";
}

function hexParaNombre(hex) {
  if (!hex) return "";
  const found = coloresComunes.find(
    c => c.hex.toLowerCase() === String(hex).toLowerCase() ||
      c.name.toLowerCase() === String(hex).toLowerCase()
  );
  return found ? found.name : "";
}

function AutosManager() {
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: null,
    marca: "",
    modelo: "",
    anio: "",
    color: "",
    numeroSerie: "",
  });

  useEffect(() => {
    cargarAutos();
  }, []);

  const cargarAutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodosLosAutos();
      const norm = (item) => ({
        ...item,
        anio: item.anio ?? item["año"] ?? item.year ?? "",
        numeroSerie: (item.numeroSerie ?? item.placa ?? "").toString().toUpperCase(),
        color: hexParaNombre(item.color) || (item.color || ""),
      });
      setAutos(Array.isArray(data) ? data.map(norm) : []);
    } catch (err) {
      setError(err.message || "Error al cargar autos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ id: null, marca: "", modelo: "", anio: "", color: "", numeroSerie: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "marca") {
      setForm(f => ({ ...f, marca: value, modelo: "" }));
    } else if (name === "numeroSerie") {
      setForm(f => ({ ...f, numeroSerie: (value || "").toString().toUpperCase() }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const anioNum = Number(form.anio);
    if (Number.isNaN(anioNum) || anioNum < 1900) {
      setError("El año debe ser un número válido y como mínimo 1900");
      return;
    }
    if (!form.modelo) {
      setError("Selecciona un modelo válido para la marca seleccionada");
      return;
    }

    try {
      const payload = {
        marca: form.marca,
        modelo: form.modelo,
        año: anioNum,
        color: form.color,
        numeroSerie: (form.numeroSerie || "").toString().toUpperCase(),
      };

      if (form.id) {
        await actualizarAuto(form.id, payload);
      } else {
        await crearAuto(payload);
      }

      resetForm();
      await cargarAutos();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  };

  const handleEdit = (auto) => {
    setForm({
      id: auto.id ?? auto._id ?? null,
      marca: auto.marca ?? "",
      modelo: auto.modelo ?? "",
      anio: auto.anio ?? auto["año"] ?? "",
      color: hexParaNombre(auto.color) || (auto.color ?? ""),
      numeroSerie: (auto.numeroSerie ?? auto.placa ?? "").toString().toUpperCase(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este auto?")) return;
    setError(null);
    try {
      await eliminarAuto(id);
      await cargarAutos();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  return (
    <div>
      <section className="panel-section">
        <h3 className="section-heading">{form.id ? "Editar Auto" : "Crear Auto"}</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="marca">Marca:</label>
            <select id="marca" className="input select" name="marca" value={form.marca} onChange={handleChange} required>
              <option value="">-- Selecciona una marca --</option>
              {marcasComunes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="modelo">Modelo:</label>
            <select id="modelo" className="input select" name="modelo" value={form.modelo} onChange={handleChange} required>
              <option value="">-- Selecciona un modelo --</option>
              {(modelosPorMarca[form.marca] || []).map(mod => <option key={mod} value={mod}>{mod}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="anio">Año:</label>
            <input id="anio" className="input" name="anio" type="number" min="1900" value={form.anio} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label htmlFor="color">Color:</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select id="color" className="input select" name="color" value={form.color} onChange={handleChange}>
                <option value="">-- Selecciona un color --</option>
                {coloresComunes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <div aria-hidden style={{
                width: 20, height: 20, borderRadius: 4, border: "1px solid #e6e9ef",
                background: nombreAHex(form.color) || "transparent"
              }} />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="numeroSerie">Número de Serie / Placa:</label>
            <input id="numeroSerie" className="input" name="numeroSerie" value={form.numeroSerie} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">{form.id ? "Actualizar" : "Crear"}</button>
            <button className="btn secondary" type="button" onClick={resetForm}>Limpiar</button>
          </div>
        </form>
      </section>

      <section className="panel-section">
        <h3 className="section-heading">Listado de Autos</h3>
        {loading ? <p>Cargando...</p> : autos.length === 0 ? <p>No hay autos registrados.</p> : (
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Color</th><th>N.º Serie / Placa</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {autos.map(a => (
                <tr key={a.id ?? a._id}>
                  <td>{a.id ?? a._id}</td>
                  <td>{a.marca}</td>
                  <td>{a.modelo}</td>
                  <td>{a.anio}</td>
                  <td>{a.color}</td>
                  <td>{(a.numeroSerie || "").toString().toUpperCase()}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEdit(a)}>Editar</button>
                    <button className="action-btn delete" onClick={() => handleDelete(a.id ?? a._id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AutosManager;
