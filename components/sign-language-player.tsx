"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Maximize, Minimize, Hand, Captions } from "lucide-react"

interface SignLanguagePlayerProps {
  contentId: string
  text: string
  language?: "asl" | "bsl" | "auslan" | "lsf"
  showCaptions?: boolean
  autoPlay?: boolean
  onComplete?: () => void
}

export default function SignLanguagePlayer({
  contentId,
  text,
  language = "asl",
  showCaptions = true,
  autoPlay = false,
  onComplete,
}: SignLanguagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(120) // Simulated duration
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [captionsEnabled, setCaptionsEnabled] = useState(showCaptions)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const videoRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + playbackSpeed
          if (newTime >= duration) {
            setIsPlaying(false)
            onComplete?.()
            return duration
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration, playbackSpeed, onComplete])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getLanguageName = (lang: string) => {
    const names = {
      asl: "American Sign Language",
      bsl: "British Sign Language",
      auslan: "Australian Sign Language",
      lsf: "French Sign Language",
    }
    return names[lang as keyof typeof names] || "Sign Language"
  }

  return (
    <Card className={`${isFullscreen ? "fixed inset-4 z-50" : ""} transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Hand className="h-5 w-5 text-primary" />
            <span>Sign Language Interpretation</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{getLanguageName(language)}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Player Area */}
        <div
          ref={videoRef}
          className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center"
        >
          {/* Simulated Sign Language Video */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center text-white space-y-4">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Hand className="h-16 w-16" />
              </div>
              <div className="text-lg font-medium">Sign Language Interpreter</div>
              <div className="text-sm opacity-80">{isPlaying ? "Interpreting..." : "Ready to interpret"}</div>
            </div>
          </div>

          {/* Captions Overlay */}
          {captionsEnabled && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-3 rounded text-center">
              <div className="text-sm leading-relaxed">
                {isPlaying ? text.slice(0, Math.floor((currentTime / duration) * text.length)) + "..." : text}
              </div>
            </div>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="absolute inset-0 w-full h-full bg-black/50 hover:bg-black/60 text-white border-0 rounded-none"
            >
              <Play className="h-12 w-12" />
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div
            ref={progressRef}
            className="w-full h-2 bg-secondary rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percentage = x / rect.width
              handleSeek(percentage * duration)
            }}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={captionsEnabled ? "bg-primary text-primary-foreground" : ""}
            >
              <Captions className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={([value]) => {
                    setVolume(value)
                    setIsMuted(value === 0)
                  }}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Speed Control */}
            <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sign Language</label>
                  <Select value={language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asl">American Sign Language</SelectItem>
                      <SelectItem value="bsl">British Sign Language</SelectItem>
                      <SelectItem value="auslan">Australian Sign Language</SelectItem>
                      <SelectItem value="lsf">French Sign Language</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interpreter Style</label>
                  <Select defaultValue="human">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="human">Human Interpreter</SelectItem>
                      <SelectItem value="avatar">3D Avatar</SelectItem>
                      <SelectItem value="animated">Animated Character</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Background</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-gray-900 text-white">
                    Dark
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                    Blue
                  </Button>
                  <Button variant="outline" size="sm" className="bg-green-600 text-white">
                    Green
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
