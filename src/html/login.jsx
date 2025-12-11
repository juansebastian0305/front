import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './registro.css'

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, clave }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Inicio de sesión exitoso");
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("token", data.token);
        console.log('Login exitoso:', data);
        // Redirección según rol
        switch (data.usuario.rol) {
          case 1:
            navigate("/admin");
            break;
          case 2:
            navigate("/programador");
            break;
          case 3:
            navigate("/empleado");
            break;
          default:
            navigate("/");
        }
      } else {
  setMensaje(data.mensaje || "Error en el login");
  console.error('Error en login:', data);
      }
    } catch (error) {
  console.error('Error de conexión:', error);
  setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div className="from">
      <div className="form-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="usuario">Correo:</label>
          <input
            id="usuario"
            name="usuario"
            type="email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label htmlFor="clave">Contraseña:</label>
          <input
            id="clave"
            name="clave"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />

          <button type="submit" disabled={!usuario || !clave}>
            Ingresar
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="muted">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}