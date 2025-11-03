//app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [user, setUser] = useState("");
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        const storedUser = localStorage.getItem("user");

        if (!isAuthenticated) {
        // 🚫 No está autenticado → redirigir al login
        router.replace("/login");
        } else if (storedUser) {
            setUser(storedUser);
        }
    }, [router]);

    if (!user) return null; // Evita parpadeo mientras verifica sesión

    return (
        <div className="h-screen w-full flex items-center justify-center bg-black relative min-h-screen flex-col text-white"
            style={{ backgroundImage: "url('/f1-bg.png')", backgroundSize: "cover" }}>
        <h1 className="text-3xl font-semibold mb-4">
            👋 Bienvenido, {user}
        </h1>
        <p className="text-gray-400">Esta es tu página personal dentro de la app.</p>

        <button
            onClick={() => {
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("user");
                router.push("/login");
                window.location.reload(); // 🔄 fuerza actualización del layout
            }}
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-medium hover:scale-[1.03] transition"
            >
                Cerrar sesión
        </button>
        </div>
    );
}
