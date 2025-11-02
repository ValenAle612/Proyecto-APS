'use client';

import { useEffect, useState } from 'react';

interface RaceResultWithRacer {
  _id: string;
  position: number;
  points: number;
  fastest_lap: boolean;
  dnf: boolean;
  dnf_reason?: string;
  racer_id: {
    _id: string;
    name: string;
    number: number;
    team: string;
    nationality?: string;
    category: string;
  };
}

interface StandingsViewProps {
  category?: string;
}

export default function StandingsView({ category = 'F1' }: StandingsViewProps) {
  const [results, setResults] = useState<RaceResultWithRacer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [category]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Endpoint solo por categoría
      const res = await fetch(`/api/race-results?category=${category}`);
      if (!res.ok) throw new Error('Error al cargar resultados');
      const data: RaceResultWithRacer[] = await res.json();

      const sorted = data.sort((a, b) => a.position - b.position);
      setResults(sorted);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-400">Cargando resultados...</p>;
  if (error) return <p className="text-red-400">❌ {error}</p>;
  if (results.length === 0) return <p className="text-gray-400">No hay resultados para {category}</p>;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Resultados - {category}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900 text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Pos</th>
              <th className="px-6 py-3 text-left">Nº</th>
              <th className="px-6 py-3 text-left">Piloto</th>
              <th className="px-6 py-3 text-left">Escudería</th>
              <th className="px-6 py-3 text-center">DNF</th>
              <th className="px-6 py-3 text-center">Vuelta rápida</th>
              <th className="px-6 py-3 text-right">Puntos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {results.map(r => (
              <tr key={r._id} className="hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 font-bold text-lg">{r.position}</td>
                <td className="px-6 py-4 font-mono font-bold text-gray-400">{r.racer_id.number}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{r.racer_id.name}</div>
                  {r.racer_id.nationality && <div className="text-sm text-gray-500">{r.racer_id.nationality}</div>}
                </td>
                <td className="px-6 py-4 text-gray-300">{r.racer_id.team}</td>
                <td className="px-6 py-4 text-center">{r.dnf ? '✅' : ''}</td>
                <td className="px-6 py-4 text-center text-purple-400">{r.fastest_lap ? '⚡' : ''}</td>
                <td className="px-6 py-4 text-right font-bold text-blue-400">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}