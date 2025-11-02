//app/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (isAuthenticated) {
        router.replace("/profile");
      }
    }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error en el login");
    } else {
      // ✅ Guardar sesión y usuario
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", data.user); // 👈 guarda el nombre o username
      
      // ✅ Redirigir a /profile
      window.location.href = "/profile";
    }
  } catch (err) {
    setError("Error de conexión con el servidor");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-black relative"
      style={{ backgroundImage: "url('/f1-bg.png')", backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 w-[360px] border border-white/20 text-center">
        <h1 className="text-2xl font-semibold text-white mb-6">Inicia sesión</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Usuario */}
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
          />

          {/* Contraseña con botón mostrar/ocultar */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="p-3 w-full rounded-xl bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white transition"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-white text-black font-medium py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6">
          <a href="#" className="text-sm text-gray-300 hover:text-white transition">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}
