// app/results/api/standings/filters/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Racer from '@/app/models/Racer';

export async function GET() {
  await dbConnect();

  try {
    const categories = await Racer.distinct('category'); // todas las categorías existentes
    return NextResponse.json({ categories, seasons: [] }); // no hay temporadas
  } catch (error) {
    console.error('Error al obtener filtros:', error);
    return NextResponse.json(
      { categories: ['F1'], seasons: [] },
      { status: 200 }
    );
  }
}
