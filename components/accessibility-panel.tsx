"use client"

import { useAccessibility } from "./accessibility-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Volume2, Brain, Hand, RotateCcw } from "lucide-react"

export default function AccessibilityPanel() {
  const { settings, updateSetting, resetSettings, isAccessibilityPanelOpen, setAccessibilityPanelOpen } =
    useAccessibility()

  const settingSections = [
    {
      title: "Visual Settings",
      icon: Eye,
      settings: [
        {
          key: "textSize" as const,
          label: "Text Size",
          type: "select" as const,
          options: [
            { value: "normal", label: "Normal" },
            { value: "large", label: "Large" },
            { value: "extra-large", label: "Extra Large" },
          ],
        },
        {
          key: "contrast" as const,
          label: "Contrast",
          type: "select" as const,
          options: [
            { value: "normal", label: "Normal" },
            { value: "high", label: "High" },
            { value: "extra-high", label: "Extra High" },
          ],
        },
        {
          key: "colorBlindFriendly" as const,
          label: "Color Blind Friendly",
          type: "switch" as const,
          description: "Use patterns and shapes in addition to colors",
        },
        {
          key: "focusIndicators" as const,
          label: "Focus Indicators",
          type: "select" as const,
          options: [
            { value: "normal", label: "Normal" },
            { value: "enhanced", label: "Enhanced" },
            { value: "extra-enhanced", label: "Extra Enhanced" },
          ],
        },
      ],
    },
    {
      title: "Audio Settings",
      icon: Volume2,
      settings: [
        {
          key: "audioEnabled" as const,
          label: "Audio Assistance",
          type: "switch" as const,
          description: "Enable text-to-speech and audio descriptions",
        },
        {
          key: "audioSpeed" as const,
          label: "Audio Speed",
          type: "slider" as const,
          min: 0.5,
          max: 2,
          step: 0.1,
          description: "Adjust the speed of audio narration",
        },
        {
          key: "autoRead" as const,
          label: "Auto-Read Content",
          type: "switch" as const,
          description: "Automatically read new content aloud",
        },
      ],
    },
    {
      title: "Motor & Navigation",
      icon: Hand,
      settings: [
        {
          key: "motorAssistance" as const,
          label: "Motor Assistance",
          type: "switch" as const,
          description: "Larger click targets and hover assistance",
        },
        {
          key: "keyboardNavigation" as const,
          label: "Enhanced Keyboard Navigation",
          type: "switch" as const,
          description: "Improved keyboard shortcuts and navigation",
        },
        {
          key: "reducedMotion" as const,
          label: "Reduce Motion",
          type: "switch" as const,
          description: "Minimize animations and transitions",
        },
      ],
    },
    {
      title: "Cognitive Support",
      icon: Brain,
      settings: [
        {
          key: "simplifiedInterface" as const,
          label: "Simplified Interface",
          type: "switch" as const,
          description: "Hide advanced features and reduce complexity",
        },
        {
          key: "signLanguage" as const,
          label: "Sign Language Support",
          type: "switch" as const,
          description: "Show sign language interpretations when available",
        },
      ],
    },
  ]

  return (
    <Dialog open={isAccessibilityPanelOpen} onOpenChange={setAccessibilityPanelOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 font-display text-2xl">
            <Eye className="h-6 w-6 text-primary" />
            <span>Accessibility Settings</span>
          </DialogTitle>
          <DialogDescription>Customize your learning experience to match your needs and preferences.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {settingSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg font-display">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>

                      {setting.type === "switch" && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={setting.key}
                            checked={settings[setting.key] as boolean}
                            onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                          />
                          <Label htmlFor={setting.key} className="text-sm text-muted-foreground cursor-pointer">
                            {settings[setting.key] ? "Enabled" : "Disabled"}
                          </Label>
                        </div>
                      )}

                      {setting.type === "select" && (
                        <Select
                          value={settings[setting.key] as string}
                          onValueChange={(value) => updateSetting(setting.key, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {setting.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {setting.type === "slider" && (
                        <div className="space-y-2">
                          <Slider
                            value={[settings[setting.key] as number]}
                            onValueChange={([value]) => updateSetting(setting.key, value)}
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground text-center">
                            {(settings[setting.key] as number).toFixed(1)}x
                          </div>
                        </div>
                      )}

                      {setting.description && <p className="text-xs text-muted-foreground">{setting.description}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Separator />

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={resetSettings} className="flex items-center space-x-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setAccessibilityPanelOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setAccessibilityPanelOpen(false)}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
