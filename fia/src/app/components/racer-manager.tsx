"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Plus, Pencil, Trash2, Trophy, Flag, Car, Search, Filter, X, UserCircle } from "lucide-react"

interface Racer {
  _id: string;
  name: string;
  team: string;
  number: number;
  nationality: string;
  category: string;
  role: string; // ← AGREGADO
}

export function RacerManager() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    number: "",
    nationality: "",
    category: "",
    role: "", // ← AGREGADO
  });

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterRole, setFilterRole] = useState(""); // ← AGREGADO
  const [showFilters, setShowFilters] = useState(false);

  const fetchRacers = async () => {
    try {
      const response = await fetch('/api/racers');
      const data = await response.json();
      setRacers(data);
    } catch (error) {
      console.error("Error al cargar los pilotos:", error);
    }
  };

  useEffect(() => {
    fetchRacers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const racerData = {
      ...formData,
      number: Number.parseInt(formData.number),
    };

    try {
      const url = editingId ? `/api/racers/${editingId}` : '/api/racers';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(racerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Algo salió mal');
      }

      handleCancel();
      await fetchRacers();
    } catch (error: any) {
      console.error("Error al guardar el piloto:", error);
      alert(error.message);
    }
  };

  const handleEdit = (racer: Racer) => {
    setFormData({
      name: racer.name,
      team: racer.team,
      number: racer.number.toString(),
      nationality: racer.nationality,
      category: racer.category,
      role: racer.role, // ← AGREGADO
    });
    setEditingId(racer._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar a este piloto?")) {
      try {
        await fetch(`/api/racers/${id}`, {
          method: 'DELETE',
        });
        await fetchRacers();
      } catch (error) {
        console.error("Error al eliminar el piloto:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", team: "", number: "", nationality: "", category: "", role: "" }); // ← ACTUALIZADO
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterTeam("");
    setFilterRole(""); // ← AGREGADO
  };

  const uniqueCategories = Array.from(new Set(racers.map(r => r.category))).sort();
  const uniqueTeams = Array.from(new Set(racers.map(r => r.team))).sort();
  const uniqueRoles = ["Titular", "Suplente", "Reserva"]; // ← AGREGADO

  const filteredRacers = racers.filter(racer => {
    const matchesSearch = racer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         racer.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || racer.category === filterCategory;
    const matchesTeam = !filterTeam || racer.team === filterTeam;
    const matchesRole = !filterRole || racer.role === filterRole; // ← AGREGADO
    
    return matchesSearch && matchesCategory && matchesTeam && matchesRole; // ← ACTUALIZADO
  });

  const hasActiveFilters = searchTerm || filterCategory || filterTeam || filterRole; // ← ACTUALIZADO

  // Función para obtener el color del badge según el rol
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'Titular': return 'bg-green-600/80';
      case 'Suplente': return 'bg-yellow-600/80';
      case 'Reserva': return 'bg-blue-600/80';
      default: return 'bg-gray-600/80';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="gap-2 bg-primary font-mono font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Racer
          </Button>
        )}
        
        {!isAdding && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 font-mono uppercase tracking-wide"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="gap-2 font-mono uppercase tracking-wide"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        )}
      </div>

      {showFilters && !isAdding && (
        <Card className="border-azul border-2 bg-black/70 p-6 shadow-2xl backdrop-blur-md">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or nationality..."
                  className="bg-background pl-10 text-foreground"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Team
                </label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">All Teams</option>
                  {uniqueTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              {/* ← NUEVO FILTRO DE ROL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-border pt-3 text-sm text-muted-foreground">
              Showing {filteredRacers.length} of {racers.length} racers
            </div>
          </div>
        </Card>
      )}

      {isAdding && (
        <Card className="group relative overflow-hidden border-azul border-2 bg-black/70 p-6 shadow-2xl backdrop-blur-md transition-all hover:border-white">
          <h3 className="mb-4 font-mono text-lg font-bold uppercase tracking-wide text-foreground">
            {editingId ? "Edit Racer" : "Add New Racer"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Driver Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Max Verstappen"
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Team</label>
                <Input
                  required
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="e.g., Red Bull Racing"
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Car Number</label>
                <Input
                  required
                  type="number"
                  min="1"
                  max="99"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., 1"
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Nationality</label>
                <Input
                  required
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="e.g., Netherlands"
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Category</label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., F1"
                  className="bg-background text-foreground"
                />
              </div>
              {/* ← NUEVO CAMPO DE ROL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Role</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="" disabled>Select role...</option>
                  <option value="Titular">Titular</option>
                  <option value="Suplente">Suplente</option>
                  <option value="Reserva">Reserva</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-black font-mono uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
              >
                {editingId ? "Update" : "Add"} Racer
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="font-mono uppercase tracking-wide bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRacers.map((racer) => (
          <Card
            key={racer._id}
            className="group relative overflow-hidden border-azul border-2 bg-black/70 p-6 shadow-2xl backdrop-blur-md transition-all hover:border-white/50"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-azul/90 border-2 border-white/20">
                <span className="font-mono text-2xl font-bold text-white/80">{racer.number}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(racer)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(racer._id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-mono text-xl font-bold uppercase leading-tight tracking-tight text-foreground">
                {racer.name}
              </h3>
              {/* ← BADGE DE ROL */}
              <div className="mb-2">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${getRoleBadgeColor(racer.role)}`}>
                  {racer.role}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>{racer.team}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flag className="h-4 w-4" />
                  <span>{racer.nationality}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Car className="h-4 w-4" />
                  <span>{racer.category}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRacers.length === 0 && !isAdding && (
        <Card className="border-dashed bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters 
              ? "No racers match your filters. Try adjusting your search criteria."
              : "No racers added yet. Click 'Add Racer' to get started."}
          </p>
        </Card>
      )}
    </div>
  )
}