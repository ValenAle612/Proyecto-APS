import { NextResponse } from "next/server";

export async function GET() {
  // Simulamos una respuesta de notificación
  const notifications = [
    {
      id: 1,
      message: "👋 ¡Bienvenido a la plataforma FIA!",
      read: false,
      createdAt: new Date(),
    },
    {
      id: 2,
      message: "Notificación de prueba 🏎",
      read: false,
      createdAt: new Date(),
    },
  ];

  return NextResponse.json(notifications);
}
