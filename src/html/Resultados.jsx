import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

const Resultados = () => {
  const [tests, setTests] = useState([]);
  const [expandedTestId, setExpandedTestId] = useState(null);
  const [detalles, setDetalles] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/resultados")
      .then((res) => setTests(res.data))
      .catch((err) => console.error("Error al cargar resultados:", err));
  }, []);

  const toggleDetalles = async (id) => {
    if (expandedTestId === id) {
      setExpandedTestId(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/resultados/${id}`);
      setDetalles((prev) => ({ ...prev, [id]: res.data }));
      setExpandedTestId(id);
    } catch (err) {
      console.error("Error al cargar detalles:", err);
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
          <div className="title">Gestión de Contenido • Tests Likert</div>
        </header>

        <section className="main resultados-main">
          <div className="card resultados-card">
            <h3>Resultados de Tests</h3>
            <table className="resultados-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Promedio</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <React.Fragment key={t.test_id}>
                    <tr
                      className={`resultados-row ${expandedTestId === t.test_id ? "expanded" : ""
                        }`}
                    >
                      <td>{t.titulo}</td>
                      <td>{t.descripcion}</td>
                      <td className="resultados-promedio">
                        {t.promedio_respuestas != null
                          ? Number(t.promedio_respuestas).toFixed(2)
                          : "N/A"}
                      </td>
                      <td>
                        <button
                          className="resultados-btn"
                          onClick={() => toggleDetalles(t.test_id)}
                        >
                          {expandedTestId === t.test_id
                            ? "Ocultar"
                            : "Ver Detalles"}
                        </button>
                      </td>
                    </tr>

                    {/* Subtabla con preguntas */}
                    {expandedTestId === t.test_id && (
                      <tr>
                        <td colSpan="4">
                          <table className="resultados-subtable">
                            <thead>
                              <tr>
                                <th>Pregunta</th>
                                <th>Promedio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detalles[t.test_id]?.map((d) => (
                                <tr key={d.pregunta_id}>
                                  <td>{d.enunciado}</td>
                                  <td className="resultados-promedio">
                                    {d.promedio != null
                                      ? Number(d.promedio).toFixed(2)
                                      : "Sin respuestas"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          © Gestión de Contenido Mindset — Panel de administración
        </footer>
      </main>

      {/* Botón logout */}
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

export default Resultados;
