import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import RaceResult from '@/app/models/RaceResult';

// OBTENER resultados de una carrera específica
export async function GET(
  request: Request,
  { params }: { params: { raceId: string } }
) {
  await dbConnect();
  try {
    const results = await RaceResult.find({ race_id: params.raceId })
      .populate('racer_id', 'name number team nationality')
      .sort({ position: 1 });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 });
  }
}