"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Settings, AlertTriangle, CheckCircle, Info, X } from "lucide-react"

interface FlaggingRule {
  id: string
  name: string
  description: string
  enabled: boolean
  category: "quality" | "outlier" | "protocol" | "safety"
  severity: "low" | "medium" | "high"
  affectedRecords?: number
  settings?: Record<string, any>
}

interface FlaggingRulesManagerProps {
  onBack: () => void
  onUserProfileClick?: () => void
  onHelpClick?: () => void
}

const defaultRules: FlaggingRule[] = [
  {
    id: "sample_window",
    name: "Flag outside sample windows",
    description: "Flag observations that fall outside predefined sampling windows",
    enabled: true,
    category: "protocol",
    severity: "medium",
    affectedRecords: 23,
    settings: {
      windowType: "relative",
      tolerance: 15,
      unit: "minutes",
      applyToAll: true,
    },
  },
  {
    id: "negative_concentrations",
    name: "Flag negative concentrations",
    description: "Identify and flag any negative concentration values",
    enabled: true,
    category: "quality",
    severity: "high",
    affectedRecords: 5,
  },
  {
    id: "missing_doses",
    name: "Flag missing dose records",
    description: "Flag subjects with missing or incomplete dosing information",
    enabled: true,
    category: "protocol",
    severity: "high",
    affectedRecords: 12,
  },
  {
    id: "outlier_concentrations",
    name: "Flag concentration outliers",
    description: "Statistical outlier detection for concentration values",
    enabled: false,
    category: "outlier",
    severity: "medium",
    affectedRecords: 0,
  },
  {
    id: "duplicate_records",
    name: "Flag duplicate records",
    description: "Identify potential duplicate observations or dose records",
    enabled: true,
    category: "quality",
    severity: "medium",
    affectedRecords: 8,
  },
  {
    id: "protocol_deviations",
    name: "Flag protocol deviations",
    description: "Flag observations that deviate from study protocol",
    enabled: false,
    category: "protocol",
    severity: "low",
    affectedRecords: 0,
  },
  {
    id: "bioanalytical_issues",
    name: "Flag bioanalytical issues",
    description: "Flag samples with potential bioanalytical problems",
    enabled: true,
    category: "quality",
    severity: "medium",
    affectedRecords: 15,
  },
  {
    id: "adverse_events",
    name: "Flag adverse event periods",
    description: "Flag observations during reported adverse events",
    enabled: false,
    category: "safety",
    severity: "low",
    affectedRecords: 0,
  },
  {
    id: "concomitant_meds",
    name: "Flag concomitant medication periods",
    description: "Flag observations during concomitant medication use",
    enabled: true,
    category: "protocol",
    severity: "low",
    affectedRecords: 34,
  },
  {
    id: "extreme_values",
    name: "Flag extreme values",
    description: "Flag observations with extremely high or low values",
    enabled: true,
    category: "outlier",
    severity: "medium",
    affectedRecords: 7,
  },
]

export default function FlaggingRulesManager({ onBack, onUserProfileClick, onHelpClick }: FlaggingRulesManagerProps) {
  const [rules, setRules] = useState<FlaggingRule[]>(defaultRules)
  const [selectedRule, setSelectedRule] = useState<FlaggingRule | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              enabled: !rule.enabled,
              affectedRecords: !rule.enabled ? rule.affectedRecords || 0 : 0,
            }
          : rule,
      ),
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "quality":
        return <CheckCircle className="h-4 w-4" />
      case "outlier":
        return <AlertTriangle className="h-4 w-4" />
      case "protocol":
        return <Info className="h-4 w-4" />
      case "safety":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "quality":
        return "bg-blue-100 text-blue-800"
      case "outlier":
        return "bg-orange-100 text-orange-800"
      case "protocol":
        return "bg-purple-100 text-purple-800"
      case "safety":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const enabledRules = rules.filter((rule) => rule.enabled)
  const totalAffectedRecords = enabledRules.reduce((sum, rule) => sum + (rule.affectedRecords || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dataset
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Advanced Flagging Rules</h1>
              <p className="text-sm text-gray-600">Configure data quality and exclusion rules</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Import Rules
            </Button>
            <Button variant="outline" size="sm">
              Export Rules
            </Button>
            <Button size="sm">Apply Rules</Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rules</p>
                  <p className="text-2xl font-bold">{enabledRules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Flagged Records</p>
                  <p className="text-2xl font-bold">{totalAffectedRecords}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rules</p>
                  <p className="text-2xl font-bold">{rules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Configured</p>
                  <p className="text-2xl font-bold">
                    {rules.filter((rule) => rule.settings && Object.keys(rule.settings).length > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules List */}
        <Card>
          <CardHeader>
            <CardTitle>Flagging Rules Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant="outline" className={getCategoryColor(rule.category)}>
                          <span className="flex items-center space-x-1">
                            {getCategoryIcon(rule.category)}
                            <span className="capitalize">{rule.category}</span>
                          </span>
                        </Badge>
                        <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                          {rule.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                      {rule.enabled && rule.affectedRecords && rule.affectedRecords > 0 && (
                        <p className="text-xs text-orange-600 mt-1">{rule.affectedRecords} records would be flagged</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {rule.settings && (
                      <Dialog
                        open={showSettings && selectedRule?.id === rule.id}
                        onOpenChange={(open) => {
                          setShowSettings(open)
                          if (open) setSelectedRule(rule)
                          else setSelectedRule(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              <span>Configure: {rule.name}</span>
                              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </DialogTitle>
                          </DialogHeader>
                          {selectedRule?.id === "sample_window" && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="windowType">Window Type</Label>
                                  <Select defaultValue="relative">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="relative">Relative to dose</SelectItem>
                                      <SelectItem value="absolute">Absolute time</SelectItem>
                                      <SelectItem value="protocol">Protocol defined</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="tolerance">Tolerance</Label>
                                  <div className="flex space-x-2">
                                    <Input defaultValue="15" className="flex-1" />
                                    <Select defaultValue="minutes">
                                      <SelectTrigger className="w-24">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="minutes">min</SelectItem>
                                        <SelectItem value="hours">hrs</SelectItem>
                                        <SelectItem value="percent">%</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="conditions">Additional Conditions</Label>
                                <Textarea
                                  placeholder="Enter any additional conditions or exclusions..."
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch defaultChecked />
                                <Label>Apply to all study periods</Label>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setShowSettings(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => setShowSettings(false)}>Save Settings</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        {enabledRules.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Active flagging rules:</span>
                  <span className="text-sm">{enabledRules.length} rules enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total records to be flagged:</span>
                  <span className="text-sm font-semibold text-orange-600">{totalAffectedRecords} records</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">High priority flags:</span>
                  <span className="text-sm">
                    {enabledRules.filter((rule) => rule.severity === "high").length} rules
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-600">
                    Rules will be applied in the order shown above. Flagged records will be marked for review but not
                    automatically excluded from analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
