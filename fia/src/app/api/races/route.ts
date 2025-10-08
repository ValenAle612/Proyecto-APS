// app/pages/api/races/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/mongodb';
import Race from '@/app/models/Race';

// Función para OBTENER todas las carreras
export async function GET() {
  await dbConnect();

  try {
    const races = await Race.find({}).sort({ round: 1 }); // Busca todas y las ordena por ronda
    return NextResponse.json(races);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor al obtener las carreras' }, { status: 500 });
  }
}

// Función para CREAR una nueva carrera
export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const newRace = await Race.create(body); // Crea una nueva carrera con los datos del body
    return NextResponse.json(newRace, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error en el servidor al crear la carrera' }, { status: 500 });
  }
}