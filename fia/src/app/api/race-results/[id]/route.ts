// app/api/race-results/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import RaceResult from '@/app/models/RaceResult';

// OBTENER un resultado específico
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await context.params;

    const result = await RaceResult.findById(id)
      .populate('race_id')
      .populate('racer_id');

    if (!result) {
      return NextResponse.json({ error: 'Resultado no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener resultado' }, { status: 500 });
  }
}

// ACTUALIZAR un resultado
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params; // ✅ nuevo formato

  try {
    const body = await request.json();
    const updatedResult = await RaceResult.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate('race_id')
      .populate('racer_id');

    if (!updatedResult) {
      return NextResponse.json({ error: 'Resultado no encontrado' }, { status: 404 });
    }

    return NextResponse.json(updatedResult);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar resultado' }, { status: 400 });
  }
}

// ELIMINAR un resultado
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params; // ✅ nuevo formato

  try {
    const deletedResult = await RaceResult.findByIdAndDelete(id);

    if (!deletedResult) {
      return NextResponse.json({ error: 'Resultado no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resultado eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar resultado' }, { status: 500 });
  }
}