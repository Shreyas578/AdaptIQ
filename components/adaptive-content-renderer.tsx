"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignLanguagePlayer from "./sign-language-player"
import {
  Brain,
  Volume2,
  Eye,
  Lightbulb,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Hand,
} from "lucide-react"
import { useAIAdaptation, type UserProfile, type AdaptedContent } from "@/lib/ai-adaptation"
import { useAccessibility } from "./accessibility-provider"

interface AdaptiveContentRendererProps {
  content: any
  userProfile: UserProfile
  onProgress: (progress: number) => void
  onComplete: () => void
}

export default function AdaptiveContentRenderer({
  content,
  userProfile,
  onProgress,
  onComplete,
}: AdaptiveContentRendererProps) {
  const { adaptContent } = useAIAdaptation()
  const { settings } = useAccessibility()
  const [adaptedContent, setAdaptedContent] = useState<AdaptedContent | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<string>("adapted")
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const adapted = adaptContent(content, userProfile)
    setAdaptedContent(adapted)
  }, [content, userProfile, adaptContent])

  if (!adaptedContent) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 animate-pulse text-primary" />
            <span>AI is adapting content for you...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalSteps = adaptedContent.adaptedContent.steps?.length || 1
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleStepComplete = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      onProgress(progress)
    } else {
      onComplete()
    }
  }

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying)
    console.log(isPlaying ? "Pausing audio" : "Playing audio")
  }

  const renderAdaptationInfo = () => (
    <Alert className="mb-4">
      <Brain className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <span>{adaptedContent.adaptationReason}</span>
          <Badge variant="secondary">{Math.round(adaptedContent.confidenceScore * 100)}% confidence</Badge>
        </div>
      </AlertDescription>
    </Alert>
  )

  const renderMainContent = () => {
    const currentContent =
      selectedFormat === "adapted"
        ? adaptedContent.adaptedContent
        : adaptedContent.alternativeFormats[selectedFormat] || adaptedContent.adaptedContent

    const currentStepContent = currentContent.steps?.[currentStep]
    const stepText = currentStepContent?.content || currentContent.instructions || ""

    return (
      <div className="space-y-6">
        {/* Content Header */}
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-semibold">{currentContent.title}</h2>
          <p className="text-muted-foreground">{currentContent.description}</p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Sign Language Integration */}
        {settings.signLanguage && (
          <SignLanguagePlayer
            contentId={`${content.id}-step-${currentStep}`}
            text={stepText}
            language="asl"
            showCaptions={true}
            autoPlay={false}
          />
        )}

        {/* Main Learning Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <div className="flex items-center space-x-2">
                {adaptedContent.alternativeFormats.audio && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAudioToggle}
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowHints(!showHints)} aria-label="Toggle hints">
                  <HelpCircle className="h-4 w-4" />
                </Button>
                {settings.signLanguage && (
                  <Button variant="outline" size="sm" className="bg-primary/10 text-primary">
                    <Hand className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step Instructions */}
            <div className="text-lg leading-relaxed">{stepText || "Follow the interactive elements below."}</div>

            {/* Visual Aids */}
            {currentContent.visualAids && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Visual Support</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border-2 border-dashed border-blue-200">
                    <div className="text-center text-blue-600">Visual Aid Placeholder</div>
                  </div>
                  <div className="bg-white p-3 rounded border-2 border-dashed border-blue-200">
                    <div className="text-center text-blue-600">Interactive Element</div>
                  </div>
                </div>
              </div>
            )}

            {/* Hints */}
            {showHints && adaptedContent.adaptedContent.hints && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {adaptedContent.adaptedContent.hints.map((hint: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{index + 1}</span>
                        <span className="text-sm">{hint}</span>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Interactive Practice Area */}
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center space-y-4">
                <div className="text-gray-600">Interactive Practice Area</div>
                <div className="text-sm text-gray-500">
                  Adapted for {userProfile.disabilityTypes.join(", ") || "your learning style"}
                </div>

                {/* Simulated interactive elements */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button variant="outline" className="h-16 bg-transparent">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Option A
                  </Button>
                  <Button variant="outline" className="h-16 bg-transparent">
                    <AlertCircle className="h-6 w-6 mr-2" />
                    Option B
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={handleStepComplete} size="lg" className="font-display">
                {currentStep === totalSteps - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next Step
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {renderAdaptationInfo()}

      {/* Format Selection Tabs */}
      <Tabs value={selectedFormat} onValueChange={setSelectedFormat}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="adapted">Adapted</TabsTrigger>
          {adaptedContent.alternativeFormats.visual && <TabsTrigger value="visual">Visual</TabsTrigger>}
          {adaptedContent.alternativeFormats.audio && <TabsTrigger value="audio">Audio</TabsTrigger>}
          {adaptedContent.alternativeFormats.interactive && <TabsTrigger value="interactive">Interactive</TabsTrigger>}
          {settings.signLanguage && (
            <TabsTrigger value="sign-language" className="flex items-center space-x-1">
              <Hand className="h-3 w-3" />
              <span>Sign</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="adapted" className="mt-6">
          {renderMainContent()}
        </TabsContent>

        <TabsContent value="visual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Visual Learning Format</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-lg">
                  <div className="text-lg font-medium mb-2">Visual Representation</div>
                  <div className="text-sm text-muted-foreground">
                    Enhanced with diagrams, infographics, and visual cues
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5" />
                <span>Audio Learning Format</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-lg">
                  <div className="text-lg font-medium mb-2">Audio Narration</div>
                  <div className="text-sm text-muted-foreground">
                    Full audio description with sound effects and clear narration
                  </div>
                  <Button className="mt-4" onClick={handleAudioToggle}>
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"} Audio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactive" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Interactive Format</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-lg">
                  <div className="text-lg font-medium mb-2">Enhanced Interactions</div>
                  <div className="text-sm text-muted-foreground">
                    Adapted interaction methods based on your motor abilities
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sign-language" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hand className="h-5 w-5" />
                <span>Sign Language Format</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SignLanguagePlayer
                contentId={`${content.id}-full`}
                text={adaptedContent.adaptedContent.instructions || adaptedContent.adaptedContent.description || ""}
                language="asl"
                showCaptions={true}
                autoPlay={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
