// app/api/race-results/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import RaceResult from '@/app/models/RaceResult';

// OBTENER todos los resultados (con filtros opcionales)
export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get('race_id');
    const racerId = searchParams.get('racer_id');

    let query: any = {};
    if (raceId) query.race_id = raceId;
    if (racerId) query.racer_id = racerId;

    const results = await RaceResult.find(query)
      .populate('race_id', 'name location date category')
      .populate('racer_id', 'name number team nationality')
      .sort({ 'race_id': -1, position: 1 });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 });
  }
}

// CREAR un nuevo resultado
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Calcular puntos automáticamente si no se proporcionan
    if (!body.points) {
      body.points = calculatePoints(body.position, body.fastest_lap);
    }

    const newResult = await RaceResult.create(body);
    const populatedResult = await RaceResult.findById(newResult._id)
      .populate('race_id', 'name location date')
      .populate('racer_id', 'name number team');

    return NextResponse.json(populatedResult, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Ya existe un resultado para este piloto en esta carrera' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Error al crear resultado' }, { status: 400 });
  }
}

// Función auxiliar para calcular puntos F1
function calculatePoints(position: number, fastestLap: boolean = false): number {
  const F1_POINTS: { [key: number]: number } = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };
  
  let points = F1_POINTS[position] || 0;
  if (fastestLap && position <= 10) points += 1;
  
  return points;
}