import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export default function DashboardEmpleado() {
  const [activeSection, setActiveSection] = useState("tareas");

  return (
    <div className="container">
      {/* Barra lateral */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">E</div>
          <h1>Empleado</h1>
        </div>
        <nav className="nav">
          <Link to="/empleado" className="active">
            Index
          </Link>
          <Link to="/empleado/tareas" className="">
            Tareas
          </Link>
          <Link to="/empleado/capacitaciones" className="">
            Capacitaciones
          </Link>
          <Link to="/empleado/test" className="">
            Test
          </Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main>
        <header className="topbar">
          <div className="title">
            {activeSection === "tareas" && "Mis Tareas"}
            {activeSection === "capacitaciones" && "Capacitaciones"}
            {activeSection === "test" && "Test"}
          </div>
        </header>

        <section className="main">
          {activeSection === "tareas" && (
            <div className="card">
              <h3>Lista de Tareas</h3>
              <table className="table">
                <thead>
                  <tr>
                    <button
                      style={{ position: 'fixed', top: 10, right: 10, padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 999 }}
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                      }}
                    >
                      Cerrar sesión
                    </button>
                    <th>Tarea</th>
                    <button
                      style={{ position: 'fixed', top: 10, right: 10, padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 999 }}
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                      }}
                    >
                      Cerrar sesión
                    </button>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tarea 1</td>
                    <td>Completar informe semanal y enviar al supervisor.</td>
                    <td>
                      <button className="btn">Marcar como hecha</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Tarea 2</td>
                    <td>Asistir a la reunión de equipo a las 3:00 PM.</td>
                    <td>
                      <button className="btn">Marcar como hecha</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "capacitaciones" && (
            <div className="card">
              <h3>Capacitaciones</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Tema</th>
                    <th>Descripción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Capacitación 1</td>
                    <td>Curso de seguridad en el trabajo.</td>
                    <td>
                      <button className="btn">Iniciar</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Capacitación 2</td>
                    <td>Introducción a nuevas herramientas.</td>
                    <td>
                      <button className="btn">Iniciar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "test" && (
            <div className="card">
              <h3>Tests</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Descripción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Test 1</td>
                    <td>Evaluación sobre capacitaciones completadas.</td>
                    <td>
                      <button className="btn">Presentar</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Test 2</td>
                    <td>Examen de conocimientos técnicos.</td>
                    <td>
                      <button className="btn">Presentar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="footer">
          © Panel de Empleado — Mindset (HTML+CSS).
        </footer>
      </main>
      <button
        style={{ position: 'fixed', top: 10, right: 10, padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 999 }}
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
