"use client";
import { useEffect, useState } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Notificaciones() {
  const [notifs, setNotifs] = useState<{ id: number; message: string }[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Simulación de carga de notificaciones
    setTimeout(() => {
      setNotifs([
        { id: 1, message: "👋 ¡Bienvenido a la plataforma FIA!" },
        { id: 2, message: "Actualización del calendario disponible." },
        { id: 3, message: "Notificaciones de prueba 🏎️" },
      ]);
    }, 1000);
  }, []);

  return (
    <div className="relative">
      {/* Botón de campana */}
      <button
        onClick={() => setOpen(!open)}
        className="text-white text-2xl relative rounded-full px-3 py-1.5 hover:bg-white/10 transition hover:scale-110 transition-transform"
      >
         <BellIcon className="w-7 h-7 text-white hover:scale-110 transition-transform" />
        {notifs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5">
            {notifs.length}
          </span>
        )}
      </button>

      {/* Panel desplegable */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-72 bg-gris/80 backdrop-blur-2xl text-white 
                     rounded-xl shadow-lg border border-white/10 p-4 
                     animate-fade-in-down"
        >
          {/* Encabezado del panel */}
          <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-200">
              Notificaciones
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Listado de notificaciones */}
          <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {notifs.map((n) => (
              <div
                key={n.id}
                className="text-sm py-1 px-2 rounded-md hover:bg-white/10 transition"
              >
                {n.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
