"use client"

import { useState } from "react"
import Sidebar from "./components/sidebar"
import AnalysesList from "./components/analyses-list"
import AnalysisDetails from "./components/analysis-details"
import UserProfile from "./components/user-profile"
import HelpCenter from "./components/help-center"

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

export default function Home() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [currentView, setCurrentView] = useState<"analyses" | "profile" | "help">("analyses")

  const handleAnalysisSelect = (analysis: Analysis) => {
    setSelectedAnalysis(analysis)
  }

  const handleBackToAnalyses = () => {
    setSelectedAnalysis(null)
  }

  const handleUserProfileClick = () => {
    setCurrentView("profile")
  }

  const handleHelpClick = () => {
    setCurrentView("help")
  }

  const handleBackToMain = () => {
    setCurrentView("analyses")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onUserProfileClick={handleUserProfileClick} onHelpClick={handleHelpClick} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          {currentView === "profile" && <UserProfile onBack={handleBackToMain} />}
          {currentView === "help" && <HelpCenter onBack={handleBackToMain} />}
          {currentView === "analyses" && (
            <>
              {selectedAnalysis ? (
                <AnalysisDetails
                  analysis={selectedAnalysis}
                  onBack={handleBackToAnalyses}
                  onUserProfileClick={handleUserProfileClick}
                  onHelpClick={handleHelpClick}
                />
              ) : (
                <AnalysesList
                  onAnalysisSelect={handleAnalysisSelect}
                  onUserProfileClick={handleUserProfileClick}
                  onHelpClick={handleHelpClick}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
