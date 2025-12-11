import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.css";

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    id_usuario: "",
    nombre: "",
    correo: "",
    rol: "",
    estado: "",
  });

  // Diccionario de roles
  const rolesMap = {
    1: "Admin",
    2: "Programador",
    3: "Empleado",
  };

  // Cargar usuarios
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRoleBadgeClass = (rolTexto) => {
    switch (rolTexto) {
      case "Admin":
        return "primary";
      case "Programador":
        return "info";
      case "Empleado":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Cambiar estado rápido
  const toggleEstado = async (id_usuario, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === "Activo" ? "Suspendido" : "Activo";
      await axios.put(`http://localhost:3000/usuarios/estado/${id_usuario}`, {
        estado: nuevoEstado,
      });

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((user) =>
          user.id_usuario === id_usuario ? { ...user, estado: nuevoEstado } : user
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  // Abrir formulario de edición
  const handleEdit = (user) => {
    setEditUser(user.id_usuario);
    setFormData({
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: String(user.rol), // 👈 siempre como string numérica para el <select>
      estado: user.estado,
    });
  };

  // Manejar inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar edición
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:3000/usuarios/editar/${formData.id_usuario}`,
        formData
      );

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((user) =>
          user.id_usuario === formData.id_usuario ? { ...user, ...formData } : user
        )
      );

      setEditUser(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleCancel = () => {
    setEditUser(null);
    setFormData({ id_usuario: "", nombre: "", correo: "", rol: "", fecha_registro: "", estado: "" });
  };

  return (
    <div className="container">
      {/* Barra lateral */}
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
      {/* Contenido principal */}
      <main>
        <header className="topbar">
          <div className="title">Gestión de Usuarios</div>
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
          <div className="card">
            <h3>Lista de usuarios</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>fecha de creacion</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id_usuario}>
                    <td>#{user.id_usuario}</td>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td>
                      <span
                        className={`badge ${getRoleBadgeClass(
                          rolesMap[user.rol] || user.rol
                        )}`}
                      >
                        {rolesMap[user.rol] || "Desconocido"}
                      </span>
                    </td>
                    <td>{user.fecha_registro}</td>
                    <td>
                      <span
                        className={`badge ${user.estado === "Suspendido" ? "danger" : "success"
                          }`}
                      >
                        {user.estado}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className={`btn ${user.estado === "Suspendido" ? "success" : "danger"
                          }`}
                        onClick={() => toggleEstado(user.id_usuario, user.estado)}
                      >
                        {user.estado === "Suspendido" ? "Activar" : "Suspender"}
                      </button>
                      <button className="btn" onClick={() => handleEdit(user)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario de edición */}
          {editUser && (
            <div className="card">
              <h3>Formulario de edición</h3>
              <form className="form">
                <input
                  className="input"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                />

                <input
                  className="input"
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Correo"
                />

                <div className="row">
                  <select
                    className="select"
                    id="rol"
                    name="rol"
                    value={formData.rol} // 👈 ahora siempre será "1", "2", "3"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="1">Admin</option>
                    <option value="2">Programador</option>
                    <option value="3">Empleado</option>
                  </select>

                  <select
                    className="select"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
                </div>

                <div className="actions">
                  <button type="button" className="btn primary" onClick={handleSave}>
                    Guardar
                  </button>
                  <button type="button" className="btn" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        <footer className="footer">
          © Gestión de Usuarios Mindset — Panel de administración
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
