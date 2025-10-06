//app/page.tsx

export default function Home() {
  return (
    <main
      className="
        relative min-h-screen flex flex-col items-center justify-center
        bg-[url('/track-bg.png')] bg-cover bg-center bg-fixed text-white
        px-6 pt-24 pb-12
      "
    >
      {/* Capa de oscurecimiento para mejorar contraste */}
      <div className="absolute inset-0 bg-black/q0 backdrop-blur-sm" />

      {/* Contenido principal */}
      <section className="relative z-10 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          FIA Platform
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Plataforma no oficial de la Federación Internacional del Automóvil.  
          Consulta el calendario, clasificaciones y reglamentos actualizados del campeonato.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/calendario"
            className="bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-gray-200 transition"
          >
            Ver calendario
          </a>
          <a
            href="/pilotos"
            className="border border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            Ranking de pilotos
          </a>
        </div>
      </section>

      {/* Pie decorativo */}
      <footer className="absolute bottom-6 text-sm text-gray-400 z-10">
        © {new Date().getFullYear()} Federación Internacional del Automóvil
      </footer>
    </main>
  );
}
