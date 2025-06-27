"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, BookOpen, Video, MessageCircle, Download, ExternalLink, Star, Clock } from "lucide-react"

interface HelpCenterProps {
  onBack: () => void
}

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of Phoenix and pharmacometric modeling",
    articles: 12,
    icon: BookOpen,
  },
  {
    id: "modeling",
    title: "Model Development",
    description: "Advanced techniques for building and validating models",
    articles: 28,
    icon: BookOpen,
  },
  {
    id: "data-management",
    title: "Data Management",
    description: "Import, clean, and prepare your datasets",
    articles: 15,
    icon: BookOpen,
  },
  {
    id: "simulation",
    title: "Simulation & Prediction",
    description: "Run simulations and generate predictions",
    articles: 18,
    icon: BookOpen,
  },
]

const featuredArticles = [
  {
    id: "1",
    title: "Building Your First Population PK Model",
    description: "Step-by-step guide to creating a basic population pharmacokinetic model",
    category: "Getting Started",
    readTime: "15 min",
    rating: 4.8,
    views: 2340,
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Data Import and Formatting Best Practices",
    description: "Learn how to properly format and import your clinical data",
    category: "Data Management",
    readTime: "10 min",
    rating: 4.6,
    views: 1890,
    lastUpdated: "1 week ago",
  },
  {
    id: "3",
    title: "Model Validation and Diagnostics",
    description: "Comprehensive guide to validating your pharmacometric models",
    category: "Model Development",
    readTime: "25 min",
    rating: 4.9,
    views: 3120,
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    title: "Advanced Covariate Modeling Techniques",
    description: "Explore sophisticated approaches to covariate model building",
    category: "Model Development",
    readTime: "30 min",
    rating: 4.7,
    views: 1560,
    lastUpdated: "5 days ago",
  },
]

const videoTutorials = [
  {
    id: "1",
    title: "Phoenix Interface Overview",
    duration: "12:34",
    views: 5420,
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "2",
    title: "Creating Your First Model",
    duration: "18:45",
    views: 4230,
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "3",
    title: "Data Import Walkthrough",
    duration: "8:22",
    views: 3180,
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
]

export default function HelpCenter({ onBack }: HelpCenterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredArticles = featuredArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Help Center</h1>
              <p className="text-sm text-gray-600">Find answers, tutorials, and documentation</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-blue-600 px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">How can we help you?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for articles, tutorials, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg bg-white"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6">
              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {helpCategories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{category.title}</h3>
                            <p className="text-sm text-gray-600">{category.articles} articles</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Filter by category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Getting Started">Getting Started</option>
                  <option value="Model Development">Model Development</option>
                  <option value="Data Management">Data Management</option>
                  <option value="Simulation & Prediction">Simulation & Prediction</option>
                </select>
              </div>

              {/* Articles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {searchTerm ? `Search Results (${filteredArticles.length})` : "Featured Articles"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{article.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <span>{article.views} views</span>
                          </div>
                          <span>Updated {article.lastUpdated}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Video Tutorials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoTutorials.map((video) => (
                    <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <Video className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{video.title}</h4>
                        <p className="text-sm text-gray-600">{video.views} views</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="downloads" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Downloads & Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Download className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Phoenix User Manual</h4>
                          <p className="text-sm text-gray-600">Complete documentation (PDF)</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Download className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-medium">Example Datasets</h4>
                          <p className="text-sm text-gray-600">Sample data for practice</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download ZIP
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Download className="h-8 w-8 text-purple-600" />
                        <div>
                          <h4 className="font-medium">Model Templates</h4>
                          <p className="text-sm text-gray-600">Pre-built model templates</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Templates
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <ExternalLink className="h-8 w-8 text-orange-600" />
                        <div>
                          <h4 className="font-medium">API Documentation</h4>
                          <p className="text-sm text-gray-600">Developer resources</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Online
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    {
                      question: "How do I import my clinical data into Phoenix?",
                      answer:
                        "You can import data using the Data Import wizard. Supported formats include CSV, Excel, and SAS datasets. Make sure your data follows the standard CDISC format for best results.",
                    },
                    {
                      question: "What's the difference between population PK and PK/PD models?",
                      answer:
                        "Population PK models describe drug concentration over time in a population, while PK/PD models additionally link these concentrations to pharmacological effects or clinical outcomes.",
                    },
                    {
                      question: "How do I validate my pharmacometric model?",
                      answer:
                        "Model validation involves multiple steps including goodness-of-fit plots, visual predictive checks (VPC), bootstrap analysis, and external validation when possible.",
                    },
                    {
                      question: "Can I export my models to other software?",
                      answer:
                        "Yes, Phoenix supports exporting models to various formats including NONMEM, Monolix, and R. You can also export results as standard formats like CSV or Excel.",
                    },
                    {
                      question: "How do I handle missing data in my analysis?",
                      answer:
                        "Phoenix provides several options for handling missing data including listwise deletion, imputation methods, and mixed-effects modeling approaches that naturally handle unbalanced data.",
                    },
                  ].map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-2">{faq.question}</h4>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
