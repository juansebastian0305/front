import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; 

const AdminDashboard = () => {
  return (
    <div className="container">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">M</div>
          <h1>Mindset Admin</h1>
        </div>
        <nav className="nav">
          <Link to="/" className="active">Index</Link>
          <Link to="/Usuarios" className="">Gestión de Usuarios</Link>
          <Link to="/Tareas" className="">Tareas</Link>
          <Link to="/Capacitaciones" className="">Capacitaciones</Link>
          <Link to="/Test" className="">Tests Likert </Link>
          <Link to="/Informes" className="">Estadísticas y Reportes</Link>
        </nav>
      </aside>
      <main>
        <header className="topbar">
          <div className="title">Dashboard de Admin</div>
          <button
            style={{ marginLeft: '20px', padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Cerrar sesión
          </button>
        </header>
        <section className="main">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(12,1fr)' }}>
            <div className="card" style={{ gridColumn: 'span 3' }}>
              <h3>Usuarios activos</h3>
              <div className="kpi">1,248</div>
            </div>
            <div className="card" style={{ gridColumn: 'span 3' }}>
              <h3>Ejercicios</h3>
              <div className="kpi">312</div>
            </div>
            <div className="card" style={{ gridColumn: 'span 3' }}>
              <h3>Tests completados</h3>
              <div className="kpi">5,431</div>
            </div>
            <div className="card" style={{ gridColumn: 'span 3' }}>
              <h3>Incidencias</h3>
              <div className="kpi">3</div>
            </div>
          </div>

          <div className="grid">
            <div className="card" style={{ gridColumn: 'span 8' }}>
              <h3>Actividad reciente</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Acción</th>
                    <th>Entidad</th>
                    <th>Autor</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2025-08-18</td>
                    <td>Creó</td>
                    <td>Ejercicio: Respiración 4-7-8</td>
                    <td>admin</td>
                    <td><span className="badge">Publicado</span></td>
                  </tr>
                  <tr>
                    <td>2025-08-18</td>
                    <td>Editó</td>
                    <td>Dieta: Déficit moderado</td>
                    <td>nutri</td>
                    <td><span className="badge">Borrador</span></td>
                  </tr>
                  <tr>
                    <td>2025-08-17</td>
                    <td>Eliminó</td>
                    <td>Test: Ansiedad (GAD-7)</td>
                    <td>psico</td>
                    <td><span className="badge">Archivado</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <footer className="footer">
          © Dashboard de Admin Mindset — Panel de administración .
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
};

export default AdminDashboard;