// src/components/ReportsDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function ReportsDashboard() {

  const [tipo, setTipo] = useState("capacitaciones");
  const [data, setData] = useState(null);

  // NUEVOS ESTADOS
  const [testSeleccionado, setTestSeleccionado] = useState("");
  const [preguntasData, setPreguntasData] = useState([]);

  useEffect(() => {
    fetchData(tipo);
  }, [tipo]);

  useEffect(() => {
    if (tipo === "test" && Array.isArray(data) && data.length > 0) {
      setTestSeleccionado(data[0].test_id);
      fetchPreguntasTest(data[0].test_id);
    }
  }, [data]);

  const fetchData = async (tipo) => {
    try {
      const res = await axios.get(`http://localhost:3000/reports/data?type=${tipo}`);
      setData(res.data.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const fetchPreguntasTest = async (idTest) => {
    try {
      const res = await axios.get(`http://localhost:3000/reports/test/preguntas?testId=${idTest}`);
      setPreguntasData(res.data);
    } catch (err) {
      console.error("Error cargando preguntas:", err);
    }
  };

  const colores = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA36C", "#6A4C93",
    "#C7F464", "#FF9CEE", "#8AFFC1", "#A0CED9", "#FFAB73"
  ];

  let chartData = null;
  let preguntasChart = null;

  /* ==========================================
     CAPACITACIONES
     ========================================== */
  if (tipo === "capacitaciones" && Array.isArray(data)) {
    chartData = {
      labels: data.map(d => d.tema),
      datasets: [
        {
          label: "Asistieron",
          data: data.map(d => d.asistieron),
          backgroundColor: "#4ECDC4"
        },
        {
          label: "No asistieron",
          data: data.map(d => d.no_asistieron),
          backgroundColor: "#FF6B6B"
        }
      ]
    };
  }

  /* ==========================================
     TAREAS
     ========================================== */
  if (tipo === "tareas" && data) {
    chartData = {
      labels: ["Pendientes", "Realizadas", "Asignadas"],
      datasets: [
        {
          label: "Tareas",
          data: [data.pendientes, data.completadas, data.asignadas],
          backgroundColor: colores.slice(0, 3),
        }
      ]
    };
  }

  /* ==========================================
     TEST → PROMEDIO GENERAL POR TEST
     ========================================== */
  if (tipo === "test" && Array.isArray(data)) {
    chartData = {
      labels: data.map(t => t.titulo),
      datasets: [
        {
          label: "Promedio respuestas (1 a 5)",
          data: data.map(t => t.promedio_respuestas),
          backgroundColor: colores.slice(0, data.length),
        }
      ]
    };
  }

  /* ==========================================
     TEST → PROMEDIO POR PREGUNTA
     ========================================== */
  if (tipo === "test" && preguntasData.length > 0) {
    preguntasChart = {
      labels: preguntasData.map(p => p.enunciado),
      datasets: [
        {
          label: "Promedio por pregunta (1 a 5)",
          data: preguntasData.map(p => p.promedio),
          backgroundColor: colores.slice(0, preguntasData.length),
        }
      ]
    };
  }

  const descargarPDF = () => {
    window.location.href = `http://localhost:3000/reports/pdf?type=${tipo}`;
  };

  // ================================================
  // OPCIONES DE ESCALA SEGÚN TIPO
  // test → escala 0–5
  // tareas / capacitaciones → escala 0–10
  // ================================================
  const opcionesEscala = {
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: tipo === "test" ? 5 : 10,
        ticks: {
          stepSize: tipo === "test" ? 1 : 2,
          maxTicksLimit: 6
        },
      }
    }
  };

  return (
    <div className="container">

      {/* SIDEBAR */}
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

      {/* CONTENIDO */}
      <main>
        <header className="topbar">
          <div className="title">Módulo de Reportes • Gráficos y PDF</div>
        </header>

        <section className="main">

          {/* SELECTOR TIPO */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: "bold", marginRight: 10 }}>Seleccionar reporte:</label>
            <select
              className="input"
              style={{ padding: 6 }}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="tareas">Tareas</option>
              <option value="capacitaciones">Capacitaciones</option>
              <option value="test">Test</option>
            </select>
          </div>

          {/* SELECT SOLO PARA TEST */}
          {tipo === "test" && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: "bold", marginRight: 10 }}>Seleccionar Test:</label>
              <select
                className="input"
                style={{ padding: 6 }}
                value={testSeleccionado}
                onChange={(e) => {
                  setTestSeleccionado(e.target.value);
                  fetchPreguntasTest(e.target.value);
                }}
              >
                {data?.map(t => (
                  <option key={t.test_id} value={t.test_id}>
                    {t.titulo}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* GRÁFICA PRINCIPAL */}
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              width: "100%",
              height: "300px",
              display: "flex",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
            }}
          >
            {chartData && (
              <Bar
                data={chartData}
                options={opcionesEscala}
                style={{ width: "100%", maxWidth: 700 }}
              />
            )}
          </div>

          {/* GRÁFICA DE PREGUNTAS SOLO PARA TEST */}
          {tipo === "test" && preguntasChart && (
            <div
              style={{
                marginTop: 30,
                background: "#fff",
                padding: 20,
                borderRadius: 8,
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
              }}
            >
              <Bar
                data={preguntasChart}
                options={opcionesEscala}
                style={{ width: "100%", maxWidth: 700 }}
              />
            </div>
          )}

          {/* DESCARGA PDF */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button className="btn primary" onClick={descargarPDF}>
              Descargar PDF
            </button>
          </div>

        </section>

        <footer className="footer">
          © Reportes — Mindset
        </footer>
      </main>
    </div>
  );
}
