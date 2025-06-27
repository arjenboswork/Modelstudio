"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Copy,
  Trash2,
  BarChart3,
  Code,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ModelCreation from "./model-creation"
import ModelLibrary from "./model-library"
import ModelWizard from "./model-wizard"
import ModelComparison from "./model-comparison"
import ModelSimulation from "./model-simulation"

interface Model {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response"
  status: "completed" | "running" | "failed" | "draft"
  ofv?: number
  rse?: number
  created: string
  lastRun?: string
  children?: Model[]
  isExpanded?: boolean
}

interface ModelsTabProps {
  onUserProfileClick?: () => void
  onHelpClick?: () => void
}

const mockModels: Model[] = [
  {
    id: "1",
    name: "One-compartment PK",
    type: "population_pk",
    status: "completed",
    ofv: 1234.5,
    rse: 8.2,
    created: "2024-01-15",
    lastRun: "2024-01-20",
    children: [
      {
        id: "1a",
        name: "Base model",
        type: "population_pk",
        status: "completed",
        ofv: 1245.8,
        rse: 9.1,
        created: "2024-01-15",
        lastRun: "2024-01-18",
      },
      {
        id: "1b",
        name: "With covariates",
        type: "population_pk",
        status: "completed",
        ofv: 1234.5,
        rse: 8.2,
        created: "2024-01-16",
        lastRun: "2024-01-20",
      },
    ],
    isExpanded: false,
  },
  {
    id: "2",
    name: "Two-compartment PK",
    type: "population_pk",
    status: "running",
    created: "2024-01-18",
    children: [
      {
        id: "2a",
        name: "Linear elimination",
        type: "population_pk",
        status: "completed",
        ofv: 1189.2,
        rse: 7.8,
        created: "2024-01-18",
        lastRun: "2024-01-19",
      },
      {
        id: "2b",
        name: "Michaelis-Menten",
        type: "population_pk",
        status: "running",
        created: "2024-01-19",
      },
    ],
    isExpanded: false,
  },
  {
    id: "3",
    name: "Direct Effect PD",
    type: "pkpd",
    status: "completed",
    ofv: 987.3,
    rse: 12.5,
    created: "2024-01-20",
    lastRun: "2024-01-22",
  },
  {
    id: "4",
    name: "Indirect Response",
    type: "pkpd",
    status: "failed",
    created: "2024-01-22",
  },
  {
    id: "5",
    name: "Exposure-Response",
    type: "exposure_response",
    status: "draft",
    created: "2024-01-25",
  },
]

export default function ModelsTab({ onUserProfileClick, onHelpClick }: ModelsTabProps) {
  const [models, setModels] = useState<Model[]>(mockModels)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<
    "list" | "creation" | "library" | "wizard" | "comparison" | "simulation"
  >("list")
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const toggleModelExpansion = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, isExpanded: !model.isExpanded } : model)),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "draft":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "population_pk":
        return "bg-purple-100 text-purple-800"
      case "pkpd":
        return "bg-indigo-100 text-indigo-800"
      case "exposure_response":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || model.status === statusFilter
    const matchesType = typeFilter === "all" || model.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleModelSelect = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const handleCompareModels = () => {
    const modelsToCompare = models.filter((model) => selectedModels.includes(model.id))
    setCurrentView("comparison")
  }

  const handleSimulateModel = (model: Model) => {
    setSelectedModel(model)
    setCurrentView("simulation")
  }

  if (currentView === "creation") {
    return (
      <ModelCreation
        onBack={() => setCurrentView("list")}
        onUserProfileClick={onUserProfileClick}
        onHelpClick={onHelpClick}
      />
    )
  }

  if (currentView === "library") {
    return (
      <ModelLibrary
        onBack={() => setCurrentView("list")}
        onUserProfileClick={onUserProfileClick}
        onHelpClick={onHelpClick}
      />
    )
  }

  if (currentView === "wizard") {
    return (
      <ModelWizard
        onBack={() => setCurrentView("list")}
        onUserProfileClick={onUserProfileClick}
        onHelpClick={onHelpClick}
      />
    )
  }

  if (currentView === "comparison") {
    const modelsToCompare = models.filter((model) => selectedModels.includes(model.id))
    return (
      <ModelComparison
        models={modelsToCompare}
        onBack={() => setCurrentView("list")}
        onUserProfileClick={onUserProfileClick}
        onHelpClick={onHelpClick}
      />
    )
  }

  if (currentView === "simulation" && selectedModel) {
    return (
      <ModelSimulation
        model={selectedModel}
        onBack={() => setCurrentView("list")}
        fullScreen={true}
        onUserProfileClick={onUserProfileClick}
        onHelpClick={onHelpClick}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Models</h2>
          <p className="text-gray-600">Manage and develop your pharmacometric models</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedModels.length > 1 && (
            <Button variant="outline" onClick={handleCompareModels}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare ({selectedModels.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Model
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentView("creation")}>
                <Code className="h-4 w-4 mr-2" />
                Create from Scratch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView("library")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                From Library
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView("wizard")}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Model Wizard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="population_pk">Population PK</SelectItem>
              <SelectItem value="pkpd">PK/PD</SelectItem>
              <SelectItem value="exposure_response">Exposure-Response</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Models List */}
      <div className="space-y-4">
        {filteredModels.map((model) => (
          <Card key={model.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.id)}
                    onChange={() => handleModelSelect(model.id)}
                    className="rounded border-gray-300"
                  />
                  {model.children && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleModelExpansion(model.id)}
                      className="p-0 h-auto"
                    >
                      {model.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  )}
                  <div>
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <Badge variant="outline" className={getTypeColor(model.type)}>
                        {model.type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(model.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(model.status)}
                          <span className="capitalize">{model.status}</span>
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>Created {model.created}</span>
                      {model.lastRun && <span>Last run {model.lastRun}</span>}
                      {model.ofv && <span>OFV: {model.ofv}</span>}
                      {model.rse && <span>RSE: {model.rse}%</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSimulateModel(model)}
                    disabled={model.status !== "completed"}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Simulate
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="h-4 w-4 mr-2" />
                        Run Model
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Code className="h-4 w-4 mr-2" />
                        View Code
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Child Models */}
            {model.children && model.isExpanded && (
              <CardContent className="pt-0">
                <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                  {model.children.map((childModel) => (
                    <div key={childModel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(childModel.id)}
                          onChange={() => handleModelSelect(childModel.id)}
                          className="rounded border-gray-300"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{childModel.name}</span>
                            <Badge variant="outline" className={getStatusColor(childModel.status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(childModel.status)}
                                <span className="capitalize">{childModel.status}</span>
                              </span>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span>Created {childModel.created}</span>
                            {childModel.lastRun && <span>Last run {childModel.lastRun}</span>}
                            {childModel.ofv && <span>OFV: {childModel.ofv}</span>}
                            {childModel.rse && <span>RSE: {childModel.rse}%</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSimulateModel(childModel)}
                          disabled={childModel.status !== "completed"}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Simulate
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Run Model
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Code className="h-4 w-4 mr-2" />
                              View Code
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first model"}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentView("creation")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Model
          </Button>
        </div>
      )}
    </div>
  )
}
