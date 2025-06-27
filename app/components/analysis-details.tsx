"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Play, Download, Share2, MoreHorizontal } from "lucide-react"
import ModelsTab from "./models-tab"
import DatasetTab from "./dataset-tab"
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

interface AnalysisDetailsProps {
  analysis: Analysis
  onBack: () => void
  onUserProfileClick?: () => void
  onHelpClick?: () => void
}

export default function AnalysisDetails({ analysis, onBack, onUserProfileClick, onHelpClick }: AnalysisDetailsProps) {
  const [activeTab, setActiveTab] = useState("models")

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analyses
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{analysis.name}</h1>
              <Badge variant="outline" className={getTypeColor(analysis.type)}>
                {analysis.type.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getStatusColor(analysis.status)}>
                {analysis.status.toUpperCase()}
              </Badge>
            </div>
            {analysis.description && <p className="text-gray-600">{analysis.description}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Play className="h-4 w-4 mr-2" />
                Run Analysis
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Analysis Info */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Author</p>
              <p className="font-medium">{analysis.author}</p>
            </div>
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium">{analysis.created}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Modified</p>
              <p className="font-medium">{analysis.lastModified}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium capitalize">{analysis.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-6">
          <ModelsTab onUserProfileClick={onUserProfileClick} onHelpClick={onHelpClick} />
        </TabsContent>

        <TabsContent value="datasets" className="mt-6">
          <DatasetTab onUserProfileClick={onUserProfileClick} onHelpClick={onHelpClick} />
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">Results will appear here once the analysis is complete.</p>
                {analysis.status === "draft" && (
                  <Button className="mt-4">
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">No reports generated yet.</p>
                <p className="text-sm text-gray-500 mt-2">Reports will be available after the analysis is completed.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
