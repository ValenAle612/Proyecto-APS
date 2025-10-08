"use client"

import type React from "react"
import { useState, useEffect } from "react" // Importamos useEffect
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Plus, Pencil, Trash2, Calendar, MapPin } from "lucide-react"

// La interfaz ahora usará `_id` que viene de MongoDB
interface Race {
  _id: string // MongoDB usa _id como identificador único
  name: string
  location: string
  date: string
  round: number
}

export function RaceManager() {
  const [races, setRaces] = useState<Race[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    round: "",
  })
  
  // Función para cargar las carreras desde la API
  const fetchRaces = async () => {
    try {
      const response = await fetch('/api/races');
      const data: Race[] = await response.json();
      // Formateamos la fecha para que el input type="date" la acepte
      const formattedData = data.map(race => ({
        ...race,
        date: new Date(race.date).toISOString().split('T')[0]
      }));
      setRaces(formattedData);
    } catch (error) {
      console.error("Error al cargar las carreras:", error);
    }
  };

  // useEffect para cargar las carreras cuando el componente se monta
  useEffect(() => {
    fetchRaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const raceData = {
        ...formData,
        round: Number.parseInt(formData.round)
    };

    try {
      if (editingId) {
        // Lógica para ACTUALIZAR (PUT)
        await fetch(`/api/races/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(raceData),
        });
      } else {
        // Lógica para CREAR (POST)
        await fetch('/api/races', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(raceData),
        });
      }
      
      // Limpiar y recargar datos
      handleCancel();
      await fetchRaces(); // Recargar la lista de carreras desde la BD

    } catch (error) {
        console.error("Error al guardar la carrera:", error);
    }
  }

  const handleEdit = (race: Race) => {
    setFormData({
      name: race.name,
      location: race.location,
      date: race.date,
      round: race.round.toString(),
    })
    setEditingId(race._id) // Usamos _id
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta carrera?")) {
        try {
            await fetch(`/api/races/${id}`, {
                method: 'DELETE',
            });
            await fetchRaces(); // Recargar la lista de carreras
        } catch (error) {
            console.error("Error al eliminar la carrera:", error);
        }
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: "", location: "", date: "", round: "" })
  }

  // El resto de tu JSX permanece casi igual, solo cambia `race.id` por `race._id`
  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!isAdding && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAdding(true)}
            className="gap-2 bg-primary font-mono font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Race
          </Button>
        </div>
      )}

      {/* Add/Edit Form (Sin cambios en el JSX del formulario) */}
      {isAdding && (
         <Card className="group relative overflow-hidden border-azul border-2 bg-black/70 p-6 shadow-2xl backdrop-blur-md transition-all hover:border-white/50">
           <h3 className="mb-4 font-mono text-lg font-bold uppercase tracking-wide text-foreground">
             {editingId ? "Edit Race" : "Add New Race"}
           </h3>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2">
               <div>
                 <label className="mb-2 block text-sm font-medium text-muted-foreground">Race Name</label>
                 <Input
                   required
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   placeholder="e.g., Monaco Grand Prix"
                   className="bg-background text-foreground"
                 />
               </div>
               <div>
                 <label className="mb-2 block text-sm font-medium text-muted-foreground">Location</label>
                 <Input
                   required
                   value={formData.location}
                   onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                   placeholder="e.g., Monte Carlo"
                   className="bg-background text-foreground"
                 />
               </div>
               <div>
                 <label className="mb-2 block text-sm font-medium text-muted-foreground">Date</label>
                 <Input
                   required
                   type="date"
                   value={formData.date}
                   onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                   className="bg-background text-foreground"
                 />
               </div>
               <div>
                 <label className="mb-2 block text-sm font-medium text-muted-foreground">Round</label>
                 <Input
                   required
                   type="number"
                   min="1"
                   value={formData.round}
                   onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                   placeholder="e.g., 1"
                   className="bg-background text-foreground"
                 />
               </div>
             </div>
             <div className="flex gap-3">
               <Button
                 type="submit"
                 className="bg-black font-mono uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
               >
                 {editingId ? "Update" : "Add"} Race
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

      {/* Races Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {races.map((race) => (
            <Card
              key={race._id} // <- CAMBIO: Usar _id como key
              className="group relative overflow-hidden border-azul border-2 bg-black/70 p-6 shadow-2xl backdrop-blur-md transition-all hover:border-white"
            >
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                    Round {race.round}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(race)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(race._id)} // <- CAMBIO: Pasar _id
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-mono text-xl font-bold uppercase leading-tight tracking-tight text-foreground">
                  {race.name}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{race.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(race.date).toLocaleDateString("en-US", {
                      timeZone: 'UTC', // Importante para que no cambie el día
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {races.length === 0 && !isAdding && (
        <Card className="border-dashed bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">No races added yet. Click "Add Race" to get started.</p>
        </Card>
      )}
    </div>
  )
}