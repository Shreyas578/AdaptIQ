"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import LearningCard from "@/components/learning-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Gamepad2, Trophy, TrendingUp, Heart, Sparkles } from "lucide-react"

// Sample learning content data
const sampleContent = [
  {
    id: "1",
    title: "Basic Addition",
    description: "Learn to add numbers 1-10 with visual aids and interactive exercises",
    subject: "math",
    difficulty: 1,
    ageRange: [5, 8] as [number, number],
    progress: 65,
    timeEstimate: 15,
    accessibilityFeatures: ["text_to_speech", "high_contrast", "large_text", "sign_language"],
    contentType: "lesson" as const,
  },
  {
    id: "2",
    title: "Letter Recognition A-E",
    description: "Interactive letter recognition with audio pronunciation and visual cues",
    subject: "reading",
    difficulty: 1,
    ageRange: [4, 7] as [number, number],
    progress: 30,
    timeEstimate: 20,
    accessibilityFeatures: ["text_to_speech", "audio_descriptions", "high_contrast", "large_text", "sign_language"],
    contentType: "lesson" as const,
  },
  {
    id: "3",
    title: "Shapes and Colors",
    description: "Learn basic shapes and colors through interactive games and activities",
    subject: "general",
    difficulty: 1,
    ageRange: [3, 6] as [number, number],
    progress: 0,
    timeEstimate: 12,
    accessibilityFeatures: ["text_to_speech", "audio_descriptions", "simplified_interface"],
    contentType: "game" as const,
  },
]

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  const subjects = [
    { id: "all", label: "All Subjects", icon: Sparkles },
    { id: "math", label: "Math", icon: BookOpen },
    { id: "reading", label: "Reading", icon: BookOpen },
    { id: "science", label: "Science", icon: BookOpen },
    { id: "general", label: "General", icon: Heart },
  ]

  const filteredContent =
    selectedSubject === "all" ? sampleContent : sampleContent.filter((item) => item.subject === selectedSubject)

  const handleStartLearning = (contentId: string) => {
    console.log(`Starting learning content: ${contentId}`)
    // TODO: Navigate to learning interface
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation currentPath="/" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Welcome to AdaptIQ!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your personalized learning adventure awaits. Discover lessons, games, and activities designed just for you.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="font-display text-2xl text-blue-600">12</CardTitle>
              <p className="text-muted-foreground">Lessons Completed</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="font-display text-2xl text-green-600">8</CardTitle>
              <p className="text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="font-display text-2xl text-purple-600">85%</CardTitle>
              <p className="text-muted-foreground">Progress This Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Filter */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Choose Your Subject</h2>
          <div className="flex flex-wrap gap-3">
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedSubject(subject.id)}
                  className="font-display focus-enhanced"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {subject.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Learning Content Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold">
              {selectedSubject === "all"
                ? "All Learning Activities"
                : `${subjects.find((s) => s.id === selectedSubject)?.label} Activities`}
            </h2>
            <Badge variant="secondary" className="font-display">
              {filteredContent.length} activities
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => (
              <LearningCard key={content.id} {...content} onStart={handleStartLearning} />
            ))}
          </div>
        </div>

        {/* Encouragement Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-2">You're Doing Great!</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Keep up the amazing work! Every lesson brings you closer to your learning goals.
            </p>
            <Button size="lg" className="font-display focus-enhanced">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Play a Fun Game
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
