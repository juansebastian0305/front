import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

export default function CapacitacionesEmpleado() {
  const [capacitaciones, setCapacitaciones] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3000/capacitaciones/mis-capacitaciones", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setCapacitaciones(res.data))
        .catch(err => console.error("❌ Error:", err));
    }
  }, []);

  const marcarAsistencia = async (capacitacionId, asistio) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/capacitaciones/${capacitacionId}/asistencia`,
        { asistio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCapacitaciones(prev =>
        prev.map(c =>
          c.id === capacitacionId ? { ...c, asistio } : c
        )
      );
    } catch (err) {
      console.error("❌ Error al marcar asistencia:", err);
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
          <Link to="/empleado/tareas" className=""> Tareas</Link>
          <Link to="/empleado/capacitaciones" className="active"> Capacitaciones</Link>
          <Link to="/empleado/test" className=""> Test</Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main>
        <header className="topbar">
          <div className="title">Gestión de Contenido • Capacitaciones</div>
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
              {capacitaciones.map(c => (
                <tr key={c.id}>
                  <td>{c.tema}</td>
                  <td>{new Date(c.fecha).toLocaleDateString()}</td>
                  <td>{c.encargado}</td>
                  <td>{c.estado}</td>
                  <td>
                    {c.asistio ? (
                      <span className="badge success"> Asistió</span>
                    ) : (
                      <button
                        className="btn primary"
                        onClick={() => marcarAsistencia(c.id, 1)}
                      >
                        Marcar asistencia
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
