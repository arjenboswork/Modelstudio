"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  BarChart3,
  Database,
  Settings,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react"

interface SidebarProps {
  onUserProfileClick: () => void
  onHelpClick: () => void
}

export default function Sidebar({ onUserProfileClick, onHelpClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true, badge: null },
    { icon: BarChart3, label: "Analytics", active: false, badge: "3" },
    { icon: Database, label: "Datasets", active: false, badge: null },
    { icon: Search, label: "Search", active: false, badge: null },
    { icon: Bell, label: "Notifications", active: false, badge: "2" },
    { icon: Settings, label: "Settings", active: false, badge: null },
  ]

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img src="/images/logo-phoenix-sm.png" alt="Phoenix" className="w-8 h-8" />
              <span className="font-semibold text-lg">Phoenix</span>
            </div>
          )}
          {isCollapsed && <img src="/images/logo-phoenix-sm.png" alt="Phoenix" className="w-8 h-8 mx-auto" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white p-1"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <li key={index}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left ${
                    item.active
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  } ${isCollapsed ? "px-2" : "px-3"}`}
                >
                  <IconComponent className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto bg-red-500 text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 ${isCollapsed ? "px-2" : "px-3"}`}
            onClick={onUserProfileClick}
          >
            <User className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span>Profile</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 ${isCollapsed ? "px-2" : "px-3"}`}
            onClick={onHelpClick}
          >
            <HelpCircle className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span>Help</span>}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <img src="/images/profile-photo.png" alt="User" className="w-8 h-8 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-400 truncate">Clinical Pharmacologist</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
