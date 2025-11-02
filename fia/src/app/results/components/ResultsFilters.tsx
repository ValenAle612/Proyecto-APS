'use client';

import { useState, useEffect } from 'react';

interface ResultsFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
}

interface FiltersData {
  categories: string[];
}

export default function ResultsFilters({ onFilterChange }: ResultsFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'F1',
  });
  
  const [availableFilters, setAvailableFilters] = useState<FiltersData>({
    categories: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableFilters();
  }, []);

  const fetchAvailableFilters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/standings/filters');
      if (!response.ok) throw new Error('Error al cargar filtros');

      const data = await response.json();
      setAvailableFilters(data);

      if (data.categories.length > 0) {
        const defaultFilters = {
          category: data.categories[0]
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
      }
    } catch (error) {
      console.error('Error al cargar filtros:', error);
      setAvailableFilters({ categories: ['F1'] });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value: string) => {
    const newFilters = { category: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  if (loading) return <p className="text-gray-400">Cargando filtros...</p>;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>
      <div>
        <label className="block text-sm font-medium mb-2">Categoría</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="w-full bg-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={availableFilters.categories.length === 0}
        >
          {availableFilters.categories.length === 0 ? (
            <option value="">No hay categorías disponibles</option>
          ) : (
            availableFilters.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}
