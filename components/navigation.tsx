"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, BookOpen, Gamepad2, User, Settings, Volume2, Eye, Menu, X, Accessibility } from "lucide-react"
import { useAccessibility } from "./accessibility-provider"

interface NavigationProps {
  currentPath?: string
}

export default function Navigation({ currentPath = "/" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { settings, updateSetting, setAccessibilityPanelOpen } = useAccessibility()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/lessons", label: "Lessons", icon: BookOpen },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/accessibility-tools", label: "Accessibility Tools", icon: Accessibility },
    { href: "/profile", label: "My Profile", icon: User },
  ]

  const accessibilityControls = [
    {
      icon: Volume2,
      label: "Toggle Audio Help",
      action: () => updateSetting("audioEnabled", !settings.audioEnabled),
      isActive: settings.audioEnabled,
    },
    {
      icon: Eye,
      label: "Toggle High Contrast",
      action: () => updateSetting("contrast", settings.contrast === "normal" ? "high" : "normal"),
      isActive: settings.contrast !== "normal",
    },
    {
      icon: Settings,
      label: "Accessibility Settings",
      action: () => setAccessibilityPanelOpen(true),
      isActive: false,
    },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 focus-enhanced rounded-lg">
            <Image src="/images/adaptiq-logo.png" alt="AdaptIQ Logo" width={40} height={40} className="rounded-lg" />
            <span className="font-display font-bold text-xl text-primary">AdaptIQ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    className="flex items-center space-x-2 focus-enhanced font-display font-medium"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Accessibility Controls */}
          <div className="hidden md:flex items-center space-x-2">
            {accessibilityControls.map((control, index) => {
              const Icon = control.icon
              return (
                <Button
                  key={index}
                  variant={control.isActive ? "default" : "outline"}
                  size="sm"
                  onClick={control.action}
                  className="focus-enhanced bg-transparent"
                  aria-label={control.label}
                  title={control.label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden focus-enhanced"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Card className="md:hidden mt-2 p-4 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    className="w-full justify-start space-x-3 focus-enhanced font-display"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}

            <div className="border-t pt-3 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Accessibility</p>
              <div className="grid grid-cols-2 gap-2">
                {accessibilityControls.map((control, index) => {
                  const Icon = control.icon
                  return (
                    <Button
                      key={index}
                      variant={control.isActive ? "default" : "outline"}
                      size="sm"
                      onClick={control.action}
                      className="focus-enhanced bg-transparent text-xs"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      <span className="truncate">{control.label.replace("Toggle ", "").replace(" Settings", "")}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </Card>
        )}
      </div>
    </nav>
  )
}
