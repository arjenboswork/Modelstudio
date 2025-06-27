"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Download, Star, Eye, Copy } from "lucide-react"

interface LibraryModel {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response"
  category: "standard" | "disease_specific" | "pediatric" | "oncology"
  description: string
  author: string
  downloads: number
  rating: number
  tags: string[]
  complexity: "Basic" | "Intermediate" | "Advanced"
}

interface ModelLibraryProps {
  onBack: () => void
  onModelImport: (model: LibraryModel) => void
}

const libraryModels: LibraryModel[] = [
  {
    id: "lib_1",
    name: "Standard One-Compartment PK",
    type: "population_pk",
    category: "standard",
    description: "Well-validated one-compartment pharmacokinetic model with first-order elimination",
    author: "Phoenix Team",
    downloads: 1250,
    rating: 4.8,
    tags: ["validated", "standard", "first-order"],
    complexity: "Basic",
  },
  {
    id: "lib_2",
    name: "Warfarin PK/PD Model",
    type: "pkpd",
    category: "standard",
    description: "Integrated PK/PD model for warfarin with INR response",
    author: "Clinical Pharmacology Group",
    downloads: 890,
    rating: 4.6,
    tags: ["warfarin", "INR", "anticoagulation"],
    complexity: "Advanced",
  },
  {
    id: "lib_3",
    name: "Pediatric Maturation Model",
    type: "population_pk",
    category: "pediatric",
    description: "Age-based maturation model for pediatric populations",
    author: "Pediatric Modeling Consortium",
    downloads: 650,
    rating: 4.7,
    tags: ["pediatric", "maturation", "allometry"],
    complexity: "Intermediate",
  },
  {
    id: "lib_4",
    name: "Tumor Growth Inhibition",
    type: "pkpd",
    category: "oncology",
    description: "Tumor growth inhibition model for oncology applications",
    author: "Oncology Modeling Group",
    downloads: 420,
    rating: 4.5,
    tags: ["oncology", "tumor", "growth"],
    complexity: "Advanced",
  },
  {
    id: "lib_5",
    name: "Linear Exposure-Response",
    type: "exposure_response",
    category: "standard",
    description: "Simple linear relationship between drug exposure and efficacy response",
    author: "Phoenix Team",
    downloads: 980,
    rating: 4.4,
    tags: ["linear", "efficacy", "simple"],
    complexity: "Basic",
  },
  {
    id: "lib_6",
    name: "Renal Impairment Model",
    type: "population_pk",
    category: "disease_specific",
    description: "Population PK model accounting for renal function",
    author: "Nephrology Modeling Group",
    downloads: 340,
    rating: 4.3,
    tags: ["renal", "creatinine", "impairment"],
    complexity: "Intermediate",
  },
]

export default function ModelLibrary({ onBack, onModelImport }: ModelLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all")

  const filteredModels = libraryModels.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory
    const matchesComplexity = selectedComplexity === "all" || model.complexity === selectedComplexity

    return matchesSearch && matchesCategory && matchesComplexity
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "standard":
        return "bg-blue-100 text-blue-800"
      case "disease_specific":
        return "bg-red-100 text-red-800"
      case "pediatric":
        return "bg-green-100 text-green-800"
      case "oncology":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Basic":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Models
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Model Library</h1>
            <p className="text-sm text-gray-600">Browse and import validated pharmacometric models</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search models, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            <option value="standard">Standard</option>
            <option value="disease_specific">Disease Specific</option>
            <option value="pediatric">Pediatric</option>
            <option value="oncology">Oncology</option>
          </select>
          <select
            value={selectedComplexity}
            onChange={(e) => setSelectedComplexity(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Complexity</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Models Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{model.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={getCategoryColor(model.category)}>
                        {model.category.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className={getComplexityColor(model.complexity)}>
                        {model.complexity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{model.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{model.description}</p>

                <div className="flex flex-wrap gap-1">
                  {model.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>by {model.author}</span>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{model.downloads}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => onModelImport(model)}>
                    <Copy className="h-4 w-4 mr-1" />
                    Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
