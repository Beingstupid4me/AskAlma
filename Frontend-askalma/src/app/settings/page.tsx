"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowLeft, Moon, Sun } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    username: "User",
    email: "user@example.com",
  })
  const { theme, setTheme } = useTheme()

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64">
        <header className="flex items-center p-3 border-b border-border">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          <Tabs defaultValue="general" className="w-full max-w-3xl mx-auto">
            <TabsList className="mb-6 bg-secondary">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure your chat experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="font-medium">
                        Enable Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when you get a response</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={settings.notifications}
                      onCheckedChange={(checked) => handleChange("notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="soundEffects" className="font-medium">
                        Sound Effects
                      </Label>
                      <p className="text-sm text-muted-foreground">Play sounds for new messages</p>
                    </div>
                    <Switch
                      id="soundEffects"
                      checked={settings.soundEffects}
                      onCheckedChange={(checked) => handleChange("soundEffects", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkMode" className="font-medium">
                        Dark Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={toggleTheme} className="h-10 w-10">
                      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Display Name</Label>
                    <Input
                      id="username"
                      value={settings.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end max-w-3xl mx-auto">
            <Button onClick={handleSave}>
              {saved ? (
                <span className="flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Saved!
                </span>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

