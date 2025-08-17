"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import AdaptiveContentRenderer from "@/components/adaptive-content-renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trophy, Star } from "lucide-react"
import type { UserProfile } from "@/lib/ai-adaptation"

// Sample user profile - in a real app, this would come from the database
const sampleUserProfile: UserProfile = {
  id: "user-1",
  disabilityTypes: ["dyslexia", "adhd"],
  learningPreferences: {
    visualLearner: true,
    auditoryLearner: true,
    kinestheticLearner: false,
    preferredPace: "slow",
    attentionSpan: "short",
    processingSpeed: "slow",
  },
  cognitiveProfile: {
    workingMemoryCapacity: "medium",
    executiveFunctionLevel: "low",
    languageProcessing: "medium",
  },
  performanceHistory: {
    averageAccuracy: 0.75,
    averageCompletionTime: 450, // seconds
    strugglingConcepts: ["multiplication", "reading comprehension"],
    masteredConcepts: ["addition", "letter recognition"],
  },
}

// Sample lesson content
const sampleLessons: Record<string, any> = {
  "1": {
    id: "1",
    title: "Basic Addition",
    description: "Learn to add numbers 1-10 with visual aids and interactive exercises",
    instructions:
      "Let's learn to add numbers together! We'll start with small numbers and use pictures to help us understand.",
    steps: [
      {
        title: "Understanding Addition",
        content: "Addition means putting numbers together to make a bigger number.",
        visualAids: true,
      },
      {
        title: "Practice with Pictures",
        content: "Count the objects and add them together.",
        visualAids: true,
      },
      {
        title: "Try It Yourself",
        content: "Solve these addition problems on your own.",
        visualAids: true,
      },
    ],
  },
  "2": {
    id: "2",
    title: "Letter Recognition A-E",
    description: "Interactive letter recognition with audio pronunciation and visual cues",
    instructions: "Let's learn the first five letters of the alphabet! We'll see, hear, and practice each letter.",
    steps: [
      {
        title: "Meet the Letters",
        content: "Let's look at letters A, B, C, D, and E.",
        visualAids: true,
      },
      {
        title: "Letter Sounds",
        content: "Each letter makes a special sound. Let's listen!",
        visualAids: true,
      },
      {
        title: "Practice Writing",
        content: "Trace each letter with your finger or mouse.",
        visualAids: true,
      },
    ],
  },
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const lessonId = params.id as string
  const lesson = sampleLessons[lessonId]

  useEffect(() => {
    if (!lesson) {
      router.push("/")
    }
  }, [lesson, router])

  const handleProgress = (newProgress: number) => {
    setProgress(newProgress)
  }

  const handleComplete = () => {
    setIsCompleted(true)
    setShowCelebration(true)

    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false)
    }, 3000)
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-lg">Lesson not found</p>
              <Button onClick={() => router.push("/")} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="text-center p-8 max-w-md mx-4">
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <h2 className="font-display text-2xl font-bold">Congratulations!</h2>
              <p className="text-muted-foreground">You've completed the lesson! Great job learning and practicing.</p>
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/")} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>

          {isCompleted && (
            <div className="flex items-center space-x-2 text-green-600">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Lesson Completed!</span>
            </div>
          )}
        </div>

        {/* Adaptive Content */}
        <AdaptiveContentRenderer
          content={lesson}
          userProfile={sampleUserProfile}
          onProgress={handleProgress}
          onComplete={handleComplete}
        />
      </main>
    </div>
  )
}
