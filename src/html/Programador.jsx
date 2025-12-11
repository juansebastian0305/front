import React, { useState } from "react";

export default function EmpleadoDashboard() {
  const [activeSection, setActiveSection] = useState("tareas");

  return (
    <div className="flex h-screen">
      {/* Barra lateral */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h1 className="text-2xl font-bold mb-8">Progrador</h1>
        <nav className="flex flex-col space-y-4">
          <button
            className={`text-left p-2 rounded ${
              activeSection === "tareas" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSection("tareas")}
          >
            Tareas
          </button>
          <button
            className={`text-left p-2 rounded ${
              activeSection === "capacitaciones" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSection("capacitaciones")}
          >
            Capacitaciones
          </button>
          <button
            className={`text-left p-2 rounded ${
              activeSection === "test" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSection("test")}
          >
            Test
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-10 bg-gray-100">
        {activeSection === "tareas" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Tareas</h2>
            <ul className="list-disc pl-6">
              <li>Revisar correos</li>
              <li>Actualizar reporte diario</li>
              <li>Reunión con supervisor</li>
            </ul>
          </div>
        )}

        {activeSection === "capacitaciones" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Capacitaciones</h2>
            <p>Tienes una capacitación programada en seguridad laboral el viernes.</p>
          </div>
        )}

        {activeSection === "test" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Test</h2>
            <p>Debes completar el test de evaluación de conocimientos.</p>
          </div>
        )}
          <button
            style={{ position: 'fixed', top: 10, right: 10, padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 999 }}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            Cerrar sesión
          </button>
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
