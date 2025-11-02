// src/app/admin/race-results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Race {
  _id: string;
  name: string;
  location: string;
  date: string;
  category: string;
  season: number;
  status: string;
}

interface Racer {
  _id: string;
  name: string;
  number: number;
  team: string;
}

interface RaceResult {
  _id: string;
  race_id: Race;
  racer_id: Racer;
  position: number;
  points: number;
  fastest_lap: boolean;
  dnf: boolean;
  dnf_reason?: string;
}

export default function AdminRaceResultsPage() {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRaces();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [selectedRace]);

  const fetchRaces = async () => {
    try {
      const response = await fetch('/api/races');
      if (!response.ok) throw new Error('Error al cargar carreras');
      const data = await response.json();
      setRaces(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = selectedRace === 'all' 
        ? '/api/race-results'
        : `/api/race-results?race_id=${selectedRace}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar resultados');
      
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este resultado?')) return;

    try {
      const response = await fetch(`/api/race-results/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setResults(results.filter(r => r._id !== id));
      alert('✅ Resultado eliminado correctamente');
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Administrar Resultados</h1>
          <p className="text-gray-400">Gestiona los resultados de las carreras</p>
        </div>
        <Link
          href="/admin/race-results/new"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Agregar Resultados
        </Link>
      </div>

      {/* Filtro por carrera */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium mb-2">
          Filtrar por carrera
        </label>
        <select
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
          className="w-full md:w-96 bg-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las carreras</option>
          {races.map(race => (
            <option key={race._id} value={race._id}>
              {race.name} - {race.category} ({new Date(race.date).getFullYear()})
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando resultados...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400">❌ {error}</p>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !error && results.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No hay resultados cargados</p>
          <Link
            href="/admin/race-results/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
          >
            Agregar primer resultado
          </Link>
        </div>
      )}

      {/* Lista de resultados */}
      {!loading && !error && results.length > 0 && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left">Carrera</th>
                  <th className="px-6 py-3 text-left">Piloto</th>
                  <th className="px-6 py-3 text-left">Escudería</th>
                  <th className="px-6 py-3 text-center">Posición</th>
                  <th className="px-6 py-3 text-center">Puntos</th>
                  <th className="px-6 py-3 text-center">V. Rápida</th>
                  <th className="px-6 py-3 text-center">DNF</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium">{result.race_id.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(result.race_id.date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-sm">
                          {result.racer_id.number}
                        </div>
                        <span className="font-medium">{result.racer_id.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {result.racer_id.team}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-lg ${
                        result.position === 1 ? 'text-yellow-400' :
                        result.position === 2 ? 'text-gray-300' :
                        result.position === 3 ? 'text-orange-400' :
                        'text-blue-400'
                      }`}>
                        {result.position}°
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-blue-400">
                      {result.points}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {result.fastest_lap ? (
                        <span className="text-purple-400">⚡</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {result.dnf ? (
                        <span className="text-red-400" title={result.dnf_reason}>❌</span>
                      ) : (
                        <span className="text-green-400">✓</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(result._id)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Resultados</p>
            <p className="text-2xl font-bold">{results.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Carreras con datos</p>
            <p className="text-2xl font-bold">
              {new Set(results.map(r => r.race_id._id)).size}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Pilotos únicos</p>
            <p className="text-2xl font-bold">
              {new Set(results.map(r => r.racer_id._id)).size}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">DNFs</p>
            <p className="text-2xl font-bold text-red-400">
              {results.filter(r => r.dnf).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}