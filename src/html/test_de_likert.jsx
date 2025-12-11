import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

const TestDeLikert = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preguntas, setPreguntas] = useState([""]);

  const handlePreguntaChange = (i, value) => {
    const nuevas = [...preguntas];
    nuevas[i] = value;
    setPreguntas(nuevas);
  };

  const handleAddPregunta = () => {
    if (preguntas.length < 20) {
      setPreguntas([...preguntas, ""]);
    } else {
      alert("⚠️ Máximo 20 preguntas por test.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/tests", {
        titulo,
        descripcion,
        preguntas,
      });

      alert("✅ Test creado y preguntas asignadas a usuarios rol 3");
      setTitulo("");
      setDescripcion("");
      setPreguntas([""]);
    } catch (error) {
      console.error("Error al crear el test:", error);
    }
  };

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
          <div className="title">Gestión de Contenido • Tests Likert</div>
        </header>

        <section className="main test-main">
          <div className="test-container full-width">
            <h2 className="test-title">Crear Test</h2>

            {/* === FORMULARIO VALIDADO COMPLETO === */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                // === VALIDACIONES ===

                if (titulo.trim().length < 4) {
                  return alert("⚠️ El título debe tener mínimo 4 caracteres.");
                }

                if (descripcion.trim().length < 10) {
                  return alert(
                    "⚠️ La descripción debe tener mínimo 10 caracteres."
                  );
                }

                if (preguntas.length === 0) {
                  return alert("⚠️ Debe agregar por lo menos una pregunta.");
                }

                for (let i = 0; i < preguntas.length; i++) {
                  if (preguntas[i].trim().length < 6) {
                    return alert(
                      `⚠️ La pregunta ${i + 1} debe tener mínimo 6 caracteres.`
                    );
                  }
                }

                // Si todo OK → ejecutar submit original
                handleSubmit(e);
              }}
              className="test-form"
            >
              <input
                className="test-input"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título"
                required
              />

              <textarea
                className="test-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción"
                required
              />

              <h3 className="test-subtitle">Preguntas</h3>

              {preguntas.map((p, i) => (
                <input
                  key={i}
                  className="test-input"
                  value={p}
                  onChange={(e) => handlePreguntaChange(i, e.target.value)}
                  placeholder={`Pregunta ${i + 1}`}
                  required
                />
              ))}

              <div className="test-buttons">
                <button
                  type="button"
                  className="test-btn test-btn-add"
                  onClick={handleAddPregunta}
                >
                  Agregar pregunta
                </button>
              </div>

              <div className="test-buttons">
                <button type="submit" className="test-btn test-btn-submit">
                  Crear
                </button>
              </div>
            </form>

            <p className="test-counter">
              {preguntas.length} / 20 preguntas agregadas
            </p>
          </div>
        </section>

        <footer className="footer">
          © Gestión de Contenido Mindset — Panel de administración
        </footer>
      </main>
    </div>
  );
};

export default TestDeLikert;
