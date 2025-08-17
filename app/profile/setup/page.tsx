"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, User, Brain, Settings, CheckCircle } from "lucide-react"
import { useUserProfile } from "@/components/user-profile-provider"
import Navigation from "@/components/navigation"

const disabilityTypes = [
  { id: "dyslexia", label: "Dyslexia", description: "Difficulty with reading and language processing" },
  { id: "adhd", label: "ADHD", description: "Attention and hyperactivity challenges" },
  { id: "autism", label: "Autism Spectrum", description: "Social communication and sensory differences" },
  {
    id: "intellectual_disability",
    label: "Intellectual Disability",
    description: "Learning and adaptive behavior challenges",
  },
  { id: "visual_impairment", label: "Visual Impairment", description: "Blindness or low vision" },
  { id: "hearing_impairment", label: "Hearing Impairment", description: "Deafness or hard of hearing" },
  { id: "motor_disability", label: "Motor Disability", description: "Physical movement challenges" },
  { id: "speech_disability", label: "Speech Disability", description: "Communication and speech challenges" },
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user, createProfile } = useUserProfile()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [profileData, setProfileData] = useState({
    full_name: "",
    age: 8,
    disability_type: [] as string[],
    learning_preferences: {
      visualLearner: false,
      auditoryLearner: false,
      kinestheticLearner: false,
      preferredPace: "normal" as "slow" | "normal" | "fast",
      attentionSpan: "medium" as "short" | "medium" | "long",
      processingSpeed: "normal" as "slow" | "normal" | "fast",
    },
    accessibility_settings: {
      textSize: "normal",
      contrast: "normal",
      audioEnabled: false,
      signLanguage: false,
      motorAssistance: false,
    },
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDisabilityToggle = (disabilityId: string) => {
    setProfileData((prev) => ({
      ...prev,
      disability_type: prev.disability_type.includes(disabilityId)
        ? prev.disability_type.filter((id) => id !== disabilityId)
        : [...prev.disability_type, disabilityId],
    }))
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await createProfile(profileData)
      router.push("/profile")
    } catch (error) {
      console.error("Error creating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <User className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-display text-2xl font-semibold">Tell us about yourself</h2>
        <p className="text-muted-foreground">Let's start with some basic information</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">What's your name?</Label>
          <Input
            id="full_name"
            value={profileData.full_name}
            onChange={(e) => setProfileData((prev) => ({ ...prev, full_name: e.target.value }))}
            placeholder="Enter your full name"
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">How old are you?</Label>
          <Select
            value={profileData.age.toString()}
            onValueChange={(value) => setProfileData((prev) => ({ ...prev, age: Number.parseInt(value) }))}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 15 }, (_, i) => i + 3).map((age) => (
                <SelectItem key={age} value={age.toString()}>
                  {age} years old
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Brain className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-display text-2xl font-semibold">Learning Support</h2>
        <p className="text-muted-foreground">
          Select any conditions that apply to you. This helps us personalize your learning experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disabilityTypes.map((disability) => (
          <Card
            key={disability.id}
            className={`cursor-pointer transition-all ${
              profileData.disability_type.includes(disability.id)
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:shadow-md"
            }`}
            onClick={() => handleDisabilityToggle(disability.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={profileData.disability_type.includes(disability.id)}
                  onChange={() => handleDisabilityToggle(disability.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{disability.label}</h3>
                  <p className="text-sm text-muted-foreground">{disability.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Don't worry - you can always update this information later.</p>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Brain className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-display text-2xl font-semibold">Learning Preferences</h2>
        <p className="text-muted-foreground">Help us understand how you learn best</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">How do you like to learn? (Select all that apply)</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visual"
                checked={profileData.learning_preferences.visualLearner}
                onCheckedChange={(checked) =>
                  setProfileData((prev) => ({
                    ...prev,
                    learning_preferences: { ...prev.learning_preferences, visualLearner: !!checked },
                  }))
                }
              />
              <Label htmlFor="visual">I learn better with pictures and visual aids</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auditory"
                checked={profileData.learning_preferences.auditoryLearner}
                onCheckedChange={(checked) =>
                  setProfileData((prev) => ({
                    ...prev,
                    learning_preferences: { ...prev.learning_preferences, auditoryLearner: !!checked },
                  }))
                }
              />
              <Label htmlFor="auditory">I learn better by listening and hearing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="kinesthetic"
                checked={profileData.learning_preferences.kinestheticLearner}
                onCheckedChange={(checked) =>
                  setProfileData((prev) => ({
                    ...prev,
                    learning_preferences: { ...prev.learning_preferences, kinestheticLearner: !!checked },
                  }))
                }
              />
              <Label htmlFor="kinesthetic">I learn better by doing and touching</Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Learning Pace</Label>
            <Select
              value={profileData.learning_preferences.preferredPace}
              onValueChange={(value: "slow" | "normal" | "fast") =>
                setProfileData((prev) => ({
                  ...prev,
                  learning_preferences: { ...prev.learning_preferences, preferredPace: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Take my time</SelectItem>
                <SelectItem value="normal">Normal pace</SelectItem>
                <SelectItem value="fast">Quick learner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Attention Span</Label>
            <Select
              value={profileData.learning_preferences.attentionSpan}
              onValueChange={(value: "short" | "medium" | "long") =>
                setProfileData((prev) => ({
                  ...prev,
                  learning_preferences: { ...prev.learning_preferences, attentionSpan: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (5-10 min)</SelectItem>
                <SelectItem value="medium">Medium (10-20 min)</SelectItem>
                <SelectItem value="long">Long (20+ min)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Processing Speed</Label>
            <Select
              value={profileData.learning_preferences.processingSpeed}
              onValueChange={(value: "slow" | "normal" | "fast") =>
                setProfileData((prev) => ({
                  ...prev,
                  learning_preferences: { ...prev.learning_preferences, processingSpeed: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">I need extra time</SelectItem>
                <SelectItem value="normal">Normal speed</SelectItem>
                <SelectItem value="fast">I process quickly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Settings className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-display text-2xl font-semibold">Accessibility Settings</h2>
        <p className="text-muted-foreground">Choose settings that will help you learn better</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Helpful Features</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="audio"
                checked={profileData.accessibility_settings.audioEnabled}
                onCheckedChange={(checked) =>
                  setProfileData((prev) => ({
                    ...prev,
                    accessibility_settings: { ...prev.accessibility_settings, audioEnabled: !!checked },
                  }))
                }
              />
              <Label htmlFor="audio">Read text aloud to me</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sign"
                checked={profileData.accessibility_settings.signLanguage}
                onCheckedChange={(checked) =>
                  setProfileData((prev) => ({
                    ...prev,
                    accessibility_settings: { ...prev.accessibility_settings, signLanguage: !!checked },
                  }))
                }
              />
              <Label htmlFor="sign">Show sign language interpretation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="motor"
                checked={profileData.accessibility_settings.motorAssistance}
                onCheckedChange={(checked) =>
                  setProfileData((prev) => ({
                    ...prev,
                    accessibility_settings: { ...prev.accessibility_settings, motorAssistance: !!checked },
                  }))
                }
              />
              <Label htmlFor="motor">Make buttons and links easier to click</Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Text Size</Label>
            <Select
              value={profileData.accessibility_settings.textSize}
              onValueChange={(value) =>
                setProfileData((prev) => ({
                  ...prev,
                  accessibility_settings: { ...prev.accessibility_settings, textSize: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contrast</Label>
            <Select
              value={profileData.accessibility_settings.contrast}
              onValueChange={(value) =>
                setProfileData((prev) => ({
                  ...prev,
                  accessibility_settings: { ...prev.accessibility_settings, contrast: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High Contrast</SelectItem>
                <SelectItem value="extra-high">Extra High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profileData.full_name.trim().length > 0
      case 2:
        return true // Optional step
      case 3:
        return true // Optional step
      case 4:
        return true // Optional step
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-3xl font-bold text-primary">Profile Setup</h1>
            <Badge variant="secondary">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">{renderCurrentStep()}</CardContent>

          <div className="flex items-center justify-between p-6 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                size="lg"
                className="font-display"
              >
                {isSubmitting ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()} size="lg" className="font-display">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
