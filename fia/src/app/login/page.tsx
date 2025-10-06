"use client";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Usuario: ${form.username}, Contraseña: ${form.password}`);
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-black relative"
      style={{ backgroundImage: "url('/f1-bg.png')", backgroundSize: "cover" }}
    >
      {/* Overlay elegante */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Caja Login estilo Apple */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 w-[360px] border border-white/20 text-center">
        
        {/* Logo o Título */}
        <h1 className="text-2xl font-semibold text-white mb-6">Inicia sesión</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
          />

          <button
            type="submit"
            className="mt-2 bg-white text-black font-medium py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Ingresar
          </button>
        </form>

        {/* Link de ayuda */}
        <div className="mt-6">
          <a href="#" className="text-sm text-gray-300 hover:text-white transition">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}
