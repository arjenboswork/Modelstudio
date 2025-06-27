"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Camera, Save, Bell, Shield, User, Settings } from "lucide-react"

interface UserProfileProps {
  onBack: () => void
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const [profileData, setProfileData] = useState({
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@pharma.com",
    title: "Senior Clinical Pharmacologist",
    organization: "Global Pharma Inc.",
    department: "Clinical Pharmacology",
    phone: "+1 (555) 123-4567",
    bio: "Experienced clinical pharmacologist specializing in population PK/PD modeling and regulatory submissions.",
    location: "Boston, MA",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    modelUpdates: true,
    systemMaintenance: true,
    darkMode: false,
    autoSave: true,
    advancedFeatures: true,
  })

  const handleSave = () => {
    // Save profile data
    console.log("Saving profile data:", profileData)
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

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
              <h1 className="text-xl font-semibold">User Profile</h1>
              <p className="text-sm text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src="/images/profile-photo.png"
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                        variant="secondary"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <p className="text-gray-600">{profileData.title}</p>
                      <Badge variant="outline" className="mt-1">
                        {profileData.organization}
                      </Badge>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={profileData.organization}
                        onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <p className="text-sm text-gray-600">
                    Choose how you want to be notified about updates and activities
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive browser push notifications</p>
                      </div>
                      <Switch
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Weekly Reports</h4>
                        <p className="text-sm text-gray-600">Get weekly summary of your analyses</p>
                      </div>
                      <Switch
                        checked={preferences.weeklyReports}
                        onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Model Updates</h4>
                        <p className="text-sm text-gray-600">Notifications when models are updated</p>
                      </div>
                      <Switch
                        checked={preferences.modelUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange("modelUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">System Maintenance</h4>
                        <p className="text-sm text-gray-600">Important system updates and maintenance</p>
                      </div>
                      <Switch
                        checked={preferences.systemMaintenance}
                        onCheckedChange={(checked) => handlePreferenceChange("systemMaintenance", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <p className="text-sm text-gray-600">Manage your account security and authentication</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Change Password</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        <Button variant="outline">Update Password</Button>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Active Sessions</h4>
                      <p className="text-sm text-gray-600 mb-3">Manage your active login sessions</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-gray-600">Chrome on Windows • Boston, MA</p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <p className="text-sm text-gray-600">Customize your application experience</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dark Mode</h4>
                        <p className="text-sm text-gray-600">Use dark theme for the interface</p>
                      </div>
                      <Switch
                        checked={preferences.darkMode}
                        onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Auto-save</h4>
                        <p className="text-sm text-gray-600">Automatically save your work</p>
                      </div>
                      <Switch
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => handlePreferenceChange("autoSave", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Advanced Features</h4>
                        <p className="text-sm text-gray-600">Show advanced modeling options</p>
                      </div>
                      <Switch
                        checked={preferences.advancedFeatures}
                        onCheckedChange={(checked) => handlePreferenceChange("advancedFeatures", checked)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Data Export Format</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="exportFormat" value="csv" defaultChecked />
                        <span>CSV</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="exportFormat" value="excel" />
                        <span>Excel</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="exportFormat" value="json" />
                        <span>JSON</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Default Model Type</h4>
                    <select className="w-full p-2 border rounded-md">
                      <option value="population_pk">Population PK</option>
                      <option value="pkpd">PK/PD</option>
                      <option value="exposure_response">Exposure-Response</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
