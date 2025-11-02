// src/app/admin/race-results/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Race {
  _id: string;
  name: string;
  location: string;
  date: string;
}

interface Racer {
  _id: string;
  name: string;
  number: number;
  team: string;
  category: string;
}

interface ResultEntry {
  racer_id: string;
  position: number;
  points: number;
  fastest_lap: boolean;
  dnf: boolean;
  dnf_reason?: string;
}

export default function NewRaceResultsPage() {
  const router = useRouter();

  const [races, setRaces] = useState<Race[]>([]);
  const [racers, setRacers] = useState<Racer[]>([]);
  const [filteredRacers, setFilteredRacers] = useState<Racer[]>([]);

  const [selectedRace, setSelectedRace] = useState<string>('');
  const [results, setResults] = useState<ResultEntry[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sistema de puntos F1
  const F1_POINTS: { [key: number]: number } = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };

  // Fetch inicial
  useEffect(() => {
    fetchRaces();
    fetchRacers();
    console.log("🔥 Cliente cargado en NewRaceResultsPage");
  }, []);

  // Al seleccionar carrera
  useEffect(() => {
    if (!selectedRace || racers.length === 0) return;

    console.log("Carrera seleccionada:", selectedRace);
    console.log("Pilotos cargados:", racers.length);

    // Mostrar todos los pilotos
    setFilteredRacers(racers);

    // Inicializar resultados
    initializeResults(racers);
  }, [selectedRace, racers]);

  const fetchRaces = async () => {
    try {
      const res = await fetch('/api/races');
      if (!res.ok) throw new Error('Error al cargar carreras');
      const data = await res.json();
      setRaces(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchRacers = async () => {
    try {
      const res = await fetch('/api/racers');
      if (!res.ok) throw new Error('Error al cargar pilotos');
      const data = await res.json();
      setRacers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const initializeResults = (racersToUse: Racer[]) => {
    const initialResults = racersToUse.map((racer, index) => ({
      racer_id: racer._id,
      position: index + 1,
      points: calculatePoints(index + 1, false),
      fastest_lap: false,
      dnf: false,
      dnf_reason: ''
    }));
    setResults(initialResults);
  };

  const calculatePoints = (position: number, fastestLap: boolean) => {
    let points = F1_POINTS[position] || 0;
    if (fastestLap && position <= 10) points += 1;
    return points;
  };

  const handlePositionChange = (index: number, newPosition: number) => {
    const updatedResults = [...results];
    updatedResults[index].position = newPosition;
    updatedResults[index].points = calculatePoints(newPosition, updatedResults[index].fastest_lap);
    setResults(updatedResults);
  };

  const handleFastestLapChange = (index: number) => {
    const updatedResults = [...results];
    updatedResults.forEach((r, i) => {
      if (i !== index) r.fastest_lap = false;
    });
    updatedResults[index].fastest_lap = !updatedResults[index].fastest_lap;
    updatedResults[index].points = calculatePoints(
      updatedResults[index].position,
      updatedResults[index].fastest_lap
    );
    setResults(updatedResults);
  };

  const handleDNFChange = (index: number) => {
    const updatedResults = [...results];
    updatedResults[index].dnf = !updatedResults[index].dnf;
    if (updatedResults[index].dnf) {
      updatedResults[index].points = 0;
      updatedResults[index].fastest_lap = false;
    } else {
      updatedResults[index].points = calculatePoints(
        updatedResults[index].position,
        updatedResults[index].fastest_lap
      );
    }
    setResults(updatedResults);
  };

  const handleDNFReasonChange = (index: number, reason: string) => {
    const updatedResults = [...results];
    updatedResults[index].dnf_reason = reason;
    setResults(updatedResults);
  };

  const handleRemoveRacer = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRace) { alert('Selecciona una carrera'); return; }
    if (results.length === 0) { alert('Agrega al menos un resultado'); return; }

    const positions = results.map(r => r.position);
    if (positions.some((pos, i) => positions.indexOf(pos) !== i)) {
      alert('❌ Hay posiciones duplicadas');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const promises = results.map(result =>
        fetch('/api/race-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ race_id: selectedRace, ...result })
        })
      );

      const responses = await Promise.all(promises);
      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) {
        const errorData = await failed[0].json();
        throw new Error(errorData.error || 'Error al guardar resultados');
      }

      alert('✅ Resultados guardados correctamente');
      router.push('/admin/race-results');
    } catch (err: any) {
      setError(err.message);
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRacerInfo = (racerId: string) => filteredRacers.find(r => r._id === racerId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/race-results" className="text-gray-400 hover:text-white transition">
          ← Volver
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Agregar Resultados de Carrera</h1>
          <p className="text-gray-400">Registra los resultados de una carrera completa</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <label className="block text-lg font-medium mb-3">1. Selecciona la carrera</label>
          <select
            value={selectedRace}
            onChange={e => setSelectedRace(e.target.value)}
            className="w-full bg-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona una carrera...</option>
            {races.map(race => (
              <option key={race._id} value={race._id}>
                {race.name} - {new Date(race.date).toLocaleDateString('es-ES')}
              </option>
            ))}
          </select>
          {races.length === 0 && (
            <p className="mt-2 text-sm text-gray-400">
              No hay carreras disponibles. <Link href="/races" className="text-blue-400 hover:underline">Crea una carrera primero</Link>
            </p>
          )}
        </div>

        {selectedRace && filteredRacers.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">2. Ingresa los resultados ({results.length} pilotos)</h2>
              <div className="text-sm text-gray-400">⚡ = Vuelta rápida (+1 punto si termina en top 10)</div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {results.map((result, index) => {
                const racer = getRacerInfo(result.racer_id);
                if (!racer) return null;

                return (
                  <div key={result.racer_id} className="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold flex-shrink-0">{racer.number}</div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{racer.name}</p>
                          <p className="text-sm text-gray-400 truncate">{racer.team}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-24">
                      <label className="block text-xs text-gray-400 mb-1">Posición</label>
                      <input
                        type="number"
                        min={1}
                        value={result.position}
                        onChange={e => handlePositionChange(index, parseInt(e.target.value))}
                        disabled={result.dnf}
                        className="w-full bg-gray-600 rounded px-3 py-2 text-center font-bold disabled:opacity-50"
                        required
                      />
                    </div>

                    <div className="w-20">
                      <label className="block text-xs text-gray-400 mb-1">Puntos</label>
                      <div className="bg-gray-600 rounded px-3 py-2 text-center font-bold text-blue-400">{result.points}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFastestLapChange(index)}
                      disabled={result.dnf}
                      className={`w-10 h-10 rounded flex items-center justify-center transition disabled:opacity-30 ${
                        result.fastest_lap ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      title="Vuelta rápida"
                    >⚡</button>

                    <button
                      type="button"
                      onClick={() => handleDNFChange(index)}
                      className={`px-4 py-2 rounded font-medium transition ${
                        result.dnf ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      title="Did Not Finish"
                    >DNF</button>

                    <button
                      type="button"
                      onClick={() => handleRemoveRacer(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                      title="Eliminar de la carrera"
                    >🗑️</button>

                    {result.dnf && (
                      <div className="w-full mt-2 col-span-full">
                        <input
                          type="text"
                          placeholder="Razón del abandono (ej: Accidente, Problema mecánico)"
                          value={result.dnf_reason || ''}
                          onChange={e => handleDNFReasonChange(index, e.target.value)}
                          className="w-full bg-gray-600 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedRace && filteredRacers.length === 0 && (
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
            <p className="text-yellow-400">
              ℹ️ No hay pilotos disponibles. <Link href="/racers" className="underline">Agrega pilotos primero</Link>
            </p>
          </div>
        )}

        {selectedRace && results.length > 0 && (
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
            >{loading ? 'Guardando...' : '💾 Guardar Resultados'}</button>
            <Link href="/admin/race-results" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition">Cancelar</Link>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
