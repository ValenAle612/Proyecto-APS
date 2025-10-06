"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Plus, Pencil, Trash2, Calendar, MapPin } from "lucide-react"

interface Race {
  id: string
  name: string
  location: string
  date: string
  round: number
}

export function RaceManager() {
  const [races, setRaces] = useState<Race[]>([
    {
      id: "1",
      name: "Bahrain Grand Prix",
      location: "Sakhir",
      date: "2025-03-15",
      round: 1,
    },
    {
      id: "2",
      name: "Monaco Grand Prix",
      location: "Monte Carlo",
      date: "2025-05-25",
      round: 2,
    },
  ])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    round: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setRaces(
        races.map((race) =>
          race.id === editingId ? { ...race, ...formData, round: Number.parseInt(formData.round) } : race,
        ),
      )
      setEditingId(null)
    } else {
      const newRace: Race = {
        id: Date.now().toString(),
        ...formData,
        round: Number.parseInt(formData.round),
      }
      setRaces([...races, newRace])
    }
    setFormData({ name: "", location: "", date: "", round: "" })
    setIsAdding(false)
  }

  const handleEdit = (race: Race) => {
    setFormData({
      name: race.name,
      location: race.location,
      date: race.date,
      round: race.round.toString(),
    })
    setEditingId(race.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    setRaces(races.filter((race) => race.id !== id))
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: "", location: "", date: "", round: "" })
  }

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

      {/* Add/Edit Form */}
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
        {races
          .sort((a, b) => a.round - b.round)
          .map((race) => (
            <Card
              key={race.id}
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
                      onClick={() => handleDelete(race.id)}
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
