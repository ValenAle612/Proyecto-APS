// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gris text-white text-center px-4">
      <div className="max-w-md mt-8">
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnl3a2pjeHhvenhzZGFmN3hrY3Q1N214NnR3Z2VxeWh0bHFtZDlvNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DN0VIGdNuIhGpO1TQP/giphy.gif"
          alt="Página no encontrada"
          width={400}
          height={400}
          className="mx-auto rounded-2xl mb-8 shadow-lg"
        />

        <h1 className="text-4xl font-bold mb-3">Oops... Todavía estamos trabajando acá</h1>
        <p className="text-gray-400 mb-8">
          Parece que tomaste una curva equivocada.  
          Volvé al inicio para seguir explorando la FIA Platform.
        </p>

        <Link
          href="/"
          className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
