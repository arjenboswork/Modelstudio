"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  Download,
  Settings,
  BarChart3,
  LineChart,
  Zap,
  MessageSquare,
  Send,
  Bot,
  User,
  Minimize2,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface Model {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response"
  ofv?: number
  rse?: number
}

interface ModelSimulationProps {
  model: Model
  onBack: () => void
  fullScreen?: boolean
  onUserProfileClick?: () => void
  onHelpClick?: () => void
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ModelSimulation({
  model,
  onBack,
  fullScreen = false,
  onUserProfileClick,
  onHelpClick,
}: ModelSimulationProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "completed" | "error">("idle")
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI assistant for pharmacometric modeling. I can help you with parameter optimization, model diagnostics, and simulation setup. What would you like to know about your model?",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  // Simulation parameters
  const [simulationParams, setSimulationParams] = useState({
    subjects: 100,
    doses: [10, 25, 50, 100],
    timePoints: 24,
    replicates: 1,
    seed: 12345,
    outputInterval: 1,
  })

  // Model parameters
  const [modelParams, setModelParams] = useState({
    CL: { value: 1.0, min: 0.1, max: 10.0, unit: "L/h" },
    V: { value: 10.0, min: 1.0, max: 100.0, unit: "L" },
    Ka: { value: 0.5, min: 0.01, max: 5.0, unit: "1/h" },
    F: { value: 1.0, min: 0.1, max: 1.0, unit: "" },
  })

  const handleRunSimulation = async () => {
    setIsRunning(true)
    setSimulationStatus("running")
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          setSimulationStatus("completed")
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  const handleStopSimulation = () => {
    setIsRunning(false)
    setSimulationStatus("idle")
    setProgress(0)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your model parameters, I recommend starting with a clearance value between 0.5-2.0 L/h for typical adult populations.",
        "The current volume of distribution seems appropriate for this compound. You might want to consider allometric scaling if you have pediatric subjects.",
        "For better model convergence, try using FOCE-I estimation method with your current parameter values.",
        "Your absorption rate constant looks reasonable. Consider adding a lag time if you observe delayed absorption in your data.",
        "The bioavailability parameter is set to 1.0. Make sure this aligns with your study design and formulation.",
      ]

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, aiMessage])
    }, 1000)

    setNewMessage("")
  }

  const getStatusIcon = () => {
    switch (simulationStatus) {
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (simulationStatus) {
      case "running":
        return "Running simulation..."
      case "completed":
        return "Simulation completed"
      case "error":
        return "Simulation failed"
      default:
        return "Ready to simulate"
    }
  }

  const content = (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Models
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{model.name}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {model.type.replace("_", " ")}
              </Badge>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={showAIAssistant ? "bg-blue-50 border-blue-200" : ""}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className={`flex-1 flex ${showAIAssistant ? "mr-80" : ""}`}>
          <div className="flex-1 p-6 space-y-6">
            {/* Simulation Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span>Simulation Controls</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {isRunning ? (
                      <>
                        <Button variant="outline" onClick={handleStopSimulation}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                        <Button variant="outline" disabled>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleRunSimulation} className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-2" />
                        Run Simulation
                      </Button>
                    )}
                  </div>
                </div>
                {isRunning && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="subjects">Number of Subjects</Label>
                    <Input
                      id="subjects"
                      type="number"
                      value={simulationParams.subjects}
                      onChange={(e) =>
                        setSimulationParams({ ...simulationParams, subjects: Number.parseInt(e.target.value) || 0 })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timePoints">Time Points (hours)</Label>
                    <Input
                      id="timePoints"
                      type="number"
                      value={simulationParams.timePoints}
                      onChange={(e) =>
                        setSimulationParams({ ...simulationParams, timePoints: Number.parseInt(e.target.value) || 0 })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="replicates">Replicates</Label>
                    <Input
                      id="replicates"
                      type="number"
                      value={simulationParams.replicates}
                      onChange={(e) =>
                        setSimulationParams({ ...simulationParams, replicates: Number.parseInt(e.target.value) || 0 })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seed">Random Seed</Label>
                    <Input
                      id="seed"
                      type="number"
                      value={simulationParams.seed}
                      onChange={(e) =>
                        setSimulationParams({ ...simulationParams, seed: Number.parseInt(e.target.value) || 0 })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Model Parameters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(modelParams).map(([param, config]) => (
                    <div key={param} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">
                          {param} {config.unit && `(${config.unit})`}
                        </Label>
                        <span className="text-sm text-gray-600">{config.value.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[config.value]}
                        onValueChange={([value]) =>
                          setModelParams({
                            ...modelParams,
                            [param]: { ...config, value },
                          })
                        }
                        min={config.min}
                        max={config.max}
                        step={0.01}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{config.min}</span>
                        <span>{config.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Simulation Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {simulationStatus === "completed" ? (
                  <div className="space-y-4">
                    <Tabs defaultValue="plots" className="w-full">
                      <TabsList>
                        <TabsTrigger value="plots">Plots</TabsTrigger>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                      </TabsList>
                      <TabsContent value="plots" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">Concentration vs Time Plot</p>
                            </div>
                          </div>
                          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">Parameter Distribution</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="summary">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-blue-900">100</div>
                              <div className="text-sm text-blue-700">Subjects Simulated</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-green-900">2,400</div>
                              <div className="text-sm text-green-700">Data Points</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-purple-900">24h</div>
                              <div className="text-sm text-purple-700">Simulation Time</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-orange-900">4</div>
                              <div className="text-sm text-orange-700">Dose Levels</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="data">
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Simulation data table would appear here</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Run simulation to see results</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        {showAIAssistant && (
          <div className="w-80 border-l bg-white flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>AI Assistant</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAIAssistant(false)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "assistant" && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                      {message.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about your model..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (fullScreen) {
    return <div className="flex h-screen bg-gray-50">{content}</div>
  }

  return content
}
