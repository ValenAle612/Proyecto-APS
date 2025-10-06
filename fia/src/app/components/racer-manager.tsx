"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Plus, Pencil, Trash2, Trophy, Flag } from "lucide-react"

interface Racer {
  id: string
  name: string
  team: string
  number: number
  nationality: string
}

export function RacerManager() {
  const [racers, setRacers] = useState<Racer[]>([
    {
      id: "1",
      name: "Max Verstappen",
      team: "Red Bull Racing",
      number: 1,
      nationality: "Netherlands",
    },
    {
      id: "2",
      name: "Lewis Hamilton",
      team: "Mercedes",
      number: 44,
      nationality: "United Kingdom",
    },
  ])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    number: "",
    nationality: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setRacers(
        racers.map((racer) =>
          racer.id === editingId ? { ...racer, ...formData, number: Number.parseInt(formData.number) } : racer,
        ),
      )
      setEditingId(null)
    } else {
      const newRacer: Racer = {
        id: Date.now().toString(),
        ...formData,
        number: Number.parseInt(formData.number),
      }
      setRacers([...racers, newRacer])
    }
    setFormData({ name: "", team: "", number: "", nationality: "" })
    setIsAdding(false)
  }

  const handleEdit = (racer: Racer) => {
    setFormData({
      name: racer.name,
      team: racer.team,
      number: racer.number.toString(),
      nationality: racer.nationality,
    })
    setEditingId(racer.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    setRacers(racers.filter((racer) => racer.id !== id))
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: "", team: "", number: "", nationality: "" })
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
            Add Racer
          </Button>
        </div>
      )}

      {/* Add/Edit Form */}
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

      {/* Racers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {racers
          .sort((a, b) => a.number - b.number)
          .map((racer) => (
            <Card
              key={racer.id}
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
                    onClick={() => handleDelete(racer.id)}
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
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span>{racer.team}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Flag className="h-4 w-4" />
                    <span>{racer.nationality}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {racers.length === 0 && !isAdding && (
        <Card className="border-dashed bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">No racers added yet. Click "Add Racer" to get started.</p>
        </Card>
      )}
    </div>
  )
}
