"use client"

import { useState } from "react"
import { RaceManager } from "@/app/components/race-manager"
import { RacerManager } from "@/app/components/racer-manager"
import { Flag, Users, Sun, Moon } from "lucide-react"
import { useTheme } from "@/app/components/theme-provider"
import { Button } from "@/app/components/ui/button"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"races" | "racers">("races")
  const { theme, toggleTheme } = useTheme()

  return (
     <main className="h-screen w-full mb-96 relative bg-gris_claro/80">
      {/* Header */}
      <header className="border-b mt-[90px] border-border bg-black/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Flag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-mono text-3xl font-bold uppercase tracking-tight text-foreground">
                  F1 Race Manager
                </h1>
                <p className="text-sm text-muted-foreground">Manage races and racers</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-azul/80">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("races")}
              className={`flex items-center gap-2 border-b-2 px-6 py-4 font-mono text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeTab === "races"
                  ? "border-white text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Flag className="h-4 w-4" />
              Race Calendar
            </button>
            <button
              onClick={() => setActiveTab("racers")}
              className={`flex items-center gap-2 border-b-2 px-6 py-4 font-mono text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeTab === "racers"
                  ? "border-white text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              Racers
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-screen mt-[20px] container mx-auto px-4">
        {activeTab === "races" ? <RaceManager /> : <RacerManager />}</div>
    </main>
  )
}
