"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Clock,
  Star,
  Volume2,
  Eye,
  Hand,
  Brain,
  BookOpen,
  Gamepad2,
  PenTool,
  ClipboardCheck,
  Type,
} from "lucide-react"

interface LearningCardProps {
  id: string
  title: string
  description: string
  subject: string
  difficulty: number
  ageRange: [number, number]
  progress?: number
  timeEstimate?: number
  accessibilityFeatures: string[]
  contentType: "lesson" | "game" | "exercise" | "assessment"
  onStart: (id: string) => void
}

const subjectColors = {
  math: "bg-blue-100 text-blue-800",
  reading: "bg-green-100 text-green-800",
  science: "bg-purple-100 text-purple-800",
  general: "bg-orange-100 text-orange-800",
}

const contentTypeIcons = {
  lesson: BookOpen,
  game: Gamepad2,
  exercise: PenTool,
  assessment: ClipboardCheck,
}

const accessibilityIcons = {
  text_to_speech: Volume2,
  high_contrast: Eye,
  motor_assistance: Hand,
  sign_language: Hand,
  audio_descriptions: Volume2,
  large_text: Type,
  simplified_interface: Brain,
}

export default function LearningCard({
  id,
  title,
  description,
  subject,
  difficulty,
  ageRange,
  progress = 0,
  timeEstimate = 15,
  accessibilityFeatures,
  contentType,
  onStart,
}: LearningCardProps) {
  const ContentIcon = contentTypeIcons[contentType] || Play

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <ContentIcon className="h-5 w-5 text-primary" />
            <Badge
              variant="secondary"
              className={`${subjectColors[subject as keyof typeof subjectColors] || subjectColors.general} font-display`}
            >
              {subject}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>

        <CardTitle className="font-display text-lg leading-tight">{title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{timeEstimate} min</span>
          </div>
          <span>
            Ages {ageRange[0]}-{ageRange[1]}
          </span>
        </div>

        {/* Accessibility Features */}
        <div className="flex flex-wrap gap-1">
          {accessibilityFeatures.slice(0, 4).map((feature) => {
            const Icon = accessibilityIcons[feature as keyof typeof accessibilityIcons]
            return Icon ? (
              <div
                key={feature}
                className="flex items-center justify-center w-6 h-6 bg-secondary rounded-full"
                title={feature.replace(/_/g, " ")}
              >
                <Icon className="h-3 w-3 text-secondary-foreground" />
              </div>
            ) : null
          })}
          {accessibilityFeatures.length > 4 && (
            <div className="flex items-center justify-center w-6 h-6 bg-secondary rounded-full text-xs font-medium">
              +{accessibilityFeatures.length - 4}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button onClick={() => onStart(id)} className="w-full font-display font-medium focus-enhanced" size="lg">
          <Play className="h-4 w-4 mr-2" />
          {progress > 0 ? "Continue" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  )
}
