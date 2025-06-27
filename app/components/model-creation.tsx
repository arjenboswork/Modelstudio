"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Wand2, Copy, Code, Play, BookOpen, Lightbulb } from "lucide-react"

interface Model {
  id: string
  name: string
  type: string
  description: string
  category: string
  complexity: "Basic" | "Intermediate" | "Advanced"
  parameters: number
  equations: number
  lastModified: string
  author: string
  tags: string[]
  pmlCode?: string
}

interface ModelCreationProps {
  onBack: () => void
  onModelCreated?: (model: Model) => void
  onCancel?: () => void
  existingModels?: Model[]
}

const mockModels: Model[] = [
  {
    id: "1",
    name: "One Compartment IV",
    type: "Pharmacokinetic",
    description: "Single compartment model with IV administration",
    category: "Basic PK",
    complexity: "Basic",
    parameters: 3,
    equations: 2,
    lastModified: "2024-01-15",
    author: "System",
    tags: ["PK", "IV", "Linear"],
  },
  {
    id: "2",
    name: "Two Compartment Oral",
    type: "Pharmacokinetic",
    description: "Two compartment model with first-order absorption",
    category: "Basic PK",
    complexity: "Intermediate",
    parameters: 6,
    equations: 4,
    lastModified: "2024-01-18",
    author: "System",
    tags: ["PK", "Oral", "Absorption"],
  },
  {
    id: "3",
    name: "Emax PD Model",
    type: "Pharmacodynamic",
    description: "Effect compartment with Emax relationship",
    category: "PK/PD",
    complexity: "Intermediate",
    parameters: 4,
    equations: 3,
    lastModified: "2024-01-20",
    author: "System",
    tags: ["PD", "Emax", "Effect"],
  },
]

export default function ModelCreation({
  onBack,
  onModelCreated = () => {},
  onCancel = () => {},
  existingModels = [],
}: ModelCreationProps) {
  const [creationMethod, setCreationMethod] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<Model | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Form state for creating from scratch
  const [modelName, setModelName] = useState("")
  const [modelDescription, setModelDescription] = useState("")
  const [modelType, setModelType] = useState("")
  const [pmlCode, setPmlCode] = useState(`test(){
  cfMicro(A1, Cl/V, first = (Dose / V))
}

fixef{
  Cl ~ 1
  V ~ 1
}

ranef{
  Cl ~ 1
  V ~ 1
}`)

  const getAllModelsFlat = () => {
    const allModels = [...mockModels, ...existingModels]
    return allModels
  }

  const handleMethodSelect = (method: string) => {
    setCreationMethod(method)
    if (method === "scratch") {
      setShowDetails(true)
    }
  }

  const handleTemplateSelect = (model: Model) => {
    setSelectedTemplate(model)
    setShowDetails(true)
  }

  const handleCreateFromEmpty = () => {
    const newModel: Model = {
      id: Date.now().toString(),
      name: modelName,
      type: modelType,
      description: modelDescription,
      category: "Custom",
      complexity: "Basic",
      parameters: 0,
      equations: 0,
      lastModified: new Date().toISOString().split("T")[0],
      author: "User",
      tags: ["Custom"],
      pmlCode: pmlCode,
    }

    onModelCreated(newModel)
  }

  const handleCreateFromTemplate = () => {
    if (selectedTemplate) {
      const newModel: Model = {
        ...selectedTemplate,
        id: Date.now().toString(),
        name: modelName || selectedTemplate.name,
        description: modelDescription || selectedTemplate.description,
        lastModified: new Date().toISOString().split("T")[0],
        author: "User",
      }

      onModelCreated(newModel)
    }
  }

  if (showDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setShowDetails(false)} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {creationMethod === "scratch" ? "Create Model from Scratch" : "Create from Template"}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder={selectedTemplate?.name || "Enter model name"}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={modelDescription}
                  onChange={(e) => setModelDescription(e.target.value)}
                  placeholder={selectedTemplate?.description || "Describe your model"}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="type">Model Type</Label>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pharmacokinetic">Pharmacokinetic</SelectItem>
                    <SelectItem value="Pharmacodynamic">Pharmacodynamic</SelectItem>
                    <SelectItem value="PK/PD">PK/PD</SelectItem>
                    <SelectItem value="PBPK">PBPK</SelectItem>
                    <SelectItem value="QSP">QSP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {creationMethod === "scratch" && (
                <div className="flex items-center justify-between pt-4">
                  <Button
                    onClick={handleCreateFromEmpty}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!modelName || !modelDescription || !modelType}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Create & Start Simulation
                  </Button>
                </div>
              )}

              {creationMethod === "template" && (
                <div className="flex items-center justify-between pt-4">
                  <Button
                    onClick={handleCreateFromTemplate}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!modelName}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Create & Start Simulation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {creationMethod === "scratch" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>PML Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={pmlCode}
                  onChange={(e) => setPmlCode(e.target.value)}
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="Enter your PML code here..."
                />
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">PML Tips:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Use cfMicro() for compartmental models</li>
                        <li>• Define fixef{} for population parameters</li>
                        <li>• Add ranef{} for random effects</li>
                        <li>• Specify dosing with Dose/V for initial conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {creationMethod === "template" && selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      {selectedTemplate.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        selectedTemplate.complexity === "Basic"
                          ? "bg-green-100 text-green-800"
                          : selectedTemplate.complexity === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedTemplate.complexity}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Parameters</p>
                      <p className="font-medium">{selectedTemplate.parameters}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Equations</p>
                      <p className="font-medium">{selectedTemplate.equations}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Model</h1>
            <p className="text-gray-600">Choose how you'd like to create your model</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
          onClick={() => handleMethodSelect("scratch")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>From Scratch</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-sm">Start with a blank model and write your own PML code</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-200"
          onClick={() => handleMethodSelect("wizard")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Wand2 className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span>Model Wizard</span>
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-sm">Use guided steps to build your model interactively</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-200"
          onClick={() => handleMethodSelect("template")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Copy className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>From Template</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-sm">Start with a pre-built model template and customize it</p>
          </CardContent>
        </Card>
      </div>

      {creationMethod === "template" && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Choose a Template</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAllModelsFlat().map((model) => (
              <Card
                key={model.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTemplateSelect(model)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{model.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        model.complexity === "Basic"
                          ? "bg-green-100 text-green-800"
                          : model.complexity === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {model.complexity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{model.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{model.parameters} params</span>
                    <span>{model.equations} equations</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
