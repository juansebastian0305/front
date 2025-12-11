import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.css";

export default function DashboardEmpleado() {
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [mensaje, setMensaje] = useState("");

    // 🔹 Cargar preguntas solo por el usuario autenticado
    useEffect(() => {
        axios
            .get("http://localhost:3000/respuestas", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                // Filtrar preguntas que ya tengan respuesta
                const pendientes = res.data.filter((p) => p.respuesta === null);
                setPreguntas(pendientes);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (id, valor) => {
        setRespuestas({ ...respuestas, [id]: valor });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔹 Validar que todas las preguntas tengan respuesta
        if (Object.keys(respuestas).length < preguntas.length) {
            alert("⚠️ Debes responder todas las preguntas antes de enviar.");
            return;
        }

        const payload = {
            respuestas: Object.entries(respuestas).map(([id, valor]) => ({
                usuario_pregunta_id: id,
                valor,
            })),
        };
        try {
            await axios.post("http://localhost:3000/respuestas", payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMensaje("✅ Respuestas enviadas");

            // 🔹 Ocultar las preguntas después de responder
            setPreguntas([]);
        } catch (err) {
            console.error(err);
            setMensaje(" Error al enviar respuestas");
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
                    <Link to="/empleado">Index</Link>
                    <Link to="/empleado/tareas">Tareas</Link>
                    <Link to="/empleado/capacitaciones">Capacitaciones</Link>
                    <Link to="/empleado/test" className="active">
                        Test
                    </Link>
                </nav>
            </aside>

            {/* Contenido principal */}
            <main>
                <header className="topbar">
                    <div className="title">Gestión de Contenido • Tests Likert</div>
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
                    <h2>Responder Test</h2>

                    {preguntas.length === 0 ? (
                        <p>Ya respondiste todas las preguntas.</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {preguntas.map((p) => (
                                <div key={p.usuario_pregunta_id} className="em-test-pregunta">
                                    <p className="em-test-enunciado">{p.enunciado}</p>
                                    <div className="em-test-opciones">
                                        {[
                                            { value: 1, label: "Totalmente en desacuerdo" },
                                            { value: 2, label: "En desacuerdo" },
                                            { value: 3, label: "Indiferente" },
                                            { value: 4, label: "De acuerdo" },
                                            { value: 5, label: "Totalmente de acuerdo" },
                                        ].map((opcion) => (
                                            <label key={opcion.value} className="em-test-opcion">
                                                <input
                                                    type="radio"
                                                    name={`preg-${p.usuario_pregunta_id}`}
                                                    value={opcion.value}
                                                    checked={String(respuestas[p.usuario_pregunta_id]) === String(opcion.value)}
                                                    onChange={() =>
                                                        handleChange(p.usuario_pregunta_id, String(opcion.value))
                                                    }
                                                    required
                                                />
                                                <span className="em-test-circle"></span>
                                                <span className="em-test-label">{opcion.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button type="submit">Enviar</button>
                        </form>
                    )}

                    {mensaje && <p>{mensaje}</p>}
                </section>

                <footer className="footer">© Panel de Empleado — Mindset (HTML+CSS).</footer>
            </main>
        </div>
    );
}
