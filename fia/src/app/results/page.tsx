'use client';

import { useState } from 'react';
import ResultsFilters, { type FilterState } from './components/ResultsFilters';
import StandingsView from './components/StandingsView';

export default function ResultadosPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'F1'
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resultados</h1>
        <p className="text-gray-400">Visualiza los puntajes y resultados por categoría</p>
      </div>

      <ResultsFilters onFilterChange={handleFilterChange} />
      
      <StandingsView category={filters.category} />
    </div>
  );
}
