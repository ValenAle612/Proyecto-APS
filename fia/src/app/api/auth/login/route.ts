import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Mock de usuarios (más adelante conectar a BD)
  const user = { username: "admin", password: "1234" };

  if (username === user.username && password === user.password) {
    return NextResponse.json({ message: "Login exitoso" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }
}
