"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Analysis {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response" | "bioequivalence"
  status: "completed" | "running" | "failed" | "queued" | "draft"
  created: string
  lastModified: string
  author: string
  description?: string
  progress?: number
  models?: number
  datasets?: number
}

interface AnalysesListProps {
  onAnalysisSelect: (analysis: Analysis) => void
  onUserProfileClick?: () => void
  onHelpClick?: () => void
}

const mockAnalyses: Analysis[] = [
  {
    id: "1",
    name: "Phase II PK Analysis",
    type: "population_pk",
    status: "completed",
    created: "2024-01-15",
    lastModified: "2024-01-20",
    author: "Dr. Sarah Johnson",
    description: "Population pharmacokinetic analysis of compound XYZ in Phase II study",
    models: 5,
    datasets: 2,
  },
  {
    id: "2",
    name: "Dose-Response Study",
    type: "exposure_response",
    status: "running",
    created: "2024-01-18",
    lastModified: "2024-01-22",
    author: "Dr. Michael Chen",
    description: "Exposure-response analysis for efficacy endpoints",
    progress: 65,
    models: 3,
    datasets: 1,
  },
  {
    id: "3",
    name: "PK/PD Model Development",
    type: "pkpd",
    status: "completed",
    created: "2024-01-10",
    lastModified: "2024-01-25",
    author: "Dr. Emily Rodriguez",
    description: "Integrated PK/PD model for biomarker response",
    models: 8,
    datasets: 3,
  },
  {
    id: "4",
    name: "Bioequivalence Study BE-2024-001",
    type: "bioequivalence",
    status: "failed",
    created: "2024-01-22",
    lastModified: "2024-01-23",
    author: "Dr. James Wilson",
    description: "Bioequivalence analysis of generic formulation",
    models: 2,
    datasets: 1,
  },
  {
    id: "5",
    name: "Pediatric Population PK",
    type: "population_pk",
    status: "queued",
    created: "2024-01-25",
    lastModified: "2024-01-25",
    author: "Dr. Lisa Thompson",
    description: "Population PK analysis in pediatric patients",
    models: 0,
    datasets: 1,
  },
  {
    id: "6",
    name: "Drug-Drug Interaction Study",
    type: "population_pk",
    status: "draft",
    created: "2024-01-26",
    lastModified: "2024-01-26",
    author: "Dr. Robert Kim",
    description: "DDI assessment with strong CYP3A4 inhibitor",
    models: 0,
    datasets: 0,
  },
]

export default function AnalysesList({ onAnalysisSelect, onUserProfileClick, onHelpClick }: AnalysesListProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>(mockAnalyses)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("lastModified")
  const [showNewAnalysisDialog, setShowNewAnalysisDialog] = useState(false)

  // New analysis form state
  const [newAnalysisName, setNewAnalysisName] = useState("")
  const [newAnalysisDescription, setNewAnalysisDescription] = useState("")
  const [newAnalysisType, setNewAnalysisType] = useState<string>("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "running":
        return <Play className="h-4 w-4 text-blue-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "queued":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "draft":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
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
      case "queued":
        return "bg-yellow-100 text-yellow-800"
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
      case "bioequivalence":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateNewAnalysis = () => {
    if (!newAnalysisName || !newAnalysisDescription || !newAnalysisType) return

    const newAnalysis: Analysis = {
      id: Date.now().toString(),
      name: newAnalysisName,
      type: newAnalysisType as Analysis["type"],
      status: "draft",
      created: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      author: "Current User",
      description: newAnalysisDescription,
      models: 0,
      datasets: 0,
    }

    setAnalyses([newAnalysis, ...analyses])
    setShowNewAnalysisDialog(false)
    setNewAnalysisName("")
    setNewAnalysisDescription("")
    setNewAnalysisType("")

    // Automatically select the new analysis
    onAnalysisSelect(newAnalysis)
  }

  const filteredAnalyses = analyses
    .filter((analysis) => {
      const matchesSearch =
        analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || analysis.status === statusFilter
      const matchesType = typeFilter === "all" || analysis.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "created":
          return new Date(b.created).getTime() - new Date(a.created).getTime()
        case "lastModified":
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        case "author":
          return a.author.localeCompare(b.author)
        default:
          return 0
      }
    })

  const statusCounts = {
    all: analyses.length,
    completed: analyses.filter((a) => a.status === "completed").length,
    running: analyses.filter((a) => a.status === "running").length,
    failed: analyses.filter((a) => a.status === "failed").length,
    queued: analyses.filter((a) => a.status === "queued").length,
    draft: analyses.filter((a) => a.status === "draft").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Analyses</h1>
          <p className="text-gray-600">Manage and view your data analyses</p>
        </div>
        <Dialog open={showNewAnalysisDialog} onOpenChange={setShowNewAnalysisDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Analysis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="analysis-name">Analysis Name</Label>
                <Input
                  id="analysis-name"
                  value={newAnalysisName}
                  onChange={(e) => setNewAnalysisName(e.target.value)}
                  placeholder="Enter analysis name"
                />
              </div>
              <div>
                <Label htmlFor="analysis-description">Description</Label>
                <Textarea
                  id="analysis-description"
                  value={newAnalysisDescription}
                  onChange={(e) => setNewAnalysisDescription(e.target.value)}
                  placeholder="Describe your analysis"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="analysis-type">Analysis Type</Label>
                <Select value={newAnalysisType} onValueChange={setNewAnalysisType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="population_pk">Population PK</SelectItem>
                    <SelectItem value="pkpd">PK/PD</SelectItem>
                    <SelectItem value="exposure_response">Exposure-Response</SelectItem>
                    <SelectItem value="bioequivalence">Bioequivalence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewAnalysisDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNewAnalysis}
                  disabled={!newAnalysisName || !newAnalysisDescription || !newAnalysisType}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Analysis
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search analyses..."
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
              <SelectItem value="queued">Queued</SelectItem>
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
              <SelectItem value="bioequivalence">Bioequivalence</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastModified">Last Modified</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="author">Author</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>All</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.completed}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="running" className="flex items-center space-x-2">
            <Play className="h-3 w-3" />
            <span>Running</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.running}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center space-x-2">
            <XCircle className="h-3 w-3" />
            <span>Failed</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.failed}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="queued" className="flex items-center space-x-2">
            <Pause className="h-3 w-3" />
            <span>Queued</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.queued}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center space-x-2">
            <AlertCircle className="h-3 w-3" />
            <span>Draft</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.draft}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          <div className="grid gap-4">
            {filteredAnalyses.map((analysis) => (
              <Card
                key={analysis.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onAnalysisSelect(analysis)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <CardTitle className="text-lg">{analysis.name}</CardTitle>
                        <Badge variant="outline" className={getTypeColor(analysis.type)}>
                          {analysis.type.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(analysis.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(analysis.status)}
                            <span className="capitalize">{analysis.status}</span>
                          </span>
                        </Badge>
                      </div>
                      {analysis.description && <p className="text-sm text-gray-600">{analysis.description}</p>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Results
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="h-4 w-4 mr-2" />
                          Run Analysis
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Filter className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{analysis.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created {analysis.created}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Modified {analysis.lastModified}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {analysis.models !== undefined && <span>{analysis.models} models</span>}
                      {analysis.datasets !== undefined && <span>{analysis.datasets} datasets</span>}
                    </div>
                  </div>
                  {analysis.status === "running" && analysis.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{analysis.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${analysis.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredAnalyses.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first analysis"}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewAnalysisDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      )}
    </div>
  )
}
