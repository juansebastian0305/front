import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

const ExerciseManagement = () => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    estado: "Asignada",
    usuarios: [],
  });

  // === Fetch data desde backend ===
  const fetchTareas = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tareas");
      setTareas(res.data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/usuarios/tareas");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  useEffect(() => {
    fetchTareas();
    fetchUsuarios();
  }, []);

  // === Validaciones ===
  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      alert("El título de la tarea es obligatorio.");
      return false;
    }
    if (form.nombre.trim().length < 3) {
      alert("El título debe tener al menos 3 caracteres.");
      return false;
    }

    if (!form.descripcion.trim()) {
      alert("La descripción es obligatoria.");
      return false;
    }
    if (form.descripcion.trim().length < 6) {
      alert("La descripción debe tener mínimo 6 caracteres.");
      return false;
    }

    if (form.usuarios.length === 0) {
      alert("Debes asignar al menos un usuario.");
      return false;
    }

    return true;
  };

  // === CRUD ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (!validarFormulario()) return;

    try {
      const data = { ...form, estado: "Asignada" };

      if (form.id) {
        await axios.put(`http://localhost:3000/tareas/${form.id}`, data);
        console.log("Tarea actualizada:", data);
      } else {
        await axios.post("http://localhost:3000/tareas", data);
        console.log("Tarea creada:", data);
      }

      setForm({
        id: null,
        nombre: "",
        descripcion: "",
        estado: "Asignada",
        usuarios: [],
      });

      fetchTareas();
    } catch (err) {
      console.error("Error al guardar tarea:", err);
    }
  };

  const handleEdit = (t) => {
    setForm({
      id: t.id_tarea,
      nombre: t.nombre,
      descripcion: t.descripcion,
      estado: t.estado,
      usuarios: t.usuarios.map((u) => u.id_usuario),
    });
  };

  const handlePendiente = async (id) => {
    try {
      await axios.put(`http://localhost:3000/tareas/${id}/pendiente`);
      console.log(`Tarea ${id} marcada como Pendiente`);
      fetchTareas();
    } catch (err) {
      console.error(`Error al marcar pendiente la tarea ${id}:`, err);
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
          <div className="title">Gestión de Contenido • Tareas</div>
          <button
            style={{ position: 'fixed', top: 10, right: 10, padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 999 }}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            Cerrar sesión
          </button>
        </header>

        <section className="main">

          {/* Tabla de tareas */}
          <div className="card">
            <h3>Tareas existentes</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Usuarios asignados</th>
                  <th>Estado</th>
                  <th>Porcentaje</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tareas.map((t) => (
                  <tr key={t.id_tarea} style={{ opacity: t.estado === "Pendiente" ? 0.5 : 1 }}>
                    <td>{t.id_tarea}</td>
                    <td>{t.nombre}</td>
                    <td>{t.descripcion}</td>
                    <td>{t.usuarios.map((u) => u.nombre).join(", ")}</td>
                    <td><span className="badge">{t.estado}</span></td>
                    <td>{t.porcentaje}%</td>
                    <td className="actions">
                      <button className="btn" onClick={() => handleEdit(t)}>Editar</button>
                      {t.estado !== "Pendiente" && (
                        <button className="btn danger" onClick={() => handlePendiente(t.id_tarea)}>
                          Pendiente
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario */}
          <div className="card">
            <h3>Formulario</h3>
            <form className="form" onSubmit={handleSubmit}>
              
              <input
                className="input"
                placeholder="Título de la tarea"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />

              <div className="form-row">
                <label className="form-label">Descripción</label>
                <input
                  className="input"
                  placeholder="Descripción de la tarea"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>

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
                              usuarios: form.usuarios.filter(id => id !== u.id_usuario),
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
                      nombre: "",
                      descripcion: "",
                      estado: "Asignada",
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
          © Gestión de Contenido Mindset — Panel de administración.
        </footer>
      </main>
    </div>
  );
};

export default ExerciseManagement;
