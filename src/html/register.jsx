import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './registro.css'

export default function Register() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        clave: "",
        confirmarClave: "",
        rol: "",
    });

    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (formData.clave.length < 6) {
            setMensaje("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (formData.clave !== formData.confirmarClave) {
            setMensaje("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/reguistro", {
                nombre: formData.nombre,
                correo: formData.email,
                clave: formData.clave,
                rol: formData.rol,
            });

            setMensaje(res.data.message || "Cuenta creada exitosamente ✅");
            setFormData({
                nombre: "",
                email: "",
                clave: "",
                confirmarClave: "",
                rol: "",
            });
        } catch (error) {
            setMensaje("Error al registrar usuario");
            console.error('Error al registrar usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="from">
            <div className="form-container">
                <h2>Regístrate</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre completo:</label>
                    <input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="rol">Rol:</label>
                    <select
                        id="rol"
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione</option>
                        <option value="1">Admin</option>
                        <option value="2">Programador</option>
                        <option value="3">Empleado</option>
                    </select>

                    <label htmlFor="clave">Contraseña:</label>
                    <input
                        id="clave"
                        name="clave"
                        type="password"
                        minLength={6}
                        value={formData.clave}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="confirmarClave">Confirmar contraseña:</label>
                    <input
                        id="confirmarClave"
                        name="confirmarClave"
                        type="password"
                        minLength={6}
                        value={formData.confirmarClave}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={
                            !formData.nombre ||
                            !formData.email ||
                            !formData.clave ||
                            !formData.confirmarClave ||
                            loading
                        }
                    >
                        {loading ? "Creando cuenta..." : "Registrarme"}
                    </button>
                </form>

                {mensaje && <p className="mensaje">{mensaje}</p>}

                <p className="muted">
                    ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}