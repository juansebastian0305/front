import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

export default function TareasEmpleado() {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/tareas/mis-tareas", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTareas(res.data))
        .catch((err) => console.error("❌ Error:", err));
    }
  }, []);

  const terminarTarea = async (id_tarea) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/tareas/${id_tarea}/terminar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTareas((prev) =>
        prev.map((t) =>
          t.id_tarea === id_tarea
            ? {
                ...t,
                completada: 1,
                estado: res.data.estado,
                porcentaje: res.data.porcentaje,
              }
            : t
        )
      );
    } catch (err) {
      console.error("❌ Error al terminar tarea:", err);
    }
  };

  const revertirTarea = async (id_tarea) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/tareas/${id_tarea}/revertir`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTareas((prev) =>
        prev.map((t) =>
          t.id_tarea === id_tarea
            ? {
                ...t,
                completada: 0,
                estado: res.data.estado,
                porcentaje: res.data.porcentaje,
              }
            : t
        )
      );
    } catch (err) {
      console.error("❌ Error al revertir tarea:", err);
    }
  };

  return (
    <div className="container">
      {/* Barra lateral */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">E</div>
          <h1>Empleado</h1>
        </div>
        <nav className="nav">
          <Link to="/empleado" className="">Index</Link>
          <Link to="/empleado/tareas" className="active">📌 Tareas</Link>
          <Link to="/empleado/capacitaciones" className="">📚 Capacitaciones</Link>
          <Link to="/empleado/test" className="">📝 Test</Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main>
        <header className="topbar">
          <div className="title">Gestión de Contenido • Tareas</div>
          <button
            style={{
              position: "fixed",
              top: 10,
              right: 10,
              padding: "8px 16px",
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              zIndex: 999,
            }}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </button>
        </header>

        <section className="main">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Progreso</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tareas.length === 0 ? (
                <tr>
                  <td colSpan="6">No tienes tareas asignadas</td>
                </tr>
              ) : (
                tareas.map((t) => (
                  <tr key={t.id_tarea}>
                    <td>{t.id_tarea}</td>
                    <td>{t.nombre}</td>
                    <td>{t.descripcion}</td>
                    <td>{t.estado}</td>
                    <td>{t.porcentaje}%</td>
                    <td>
                      {t.completada === 1 ? (
                        <button
                          className="btn warning"
                          onClick={() => revertirTarea(t.id_tarea)}
                        >
                           Revertir
                        </button>
                      ) : (
                        <button
                          className="btn success"
                          onClick={() => terminarTarea(t.id_tarea)}
                        >
                           Terminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <footer className="footer">
          © Panel de Empleado — Mindset (HTML+CSS).
        </footer>
      </main>
    </div>
  );
}
