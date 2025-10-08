// app/api/races/[id]/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/mongodb';
import Race from '@/app/models/Race';

interface Params {
  params: { id: string };
}

// Función para ACTUALIZAR una carrera por su ID
export async function PUT(request: Request, { params }: Params) {
  await dbConnect();
  const { id } = params;

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID de carrera no válido' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updatedRace = await Race.findByIdAndUpdate(id, body, {
      new: true, // Devuelve el documento modificado
      runValidators: true, // Corre las validaciones del schema
    });

    if (!updatedRace) {
      return NextResponse.json({ error: 'Carrera no encontrada' }, { status: 404 });
    }

    return NextResponse.json(updatedRace);
  } catch (error) {
    // Manejo de errores de validación de Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error); // Loguear el error para depuración
    return NextResponse.json({ error: 'Error en el servidor al actualizar la carrera' }, { status: 500 });
  }
}

// Función para BORRAR una carrera por su ID
export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();
  const { id } = params;

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID de carrera no válido' }, { status: 400 });
  }

  try {
    const deletedRace = await Race.findByIdAndDelete(id);

    if (!deletedRace) {
      return NextResponse.json({ error: 'Carrera no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Carrera eliminada exitosamente' });
  } catch (error) {
    console.error(error); // Loguear el error para depuración
    return NextResponse.json({ error: 'Error en el servidor al eliminar la carrera' }, { status: 500 });
  }
}