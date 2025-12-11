import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

// ❌ Tabla "rol" eliminada del módulo
const tablas = {
  usuarios: { id: "id_usuario" },
  tareas: { id: "id_tarea" },
  tareas_usuarios: { id: "id_tarea" },
  capacitaciones: { id: "id" },
  capacitacion_asistentes: { id: "id" },
  tests: { id: "id" },
  preguntas: { id: "id" },
  usuario_preguntas: { id: "id" },
  respuestas: { id: "id" }
};

const Eliminacion = () => {
  const [open, setOpen] = useState(null);
  const [data, setData] = useState({});

  const toggleTabla = async (tabla) => {
    if (open === tabla) {
      setOpen(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/eliminar/${tabla}`);
      setData((prev) => ({ ...prev, [tabla]: res.data }));
      setOpen(tabla);
    } catch (err) {
      console.error("Error cargando tabla:", err);
    }
  };

  const eliminarFila = async (tabla, id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;

    try {
      await axios.delete(`http://localhost:3000/eliminar/${tabla}/${id}`);

      setData((prev) => ({
        ...prev,
        [tabla]: prev[tabla].filter((item) => item[tablas[tabla].id] !== id)
      }));
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("No se pudo eliminar: este dato está relacionado con otra tabla.");
    }
  };

  return (
    <div className="container resultados-container">
      {/* Sidebar */}
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

      {/* Main */}
      <main>
        <header className="topbar">
          <div className="title">Gestión de Contenido • Eliminación de Datos</div>
        </header>

        <section className="main resultados-main">
          <div className="card resultados-card">
            <h3>Eliminar Información del Sistema</h3>

            {Object.keys(tablas).map((tabla) => (
              <div key={tabla} className="accordion-section">
                <button
                  className="resultados-btn"
                  onClick={() => toggleTabla(tabla)}
                  style={{ width: "100%", margin: "10px 0" }}
                >
                  {open === tabla ? "▼" : "►"} {tabla.toUpperCase()}
                </button>

                {open === tabla && (
                  <div className="accordion-content">
                    {!data[tabla] ? (
                      <p>Cargando...</p>
                    ) : data[tabla].length === 0 ? (
                      <p>No hay datos en esta tabla.</p>
                    ) : (
                      <table className="resultados-table">
                        <thead>
                          <tr>
                            {Object.keys(data[tabla][0]).map((col) => (
                              <th key={col}>{col}</th>
                            ))}
                            <th>Acción</th>
                          </tr>
                        </thead>

                        <tbody>
                          {data[tabla].map((fila) => (
                            <tr key={fila[tablas[tabla].id]}>
                              {Object.values(fila).map((val, idx) => (
                                <td key={idx}>{String(val)}</td>
                              ))}

                              <td>
                                <button
                                  className="resultados-btn"
                                  style={{
                                    background: "crimson",
                                    color: "white"
                                  }}
                                  onClick={() =>
                                    eliminarFila(tabla, fila[tablas[tabla].id])
                                  }
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          © Gestión de Contenido Mindset — Panel de administración
        </footer>
      </main>

      {/* Logout */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Eliminacion;
