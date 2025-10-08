// src/app/api/racers/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Racer from '@/app/models/Racer';

interface Params {
  params: { id: string };
}

// ACTUALIZAR un piloto por su ID
export async function PUT(request: Request, { params }: Params) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await request.json();
    const updatedRacer = await Racer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRacer) {
      return NextResponse.json({ error: 'Piloto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(updatedRacer);
  } catch (error: any) {
    if (error.code === 11000) {
       return NextResponse.json({ error: 'El número de piloto ya existe.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al actualizar el piloto' }, { status: 400 });
  }
}

// BORRAR un piloto por su ID
export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedRacer = await Racer.findByIdAndDelete(id);
    if (!deletedRacer) {
      return NextResponse.json({ error: 'Piloto no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Piloto eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el piloto' }, { status: 400 });
  }
}