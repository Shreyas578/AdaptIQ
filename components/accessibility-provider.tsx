"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AccessibilitySettings {
  textSize: "normal" | "large" | "extra-large"
  contrast: "normal" | "high" | "extra-high"
  audioEnabled: boolean
  audioSpeed: number
  reducedMotion: boolean
  simplifiedInterface: boolean
  colorBlindFriendly: boolean
  focusIndicators: "normal" | "enhanced" | "extra-enhanced"
  autoRead: boolean
  signLanguage: boolean
  motorAssistance: boolean
  keyboardNavigation: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
  resetSettings: () => void
  isAccessibilityPanelOpen: boolean
  setAccessibilityPanelOpen: (open: boolean) => void
}

const defaultSettings: AccessibilitySettings = {
  textSize: "normal",
  contrast: "normal",
  audioEnabled: true,
  audioSpeed: 1,
  reducedMotion: false,
  simplifiedInterface: false,
  colorBlindFriendly: false,
  focusIndicators: "normal",
  autoRead: false,
  signLanguage: false,
  motorAssistance: false,
  keyboardNavigation: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isAccessibilityPanelOpen, setAccessibilityPanelOpen] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("adaptiq-accessibility-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to load accessibility settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("adaptiq-accessibility-settings", JSON.stringify(settings))
    applyAccessibilitySettings(settings)
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isAccessibilityPanelOpen,
        setAccessibilityPanelOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

// Apply accessibility settings to the document
function applyAccessibilitySettings(settings: AccessibilitySettings) {
  const root = document.documentElement

  // Text size
  root.classList.remove("text-normal", "text-large", "text-extra-large")
  root.classList.add(`text-${settings.textSize.replace("-", "-")}`)

  // Contrast
  root.classList.remove("contrast-normal", "contrast-high", "contrast-extra-high")
  root.classList.add(`contrast-${settings.contrast.replace("-", "-")}`)

  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add("reduce-motion")
  } else {
    root.classList.remove("reduce-motion")
  }

  // Simplified interface
  if (settings.simplifiedInterface) {
    root.classList.add("simplified-interface")
  } else {
    root.classList.remove("simplified-interface")
  }

  // Color blind friendly
  if (settings.colorBlindFriendly) {
    root.classList.add("color-blind-friendly")
  } else {
    root.classList.remove("color-blind-friendly")
  }

  // Focus indicators
  root.classList.remove("focus-normal", "focus-enhanced", "focus-extra-enhanced")
  root.classList.add(`focus-${settings.focusIndicators.replace("-", "-")}`)

  // Motor assistance
  if (settings.motorAssistance) {
    root.classList.add("motor-assistance")
  } else {
    root.classList.remove("motor-assistance")
  }
}
