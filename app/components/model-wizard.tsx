"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, CheckCircle, Lightbulb } from "lucide-react"

interface Model {
  id: string
  name: string
  type: "population_pk" | "pkpd" | "exposure_response"
  ofv?: number
  rse?: number
}

interface ModelWizardProps {
  onBack: () => void
  onModelCreated: (model: Model) => void
}

interface WizardStep {
  id: string
  title: string
  description: string
}

const wizardSteps: WizardStep[] = [
  {
    id: "type",
    title: "Model Type",
    description: "What type of model are you building?",
  },
  {
    id: "administration",
    title: "Administration",
    description: "How is the drug administered?",
  },
  {
    id: "compartments",
    title: "Compartments",
    description: "How many compartments does your model need?",
  },
  {
    id: "covariates",
    title: "Covariates",
    description: "Which covariates should be included?",
  },
  {
    id: "summary",
    title: "Summary",
    description: "Review your model configuration",
  },
]

export default function ModelWizard({ onBack, onModelCreated }: ModelWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [modelConfig, setModelConfig] = useState({
    name: "",
    type: "" as "population_pk" | "pkpd" | "exposure_response" | "",
    administration: "",
    compartments: "",
    covariates: [] as string[],
    elimination: "",
    absorption: "",
  })

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCovariateChange = (covariate: string, checked: boolean) => {
    if (checked) {
      setModelConfig({
        ...modelConfig,
        covariates: [...modelConfig.covariates, covariate],
      })
    } else {
      setModelConfig({
        ...modelConfig,
        covariates: modelConfig.covariates.filter((c) => c !== covariate),
      })
    }
  }

  const handleCreateModel = () => {
    const newModel: Model = {
      id: Date.now().toString(),
      name: modelConfig.name || "Wizard Generated Model",
      type: modelConfig.type || "population_pk",
      ofv: Math.random() * 1000 + 1000,
      rse: Math.random() * 20 + 5,
    }
    onModelCreated(newModel)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return modelConfig.type !== ""
      case 1:
        return modelConfig.administration !== ""
      case 2:
        return modelConfig.compartments !== ""
      case 3:
        return true // Covariates are optional
      case 4:
        return modelConfig.name.trim() !== ""
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <RadioGroup
              value={modelConfig.type}
              onValueChange={(value) =>
                setModelConfig({ ...modelConfig, type: value as "population_pk" | "pkpd" | "exposure_response" })
              }
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="population_pk" id="population_pk" />
                  <div className="flex-1">
                    <Label htmlFor="population_pk" className="font-medium">
                      Population Pharmacokinetics (PopPK)
                    </Label>
                    <p className="text-sm text-gray-600">Model drug concentration over time in a population</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="pkpd" id="pkpd" />
                  <div className="flex-1">
                    <Label htmlFor="pkpd" className="font-medium">
                      Pharmacokinetic/Pharmacodynamic (PK/PD)
                    </Label>
                    <p className="text-sm text-gray-600">Link drug concentration to pharmacological effect</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="exposure_response" id="exposure_response" />
                  <div className="flex-1">
                    <Label htmlFor="exposure_response" className="font-medium">
                      Exposure-Response
                    </Label>
                    <p className="text-sm text-gray-600">Relate drug exposure to clinical outcomes</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <RadioGroup
              value={modelConfig.administration}
              onValueChange={(value) => setModelConfig({ ...modelConfig, administration: value })}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="iv" id="iv" />
                  <div className="flex-1">
                    <Label htmlFor="iv" className="font-medium">
                      Intravenous (IV)
                    </Label>
                    <p className="text-sm text-gray-600">Direct administration into bloodstream</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="oral" id="oral" />
                  <div className="flex-1">
                    <Label htmlFor="oral" className="font-medium">
                      Oral
                    </Label>
                    <p className="text-sm text-gray-600">Absorption from gastrointestinal tract</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="other" id="other" />
                  <div className="flex-1">
                    <Label htmlFor="other" className="font-medium">
                      Other Routes
                    </Label>
                    <p className="text-sm text-gray-600">Subcutaneous, intramuscular, etc.</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <RadioGroup
              value={modelConfig.compartments}
              onValueChange={(value) => setModelConfig({ ...modelConfig, compartments: value })}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="one" id="one" />
                  <div className="flex-1">
                    <Label htmlFor="one" className="font-medium">
                      One Compartment
                    </Label>
                    <p className="text-sm text-gray-600">Simple model assuming uniform drug distribution</p>
                    <Badge variant="secondary" className="mt-1">
                      Recommended for beginners
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="two" id="two" />
                  <div className="flex-1">
                    <Label htmlFor="two" className="font-medium">
                      Two Compartment
                    </Label>
                    <p className="text-sm text-gray-600">Central and peripheral compartments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="three_plus" id="three_plus" />
                  <div className="flex-1">
                    <Label htmlFor="three_plus" className="font-medium">
                      Three or More Compartments
                    </Label>
                    <p className="text-sm text-gray-600">Complex distribution patterns</p>
                    <Badge variant="outline" className="mt-1">
                      Advanced
                    </Badge>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "weight", label: "Body Weight", description: "Allometric scaling" },
                { id: "age", label: "Age", description: "Maturation effects" },
                { id: "sex", label: "Sex", description: "Gender differences" },
                { id: "race", label: "Race/Ethnicity", description: "Population differences" },
                { id: "creatinine", label: "Creatinine Clearance", description: "Renal function" },
                { id: "albumin", label: "Albumin", description: "Protein binding" },
                { id: "bilirubin", label: "Bilirubin", description: "Hepatic function" },
                { id: "comedication", label: "Co-medication", description: "Drug interactions" },
              ].map((covariate) => (
                <div key={covariate.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={covariate.id}
                    checked={modelConfig.covariates.includes(covariate.id)}
                    onCheckedChange={(checked) => handleCovariateChange(covariate.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={covariate.id} className="font-medium">
                      {covariate.label}
                    </Label>
                    <p className="text-sm text-gray-600">{covariate.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Tip</p>
                  <p className="text-sm text-blue-800">
                    Start with essential covariates like weight and age. You can always add more later during model
                    development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                value={modelConfig.name}
                onChange={(e) => setModelConfig({ ...modelConfig, name: e.target.value })}
                placeholder="Enter a name for your model..."
                className="mt-1"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Model Configuration Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Model Type:</span>
                  <Badge variant="outline">{modelConfig.type?.replace("_", " ").toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Administration:</span>
                  <span className="capitalize">{modelConfig.administration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Compartments:</span>
                  <span className="capitalize">{modelConfig.compartments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Covariates:</span>
                  <span>{modelConfig.covariates.length || "None"}</span>
                </div>
                {modelConfig.covariates.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {modelConfig.covariates.map((covariate) => (
                      <Badge key={covariate} variant="secondary" className="text-xs">
                        {covariate}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
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
            <h1 className="text-xl font-semibold">Model Building Wizard</h1>
            <p className="text-sm text-gray-600">Step-by-step model creation</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          {wizardSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
              </div>
              {index < wizardSteps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">{wizardSteps[currentStep].title}</h2>
            <p className="text-gray-600">{wizardSteps[currentStep].description}</p>
          </div>

          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Step {currentStep + 1} of {wizardSteps.length}
        </span>
        {currentStep === wizardSteps.length - 1 ? (
          <Button onClick={handleCreateModel} disabled={!canProceed()} className="bg-green-600 hover:bg-green-700">
            Create Model
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
