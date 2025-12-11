import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

const CapacitacionManagement = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [misCapacitaciones, setMisCapacitaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id: null,
    tema: "",
    fecha: "",
    encargado: "",
    estado: "programada",
    usuarios: [],
  });

  // === Fetch data desde backend ===
  const fetchCapacitaciones = async () => {
    try {
      const res = await axios.get("http://localhost:3000/capacitaciones");
      setCapacitaciones(res.data);
    } catch (err) {
      console.error("❌ Error al cargar capacitaciones:", err.response?.data || err.message || err);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/usuarios");
      // 🔹 Filtramos usuarios con rol != 2 (excluimos programadores)
      const filtrados = res.data.filter((u) => u.rol !== 2);
      setUsuarios(filtrados);
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err.response?.data || err.message || err);
    }
  };

  const fetchMisCapacitaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/capacitaciones/mis-capacitaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisCapacitaciones(res.data);
    } catch (err) {
      console.error("❌ Error al cargar mis capacitaciones:", err.response?.data || err.message || err);
    }
  };

  useEffect(() => {
    fetchCapacitaciones();
    fetchUsuarios();
    fetchMisCapacitaciones();
  }, []);

  // === CRUD ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, estado: "programada" };

      if (form.id) {
        await axios.put(`http://localhost:3000/capacitaciones/${form.id}`, data);
        console.log(" Capacitación actualizada:", data);
      } else {
        await axios.post("http://localhost:3000/capacitaciones", data);
        console.log(" Capacitación creada:", data);
      }

      setForm({
        id: null,
        tema: "",
        fecha: "",
        encargado: "",
        estado: "programada",
        usuarios: [],
      });
      fetchCapacitaciones();
    } catch (err) {
      console.error("❌ Error al guardar capacitación:", err.response?.data || err.message || err);
    }
  };

  const handleEdit = (c) => {
    setForm({
      id: c.id,
      tema: c.tema,
      fecha: c.fecha.split("T")[0],
      encargado: c.encargado,
      estado: c.estado,
      usuarios: c.usuarios.map((u) => u.id_usuario),
    });
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:3000/capacitaciones/${id}/estado`, { estado: nuevoEstado });
      console.log(`🔄 Capacitación ${id} -> ${nuevoEstado}`);
      fetchCapacitaciones();
    } catch (err) {
      console.error(`❌ Error al cambiar estado capacitación ${id}:`, err.response?.data || err.message || err);
    }
  };

  const marcarAsistencia = async (capacitacionId, asistio) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/capacitaciones/${capacitacionId}/asistencia`,
        { asistio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMisCapacitaciones();
    } catch (err) {
      console.error("❌ Error al marcar asistencia:", err.response?.data || err.message || err);
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">M</div>
          <h1>Mindset Admin</h1>
        </div>

        <nav className="nav">
          <Link to="/admin">Index</Link>
          <Link to="/Usuarios">Gestión de Usuarios</Link>
          <Link to="/Tareas">Tareas</Link>
          <Link to="/Capacitaciones">Capacitaciones</Link>
          <Link to="/Test">Tests Likert</Link>
          <Link to="/Resultados">Resultados</Link>
          <Link to="/Reports">Reportes</Link>
          <Link to="/Eliminacion" className="active">
            Eliminación de Datos
          </Link>
        </nav>
      </aside>

      <main>
        <header className="topbar">
          <div className="title">Gestión de Contenido • Capacitaciones</div>
          <button
            style={{ position: "fixed", top: 10, right: 10, padding: "8px 16px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", zIndex: 999 }}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </button>
        </header>

        <section className="main">

          {/* Tabla de capacitaciones (para admin) */}
          <div className="card">
            <h3>Capacitaciones existentes</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tema</th>
                  <th>Fecha</th>
                  <th>Encargado</th>
                  <th>Usuarios asignados</th>
                  <th>Asistencia</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {capacitaciones.map((c) => {
                  const fechaCap = new Date(c.fecha);
                  const hoy = new Date();
                  const isExpirada = fechaCap < hoy && c.estado !== "cancelada";

                  const rowClass =
                    c.estado === "cancelada"
                      ? "row-cancelada"
                      : isExpirada
                        ? "row-expirada"
                        : "";

                  return (
                    <tr key={c.id} className={rowClass}>
                      <td>{c.id}</td>
                      <td>{c.tema}</td>
                      <td>{new Date(c.fecha).toLocaleDateString()}</td>
                      <td>{c.encargado}</td>
                      <td>
                        {c.usuarios.map((u) => (
                          <div key={u.id_usuario}>{u.nombre}</div>
                        ))}
                      </td>
                      <td>
                        {c.usuarios.map((u) => (
                          <div key={u.id_usuario}>{u.asistio ? "✅" : "❌"}</div>
                        ))}
                      </td>
                      <td>
                        <span className="badge">
                          {c.estado === "cancelada"
                            ? "cancelada"
                            : isExpirada
                              ? "expirada"
                              : c.estado}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="btn" onClick={() => handleEdit(c)}>Editar</button>
                        {c.estado !== "cancelada" && !isExpirada && (
                          <button
                            className="btn danger"
                            onClick={() => handleChangeEstado(c.id, "cancelada")}
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tabla de capacitaciones del usuario */}
          <div className="card">
            <h3>Mis capacitaciones asignadas</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Tema</th>
                  <th>Fecha</th>
                  <th>Encargado</th>
                  <th>Estado</th>
                  <th>Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {misCapacitaciones.map((c) => (
                  <tr key={c.id}>
                    <td>{c.tema}</td>
                    <td>{new Date(c.fecha).toLocaleDateString()}</td>
                    <td>{c.encargado}</td>
                    <td>{c.estado}</td>
                    <td>
                      <button
                        className="btn"
                        style={{
                          background: c.asistio ? "#2ecc71" : "#e74c3c",
                          color: "#fff",
                        }}
                        onClick={() => marcarAsistencia(c.id, !c.asistio)}
                      >
                        {c.asistio ? "✅ Asistió" : "❌ No asistió"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario (solo admin) */}
          <div className="card">
            <h3>Formulario</h3>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();

                // === VALIDACIONES ===
                if (form.tema.trim().length < 4) {
                  return alert("El tema debe tener mínimo 4 caracteres.");
                }

                const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

                if (!soloLetras.test(form.encargado.trim()) || form.encargado.trim().length < 4) {
                  return alert("El encargado debe tener mínimo 4 letras y solo contener letras.");
                }

                if (!form.fecha) {
                  return alert("Debe seleccionar una fecha.");
                }

                const fechaSeleccionada = new Date(form.fecha);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                if (fechaSeleccionada < hoy) {
                  return alert("La fecha no puede ser menor a hoy.");
                }

                if (form.usuarios.length === 0) {
                  return alert("Debe asignar por lo menos un empleado.");
                }

                // Si todo está OK → llamar submit original
                handleSubmit(e);
              }}
            >
              <input
                className="input"
                placeholder="Tema"
                value={form.tema}
                onChange={(e) => setForm({ ...form, tema: e.target.value })}
                required
              />

              <div className="form-row">
                <label className="form-label">Fecha</label>
                <input
                  className="input"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label">Encargado</label>
                <input
                  className="input"
                  placeholder="Encargado"
                  value={form.encargado}
                  onChange={(e) => setForm({ ...form, encargado: e.target.value })}
                  required
                />
              </div>

              {/* === Checkbox empleados === */}
              <div className="form-row">
                <label className="form-label">Asignar empleados</label>
                <div className="checkbox-list">
                  {usuarios.map((u) => (
                    <label key={u.id_usuario} className="checkbox-item">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        value={u.id_usuario}
                        checked={form.usuarios.includes(u.id_usuario)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              usuarios: [...form.usuarios, u.id_usuario],
                            });
                          } else {
                            setForm({
                              ...form,
                              usuarios: form.usuarios.filter((id) => id !== u.id_usuario),
                            });
                          }
                        }}
                      />
                      <span className="checkbox-label">{u.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="actions">
                <button className="btn primary" type="submit">
                  {form.id ? "Actualizar" : "Guardar"}
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    setForm({
                      id: null,
                      tema: "",
                      fecha: "",
                      encargado: "",
                      estado: "programada",
                      usuarios: [],
                    })
                  }
                >
                  Limpiar
                </button>
              </div>
            </form>

          </div>
        </section>

        <footer className="footer">
          © Gestión de Contenido Mindset — Panel de administración (HTML+CSS).
        </footer>
      </main>
    </div>
  );
};

export default CapacitacionManagement;
