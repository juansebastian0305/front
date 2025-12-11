import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const UserManagement = () => {
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
          <div className="title">Gestión de Usuarios</div>
        </header>
        <section className="main">
          <div className="card">
            <h3>Lista de usuarios</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#1024</td>
                  <td>Laura R.</td>
                  <td>laura@example.com</td>
                  <td><span className="badge">Admin</span></td>
                  <td><span className="badge">Activo</span></td>
                  <td><Link className="btn" to="/user-detail">Ver</Link></td>
                </tr>
                <tr>
                  <td>#1025</td>
                  <td>Carlos M.</td>
                  <td>carlos@example.com</td>
                  <td><span className="badge">Editor</span></td>
                  <td><span className="badge">Pendiente</span></td>
                  <td><Link className="btn" to="/user-detail">Ver</Link></td>
                </tr>
                <tr>
                  <td>#1026</td>
                  <td>Andrea G.</td>
                  <td>andrea@example.com</td>
                  <td><span className="badge">Nutrición</span></td>
                  <td><span className="badge">Suspendido</span></td>
                  <td><Link className="btn" to="/user-detail">Ver</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer className="footer">
          © Gestión de Usuarios Mindset — Panel de administración (HTML+CSS).
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

export default UserManagement;