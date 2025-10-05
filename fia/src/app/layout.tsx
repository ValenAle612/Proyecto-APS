import Image from "next/image";
import Link from "next/link";
import "@/app/ui/global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen bg-black text-white">
        {/* Navbar estilo Apple */}
        <nav className="fixed top-0 left-0 w-full bg-white/20 backdrop-blur-lg text-white z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
            {/* Logo + Nombre */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <Image src="/fia-logo.png" alt="FIA" width={60} height={60} />
              <span className="text-white text-xl font-black [text-shadow:2px_2px_0_#002c63,-2px_-2px_0_#002c63,2px_-2px_0_#002c63,-2px_2px_0_#002c63]">FIA Platform</span>
            </Link>

            {/* Links */}
            <div className="flex gap-8 text-medium font-light">
              <Link href="/calendario" className="hover:text-white transition">Calendario</Link>
              <Link href="/pilotos" className="hover:text-white transition">Pilotos</Link>
              <Link href="/puntajes" className="hover:text-white transition">Puntajes</Link>
              <Link href="/notificaciones" className="hover:text-white transition">Notificaciones</Link>
            </div>
          </div>
        </nav>

        {/* Contenido */}
        <main className="flex-grow bg-black">
          {children}
        </main>

        {/* Footer Informativo */}
        <footer className="w-full bg-background_fia/50 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-8 py-6 text-sm text-gray-400">
            <div className="flex justify-between items-start flex-wrap gap-8">
              {/* Columna 1: Información de Contacto / Legal */}
              <div className="w-full md:w-1/4 space-y-2">
                <h3 className="text-white font-semibold mb-2">FIA Platform</h3>
                <p>&copy; {new Date().getFullYear()} Federación Internacional del Automóvil.</p>
                <p>Todos los derechos reservados.</p>
              </div>

              {/* Columna 2: Enlaces Rápidos */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-2">Navegación</h3>
                <Link href="/calendario" className="block hover:text-white transition">Calendario Oficial</Link>
                <Link href="/pilotos" className="block hover:text-white transition">Ránking de Pilotos</Link>
                <Link href="/reglamentos" className="block hover:text-white transition">Reglamentos</Link>
              </div>

              {/* Columna 3: Legal y Soporte */}
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
