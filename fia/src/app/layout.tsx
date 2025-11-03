"use client";
import Image from "next/image";
import Link from "next/link";
import "@/app/components/ui/global.css";
import Notificaciones from "@/app/components/ui/Notificaciones";
import { UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen bg-gris_claro/80 text-white font-sans">
        {/* 🔹 Navbar principal */}
        <nav
          className="fixed top-0 left-0 w-full bg-gray-900 supports-[backdrop-filter]:bg-gray-900/90 backdrop-blur-lg border-b border-white/20 
          shadow-[0_4px_30px_rgba(0,0,0,0.4)] z-50 will-change-transform"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6 relative">
            {/* Logo + Nombre */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <Image src="/fia-logo.png" alt="FIA" width={60} height={60} />
              <span className="text-white text-xl font-black">FIA Platform</span>
            </Link>

            {/* Links */}
            <div className="flex text-medium gap-3 items-center font-light">
              <div className="flex items-center gap-8 mr-4">
                <Link href="/races" className="text-white hover:text-white/50 transition">
                  Races
                </Link>
                <Link href="/results" className="text-white hover:text-white/50 transition">
                  Score
                </Link>
              </div>

              {/* Campana de notificaciones */}
              <Notificaciones />

              {/* Botón de login */}
              <Link
                href={user ? "/profile" : "/login"}
                className="flex items-center px-3 py-1.5 rounded-full hover:bg-white/10 transition hover:scale-110 transition-transform"
              >
                <UserIcon className="w-7 h-7 text-white" />
              </Link>
            </div>
          </div>
        </nav>

        {/* 🔹 Barra de usuario (debajo del navbar) */}
        {user && (
          <div className="fixed top-[88px] left-0 w-full bg-gray-800/80 backdrop-blur-md border-b border-white/10 py-2 text-center text-gray-200 text-sm z-40">
            👋 Bienvenido, <span className="font-semibold text-white">{user}</span>
          </div>
        )}

        {/* 🔹 Contenido principal */}
        <main className={`flex-grow bg-gris_claro ${user ? "pt-[110px]" : "pt-[90px]"}`}>
          {children}
        </main>

        {/* 🔹 Footer informativo */}
        <footer className="w-full bg-background_fia/50 border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto px-8 py-6 text-sm text-gray-400">
            <div className="flex justify-between items-start flex-wrap gap-8">
              {/* Columna 1 */}
              <div className="w-full md:w-1/4 space-y-2">
                <h3 className="text-white font-semibold mb-2">FIA Platform</h3>
                <p>&copy; {new Date().getFullYear()} Federación Internacional del Automóvil.</p>
                <p>Todos los derechos reservados.</p>
              </div>

              {/* Columna 2 */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-2">Navegación</h3>
                <Link href="/calendario" className="block hover:text-white transition">Calendario Oficial</Link>
                <Link href="/pilotos" className="block hover:text-white transition">Ránking de Pilotos</Link>
                <Link href="/reglamentos" className="block hover:text-white transition">Reglamentos</Link>
              </div>

              {/* Columna 3 */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-2">Soporte</h3>
                <Link href="/privacidad" className="block hover:text-white transition">Política de Privacidad</Link>
                <Link href="/terminos" className="block hover:text-white transition">Términos de Uso</Link>
                <Link href="/contacto" className="block hover:text-white transition">Contacto</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
