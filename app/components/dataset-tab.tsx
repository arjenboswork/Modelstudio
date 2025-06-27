"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Upload,
  Download,
  MoreHorizontal,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings,
  Filter,
  Eye,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import FlaggingRulesManager from "./flagging-rules-manager"

interface Dataset {
  id: string
  name: string
  type: "concentration" | "dosing" | "covariate" | "combined"
  status: "ready" | "processing" | "error" | "flagged"
  records: number
  subjects: number
  lastModified: string
  size: string
  flaggedRecords?: number
  issues?: string[]
}

interface DatasetTabProps {
  onUserProfileClick?: () => void
  onHelpClick?: () => void
}

const mockDatasets: Dataset[] = [
  {
    id: "1",
    name: "Phase II PK Concentrations",
    type: "concentration",
    status: "ready",
    records: 2456,
    subjects: 48,
    lastModified: "2024-01-20",
    size: "1.2 MB",
    flaggedRecords: 23,
  },
  {
    id: "2",
    name: "Dosing Records",
    type: "dosing",
    status: "ready",
    records: 384,
    subjects: 48,
    lastModified: "2024-01-18",
    size: "45 KB",
    flaggedRecords: 5,
  },
  {
    id: "3",
    name: "Subject Demographics",
    type: "covariate",
    status: "ready",
    records: 48,
    subjects: 48,
    lastModified: "2024-01-15",
    size: "12 KB",
  },
  {
    id: "4",
    name: "Biomarker Data",
    type: "combined",
    status: "processing",
    records: 1200,
    subjects: 48,
    lastModified: "2024-01-22",
    size: "890 KB",
  },
  {
    id: "5",
    name: "Safety Labs",
    type: "covariate",
    status: "flagged",
    records: 576,
    subjects: 48,
    lastModified: "2024-01-19",
    size: "156 KB",
    flaggedRecords: 45,
    issues: ["Missing values", "Outliers detected"],
  },
]

const mockPreviewData = [
  { ID: "001", TIME: "0", DV: "0", AMT: "100", EVID: "1", CMT: "1", RATE: "0" },
  { ID: "001", TIME: "0.5", DV: "12.5", AMT: "0", EVID: "0", CMT: "2", RATE: "0" },
  { ID: "001", TIME: "1", DV: "18.2", AMT: "0", EVID: "0", CMT: "2", RATE: "0" },
  { ID: "001", TIME: "2", DV: "22.1", AMT: "0", EVID: "0", CMT: "2", RATE: "0" },
  { ID: "001", TIME: "4", DV: "19.8", AMT: "0", EVID: "0", CMT: "2", RATE: "0" },
  { ID: "002", TIME: "0", DV: "0", AMT: "100", EVID: "1", CMT: "1", RATE: "0" },
  { ID: "002", TIME: "0.5", DV: "15.1", AMT: "0", EVID: "0", CMT: "2", RATE: "0" },
  { ID: "002", TIME: "1", DV: "21.3", AMT: "0", EVID: "0", CMT: "2", RATE: "0" },
]

export default function DatasetTab({ onUserProfileClick, onHelpClick }: DatasetTabProps) {
  const [datasets] = useState<Dataset[]>(mockDatasets)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showFlaggingRules, setShowFlaggingRules] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <Database className="h-4 w-4 text-blue-600 animate-pulse" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Database className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "flagged":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "concentration":
        return "bg-purple-100 text-purple-800"
      case "dosing":
        return "bg-blue-100 text-blue-800"
      case "covariate":
        return "bg-green-100 text-green-800"
      case "combined":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dataset.status === statusFilter
    const matchesType = typeFilter === "all" || dataset.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handlePreviewDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset)
    setShowPreview(true)
  }

  if (showFlaggingRules) {
    return (
      <FlaggingRulesManager
        onBack={() => setShowFlaggingRules(false)}
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
          <h2 className="text-xl font-semibold">Datasets</h2>
          <p className="text-gray-600">Manage your analysis datasets and data quality</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowFlaggingRules(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Advanced Rules
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Dataset
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Open from Integral
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Datasets</p>
                <p className="text-2xl font-bold">{datasets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-2xl font-bold">{datasets.filter((d) => d.status === "ready").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Records</p>
                <p className="text-2xl font-bold">{datasets.reduce((sum, d) => sum + (d.flaggedRecords || 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{datasets.reduce((sum, d) => sum + d.records, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search datasets..."
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
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="concentration">Concentration</SelectItem>
              <SelectItem value="dosing">Dosing</SelectItem>
              <SelectItem value="covariate">Covariate</SelectItem>
              <SelectItem value="combined">Combined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Datasets List */}
      <div className="space-y-4">
        {filteredDatasets.map((dataset) => (
          <Card key={dataset.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{dataset.name}</CardTitle>
                      <Badge variant="outline" className={getTypeColor(dataset.type)}>
                        {dataset.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(dataset.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(dataset.status)}
                          <span className="capitalize">{dataset.status}</span>
                        </span>
                      </Badge>
                      {dataset.flaggedRecords && dataset.flaggedRecords > 0 && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {dataset.flaggedRecords} flagged
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>{dataset.records.toLocaleString()} records</span>
                      <span>{dataset.subjects} subjects</span>
                      <span>{dataset.size}</span>
                      <span>Modified {dataset.lastModified}</span>
                    </div>
                    {dataset.issues && dataset.issues.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {dataset.issues.map((issue, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreviewDataset(dataset)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Filter className="h-4 w-4 mr-2" />
                        Apply Filters
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Data Mapping
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Data Preview Modal */}
      {showPreview && selectedDataset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedDataset.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedDataset.records.toLocaleString()} records, {selectedDataset.subjects} subjects
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setShowPreview(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh]">
              <Tabs defaultValue="data">
                <TabsList>
                  <TabsTrigger value="data">Data Preview</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="quality">Quality Check</TabsTrigger>
                </TabsList>
                <TabsContent value="data" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>TIME</TableHead>
                        <TableHead>DV</TableHead>
                        <TableHead>AMT</TableHead>
                        <TableHead>EVID</TableHead>
                        <TableHead>CMT</TableHead>
                        <TableHead>RATE</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPreviewData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.ID}</TableCell>
                          <TableCell>{row.TIME}</TableCell>
                          <TableCell>{row.DV}</TableCell>
                          <TableCell>{row.AMT}</TableCell>
                          <TableCell>{row.EVID}</TableCell>
                          <TableCell>{row.CMT}</TableCell>
                          <TableCell>{row.RATE}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-sm text-gray-600 mt-4">
                    Showing first 8 rows of {selectedDataset.records.toLocaleString()} total records
                  </p>
                </TabsContent>
                <TabsContent value="summary" className="mt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Dataset Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Records:</span>
                          <span>{selectedDataset.records.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subjects:</span>
                          <span>{selectedDataset.subjects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>File Size:</span>
                          <span>{selectedDataset.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{selectedDataset.type}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Data Quality</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className={getStatusColor(selectedDataset.status)}>{selectedDataset.status}</Badge>
                        </div>
                        {selectedDataset.flaggedRecords && (
                          <div className="flex justify-between">
                            <span>Flagged Records:</span>
                            <span className="text-yellow-600">{selectedDataset.flaggedRecords}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Missing Values:</span>
                          <span>0.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Outliers:</span>
                          <span>1.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="quality" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>No duplicate records found</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>All required columns present</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span>5 records with missing concentration values</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span>23 observations outside sampling windows</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by uploading your first dataset"}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload Dataset
          </Button>
        </div>
      )}
    </div>
  )
}
