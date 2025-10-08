// src/app/api/racers/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Racer from '@/app/models/Racer';

// OBTENER todos los pilotos
export async function GET() {
  await dbConnect();
  try {
    const racers = await Racer.find({}).sort({ number: 1 }); // Ordenados por número
    return NextResponse.json(racers);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los pilotos' }, { status: 500 });
  }
}

// CREAR un nuevo piloto
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newRacer = await Racer.create(body);
    return NextResponse.json(newRacer, { status: 201 });
  } catch (error: any) {
    // Manejo de error de duplicado (por el número de piloto)
    if (error.code === 11000) {
       return NextResponse.json({ error: 'El número de piloto ya existe.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al crear el piloto' }, { status: 400 });
  }
}