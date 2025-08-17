"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, Trophy, BookOpen, Clock, Target, Brain, Volume2, Eye, Hand, TrendingUp } from "lucide-react"
import { useUserProfile } from "@/components/user-profile-provider"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading } = useUserProfile()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    } else if (!loading && user && !profile) {
      router.push("/profile/setup")
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 animate-pulse text-primary" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null // Will redirect to setup
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const disabilityLabels: Record<string, string> = {
    dyslexia: "Dyslexia",
    adhd: "ADHD",
    autism: "Autism Spectrum",
    intellectual_disability: "Intellectual Disability",
    visual_impairment: "Visual Impairment",
    hearing_impairment: "Hearing Impairment",
    motor_disability: "Motor Disability",
    speech_disability: "Speech Disability",
  }

  // Mock progress data
  const progressData = {
    totalLessons: 24,
    completedLessons: 18,
    totalBadges: 12,
    earnedBadges: 8,
    weeklyGoal: 5,
    weeklyProgress: 4,
    streakDays: 7,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation currentPath="/profile" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="font-display text-2xl">{profile.full_name}</CardTitle>
                <p className="text-muted-foreground">{profile.age} years old</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member since</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>

                <Button className="w-full font-display" onClick={() => router.push("/profile/edit")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Learning Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Learning Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.disability_type.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.disability_type.map((type) => (
                      <Badge key={type} variant="secondary">
                        {disabilityLabels[type] || type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific support needs specified</p>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium">Active Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.accessibility_settings.audioEnabled && (
                      <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        <Volume2 className="h-3 w-3" />
                        <span>Audio</span>
                      </div>
                    )}
                    {profile.accessibility_settings.signLanguage && (
                      <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        <Hand className="h-3 w-3" />
                        <span>Sign Language</span>
                      </div>
                    )}
                    {profile.accessibility_settings.contrast !== "normal" && (
                      <div className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        <Eye className="h-3 w-3" />
                        <span>High Contrast</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Lessons</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {progressData.completedLessons}/{progressData.totalLessons}
                      </span>
                    </div>
                    <Progress value={(progressData.completedLessons / progressData.totalLessons) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Badges</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Earned</span>
                      <span>
                        {progressData.earnedBadges}/{progressData.totalBadges}
                      </span>
                    </div>
                    <Progress value={(progressData.earnedBadges / progressData.totalBadges) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Weekly Goal</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Week</span>
                      <span>
                        {progressData.weeklyProgress}/{progressData.weeklyGoal}
                      </span>
                    </div>
                    <Progress value={(progressData.weeklyProgress / progressData.weeklyGoal) * 100} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Completed "Basic Addition"</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +10 XP
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Started "Letter Recognition A-E"</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      In Progress
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Earned "Math Star" badge</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Learning Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">{progressData.streakDays}</div>
                  <p className="text-muted-foreground">days in a row!</p>
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          i < progressData.streakDays
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Keep it up! You're doing amazing!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
