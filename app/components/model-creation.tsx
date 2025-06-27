"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, BookOpen, Plus, ChevronRight, Wand2, Code } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ModelWizard from "./model-wizard"
import ModelLibrary from "./model-library"

interface Model {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response"
  ofv?: number
  rse?: number
  children?: Model[]
  isExpanded?: boolean
}

interface LibraryModel {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response"
  description: string
  category: string
  complexity: "Basic" | "Intermediate" | "Advanced"
  pmlCode: string
  author: string
  tags: string[]
  indication: string
  administration: string
}

interface ModelCreationProps {
  analysisId: string
  existingModels: Model[]
  onModelCreated: (model: Model) => void
  onCancel: () => void
}

export default function ModelCreation({
  analysisId,
  existingModels = [], // ✅ guarantees we always have an array
  onModelCreated,
  onCancel,
}: ModelCreationProps) {
  const [selectedOption, setSelectedOption] = useState<"empty" | "existing" | "library" | "wizard" | "scratch" | null>(
    null,
  )
  const [selectedExistingModel, setSelectedExistingModel] = useState<Model | null>(null)
  const [scratchModelData, setScratchModelData] = useState({
    name: "",
    description: "",
    type: "population_pk" as "population_pk" | "pkpd" | "exposure_response",
    pmlCode: `# PML Model Code
# Define your pharmacometric model here

test() {
  # Model structure
  cfMicro(A1, Cl/V, first = (Dose / V))
  
  # Observations
  C = A1 / V
  observe(C)
  
  # Parameters
  stparm(Cl = tvCl)
  stparm(V = tvV)
  
  # Fixed effects
  fixef(tvCl = c(, 1, ))
  fixef(tvV = c(, 10, ))
  
  # Random effects
  ranef(diag(nCl, nV) = c(0.1, 0.1))
  
  # Error model
  error(CEps = 0.1)
}
`,
  })

  const handleCreateFromEmpty = () => {
    const newModel: Model = {
      id: Date.now().toString(),
      name: "New Empty Model",
      type: "population_pk",
      children: [],
      isExpanded: false,
    }
    onModelCreated(newModel)
  }

  const handleCreateFromExisting = () => {
    if (selectedExistingModel) {
      const newModel: Model = {
        id: Date.now().toString(),
        name: `${selectedExistingModel.name} (Copy)`,
        type: selectedExistingModel.type,
        children: [],
        isExpanded: false,
      }
      onModelCreated(newModel)
    }
  }

  const handleCreateFromLibrary = (libraryModel: LibraryModel) => {
    const newModel: Model = {
      id: Date.now().toString(),
      name: libraryModel.name,
      type: libraryModel.type,
      children: [],
      isExpanded: false,
    }
    onModelCreated(newModel)
  }

  const handleWizardComplete = (wizardModel: Model) => {
    onModelCreated(wizardModel)
  }

  const handleCreateFromScratch = () => {
    if (!scratchModelData.name.trim()) return

    const newModel: Model = {
      id: Date.now().toString(),
      name: scratchModelData.name,
      type: scratchModelData.type,
      children: [],
      isExpanded: false,
    }
    onModelCreated(newModel)
  }

  const getAllModelsFlat = (models: Model[] = []): Model[] => {
    const result: Model[] = []
    models.forEach((model) => {
      result.push(model)
      if (model.children) {
        result.push(...getAllModelsFlat(model.children))
      }
    })
    return result
  }

  const flatExistingModels = getAllModelsFlat(existingModels)

  if (selectedOption === "wizard") {
    return (
      <ModelWizard
        analysisId={analysisId}
        onModelCreated={handleWizardComplete}
        onCancel={() => setSelectedOption(null)}
      />
    )
  }

  if (selectedOption === "scratch") {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => setSelectedOption(null)} className="p-0 h-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <CardTitle>Create Model from Scratch</CardTitle>
            </div>
            <Button
              onClick={handleCreateFromScratch}
              disabled={!scratchModelData.name.trim()}
              className="bg-black hover:bg-gray-800"
            >
              Create & Start Simulation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="modelName">Model Name *</Label>
                <Input
                  id="modelName"
                  value={scratchModelData.name}
                  onChange={(e) => setScratchModelData({ ...scratchModelData, name: e.target.value })}
                  placeholder="Enter model name..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="modelType">Model Type</Label>
                <Select
                  value={scratchModelData.type}
                  onValueChange={(value: "population_pk" | "pkpd" | "exposure_response") =>
                    setScratchModelData({ ...scratchModelData, type: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="population_pk">Population PK</SelectItem>
                    <SelectItem value="pkpd">PK/PD</SelectItem>
                    <SelectItem value="exposure_response">Exposure-Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="modelDescription">Description</Label>
                <Textarea
                  id="modelDescription"
                  value={scratchModelData.description}
                  onChange={(e) => setScratchModelData({ ...scratchModelData, description: e.target.value })}
                  placeholder="Describe your model..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Getting Started</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Modify the PML code template on the right</li>
                  <li>• Define your structural model and parameters</li>
                  <li>• Set initial parameter estimates</li>
                  <li>• Configure error models and random effects</li>
                </ul>
              </div>
            </div>

            {/* PML Code Editor */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="pmlCode">PML Code</Label>
                <Textarea
                  id="pmlCode"
                  value={scratchModelData.pmlCode}
                  onChange={(e) => setScratchModelData({ ...scratchModelData, pmlCode: e.target.value })}
                  rows={20}
                  className="mt-1 font-mono text-sm"
                  placeholder="Enter your PML code here..."
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  Validate Syntax
                </Button>
                <Button variant="outline" size="sm">
                  Load Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (selectedOption === "existing") {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => setSelectedOption(null)} className="p-0 h-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <CardTitle>Derive from Existing Model</CardTitle>
            </div>
            <Button
              onClick={handleCreateFromExisting}
              disabled={!selectedExistingModel}
              className="bg-black hover:bg-gray-800"
            >
              Create Model
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flatExistingModels.length === 0 ? (
              <div className="text-center py-8">
                <Copy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No existing models</h3>
                <p className="text-gray-600">Create your first model to derive from existing ones</p>
              </div>
            ) : (
              flatExistingModels.map((model) => (
                <Card
                  key={model.id}
                  className={`cursor-pointer transition-all ${
                    selectedExistingModel?.id === model.id
                      ? "ring-2 ring-black bg-gray-50"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => setSelectedExistingModel(model)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{model.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{model.type.replace("_", " ")}</p>
                        {model.ofv && (
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">OFV: {model.ofv.toFixed(1)}</span>
                            {model.rse && <span className="text-xs text-gray-500">RSE: {model.rse.toFixed(1)}%</span>}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (selectedOption === "library") {
    return <ModelLibrary onModelSelected={handleCreateFromLibrary} onCancel={() => setSelectedOption(null)} />
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={onCancel} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle>Create New Model</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Start with Empty Model */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-dashed border-gray-300 hover:border-black"
            onClick={handleCreateFromEmpty}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[280px]">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Plus className="h-7 w-7 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start with Empty Model</h3>
              <p className="text-sm text-gray-600 mb-3">
                Build a completely new nonlinear mixed effects model from scratch with your own specifications.
              </p>
              <div className="text-xs text-gray-500">
                <div>• Define your own structural model</div>
                <div>• Set custom parameters</div>
                <div>• Full control over model structure</div>
              </div>
            </CardContent>
          </Card>

          {/* Model Wizard */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-gray-300 hover:border-black"
            onClick={() => setSelectedOption("wizard")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[280px]">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Wand2 className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start using Model Wizard</h3>
              <p className="text-sm text-gray-600 mb-3">
                Step-by-step guided process to create the optimal model based on your study design and objectives.
              </p>
              <div className="text-xs text-gray-500">
                <div>• Guided model selection</div>
                <div>• Study design optimization</div>
                <div>• Best practice recommendations</div>
              </div>
              <div className="mt-3">
                <Badge className="bg-purple-100 text-purple-800">Recommended</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Derive from Existing Model */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-gray-300 hover:border-black"
            onClick={() => setSelectedOption("existing")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[280px]">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Copy className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Derive from Existing Model</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create a new model based on an existing model in this analysis with modifications.
              </p>
              <div className="text-xs text-gray-500">
                <div>• Copy existing model structure</div>
                <div>• Modify parameters as needed</div>
                <div>• Maintain model history</div>
              </div>
              <div className="mt-3">
                <Badge variant="secondary">{flatExistingModels.length} models available</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Create from Scratch */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-gray-300 hover:border-black"
            onClick={() => setSelectedOption("scratch")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[280px]">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Code className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create from Scratch</h3>
              <p className="text-sm text-gray-600 mb-3">
                Write your own PML code and define every aspect of your pharmacometric model.
              </p>
              <div className="text-xs text-gray-500">
                <div>• Full PML code control</div>
                <div>• Custom model structures</div>
                <div>• Advanced modeling features</div>
              </div>
              <div className="mt-3">
                <Badge variant="outline">Advanced</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Select from Model Library */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-gray-300 hover:border-black col-span-full"
            onClick={() => setSelectedOption("library")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[200px]">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <BookOpen className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select from Model Library</h3>
              <p className="text-sm text-gray-600 mb-3">
                Browse and search a comprehensive collection of validated pharmacometric models with PML code.
              </p>
              <div className="flex items-center space-x-6 text-xs text-gray-500">
                <div>• Pre-validated model structures</div>
                <div>• Complete PML code examples</div>
                <div>• Industry standard approaches</div>
              </div>
              <div className="mt-3">
                <Badge variant="secondary">50+ models available</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
