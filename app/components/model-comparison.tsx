"use client"

import { useState } from "react"

import { ArrowLeft, BarChart3, GitCompare, Play, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import Sidebar from "./sidebar"

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface Model {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response"
  ofv?: number
  rse?: number
}

interface SimulationParams {
  doseAmount: string
  doseInterval: string
  numberOfDoses: string
  simulationDuration: string
  clearance: string
  volume: string
  absorptionRate: string
  bioavailability: string
}

export interface ModelComparisonProps {
  models: Model[]
  onBack: () => void
  onUserProfileClick?: () => void
  onHelpClick?: () => void
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ModelComparison({ models, onBack, onUserProfileClick, onHelpClick }: ModelComparisonProps) {
  /* ------------------ local state ------------------ */
  const [isSimulating, setIsSimulating] = useState(false)
  const [plotScale, setPlotScale] = useState<"linear" | "log">("linear")

  const [sharedParams, setSharedParams] = useState<SimulationParams>({
    doseAmount: "100",
    doseInterval: "24",
    numberOfDoses: "1",
    simulationDuration: "72",
    clearance: "10",
    volume: "70",
    absorptionRate: "1.0",
    bioavailability: "1.0",
  })

  /* ------------------ helpers ------------------ */
  const handleRunComparison = async () => {
    setIsSimulating(true)
    await new Promise((r) => setTimeout(r, 2000)) // mock API call
    setIsSimulating(false)
  }

  const colorForIndex = (idx: number) => (idx === 0 ? "blue" : "red")

  /* ------------------ render ------------------ */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (works on every page) */}
      <Sidebar onUserProfileClick={onUserProfileClick} onHelpClick={onHelpClick} />

      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ---- Header ---- */}
        <header className="bg-white border-b px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Analysis
              </Button>

              <div className="flex items-center space-x-2">
                <GitCompare className="h-5 w-5 text-purple-600" />
                <h1 className="text-xl font-semibold">Model Comparison</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="scale">Scale</Label>
                <Select value={plotScale} onValueChange={(v: "linear" | "log") => setPlotScale(v)}>
                  <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="Scale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="log">Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-green-600 hover:bg-green-700" onClick={handleRunComparison} disabled={isSimulating}>
                <Play className="mr-2 h-4 w-4" />
                {isSimulating ? "Simulating..." : "Run Comparison"}
              </Button>
            </div>
          </div>
        </header>

        {/* ---- Content ---- */}
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Model overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model, idx) => (
              <Card key={model.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{model.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`border-${colorForIndex(idx)}-500 text-${colorForIndex(idx)}-700`}
                      >
                        Model {idx + 1}
                      </Badge>
                      <Badge variant="secondary">{model.type.replace("_", " ").toUpperCase()}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-gray-600">
                  {model.ofv !== undefined && (
                    <p>
                      <strong>OFV:</strong> {model.ofv.toFixed(1)}
                    </p>
                  )}
                  {model.rse !== undefined && (
                    <p>
                      <strong>RSE:</strong> {model.rse.toFixed(1)}%
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shared dosing parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Shared Dosing Parameters</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Dose amount */}
              <div>
                <Label htmlFor="doseAmount">Dose (mg)</Label>
                <Input
                  id="doseAmount"
                  value={sharedParams.doseAmount}
                  onChange={(e) => setSharedParams({ ...sharedParams, doseAmount: e.target.value })}
                />
              </div>

              {/* Interval */}
              <div>
                <Label htmlFor="doseInterval">Interval (h)</Label>
                <Input
                  id="doseInterval"
                  value={sharedParams.doseInterval}
                  onChange={(e) =>
                    setSharedParams({
                      ...sharedParams,
                      doseInterval: e.target.value,
                    })
                  }
                />
              </div>

              {/* # doses */}
              <div>
                <Label htmlFor="numberOfDoses"># Doses</Label>
                <Input
                  id="numberOfDoses"
                  value={sharedParams.numberOfDoses}
                  onChange={(e) =>
                    setSharedParams({
                      ...sharedParams,
                      numberOfDoses: e.target.value,
                    })
                  }
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="simulationDuration">Duration (h)</Label>
                <Input
                  id="simulationDuration"
                  value={sharedParams.simulationDuration}
                  onChange={(e) =>
                    setSharedParams({
                      ...sharedParams,
                      simulationDuration: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Plot placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Side-by-Side Concentration–Time Plot</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 border rounded-lg flex items-center justify-center">
                {isSimulating ? (
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-purple-600 mx-auto mb-2" />
                    <p className="text-gray-600">Running comparison …</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click “Run Comparison” to generate plots</p>
                    <p className="text-xs text-gray-500 mt-1">Scale: {plotScale}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
