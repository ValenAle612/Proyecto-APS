import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import RaceResult from '@/app/models/RaceResult';
import Race from '@/app/models/Race';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'F1';
    const season = parseInt(searchParams.get('season') || new Date().getFullYear().toString());

    // Obtener todas las carreras de la temporada/categoría
    const races = await Race.find({ category, season }).select('_id');
    const raceIds = races.map(r => r._id);

    // Agregar resultados
    const standings = await RaceResult.aggregate([
      {
        $match: { race_id: { $in: raceIds } }
      },
      {
        $group: {
          _id: '$racer_id',
          total_points: { $sum: '$points' },
          wins: { $sum: { $cond: [{ $eq: ['$position', 1] }, 1, 0] } },
          podiums: { $sum: { $cond: [{ $lte: ['$position', 3] }, 1, 0] } },
          fastest_laps: { $sum: { $cond: ['$fastest_lap', 1, 0] } },
          races_count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'racers',
          localField: '_id',
          foreignField: '_id',
          as: 'racer'
        }
      },
      { $unwind: '$racer' },
      {
        $project: {
          racer_id: '$_id',
          name: '$racer.name',
          number: '$racer.number',
          team: '$racer.team',
          nationality: '$racer.nationality',
          total_points: 1,
          wins: 1,
          podiums: 1,
          fastest_laps: 1,
          races_count: 1
        }
      },
      { $sort: { total_points: -1 } }
    ]);

    // Agregar posición
    const standingsWithPosition = standings.map((entry, index) => ({
      ...entry,
      position: index + 1
    }));

    return NextResponse.json(standingsWithPosition);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener clasificación' }, { status: 500 });
  }
}