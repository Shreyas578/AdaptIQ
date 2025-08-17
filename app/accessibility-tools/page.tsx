"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Volume2, VolumeX, Camera, Type, Brain, Hand, Eye, RotateCcw } from "lucide-react"
import { useWhisperSpeech } from "@/lib/whisper-speech"
import { useElevenLabsTTS } from "@/lib/elevenlabs-tts"
import { useMediaPipeHands } from "@/lib/mediapipe-hands"
import { useOllamaAI } from "@/lib/ollama-ai"

export default function AccessibilityToolsPage() {
  const whisperSpeech = useWhisperSpeech()
  const elevenLabsTTS = useElevenLabsTTS()
  const mediaPipeHands = useMediaPipeHands()
  const ollamaAI = useOllamaAI()

  const [inputText, setInputText] = useState("")
  const [simplifiedContent, setSimplifiedContent] = useState<string>("")
  const [currentTool, setCurrentTool] = useState("voice-text")
  const [selectedVoice, setSelectedVoice] = useState("")
  const [speechRate, setSpeechRate] = useState(1)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    elevenLabsTTS.loadVoices()
  }, [])

  useEffect(() => {
    if (currentTool === "sign-language" && videoRef && canvasRef && mediaPipeHands.detector) {
      mediaPipeHands.detector.startCamera(videoRef, canvasRef)
    }

    return () => {
      if (mediaPipeHands.detector) {
        mediaPipeHands.detector.stopCamera()
      }
    }
  }, [currentTool, videoRef, canvasRef, mediaPipeHands.detector])

  const handleStartRecording = async () => {
    try {
      await whisperSpeech.startRecording()
    } catch (error) {
      console.error("[v0] Failed to start recording:", error)
    }
  }

  const handleStopRecording = () => {
    whisperSpeech.stopRecording()
  }

  const handleSpeak = async (text: string) => {
    if (!text.trim()) return
    try {
      await elevenLabsTTS.speak(text, selectedVoice, {
        stability: 0.5,
        similarity_boost: 0.5,
      })
    } catch (error) {
      console.error("[v0] Speech synthesis failed:", error)
    }
  }

  const handleSimplifyContent = async () => {
    if (!inputText.trim()) return

    try {
      const simplified = await ollamaAI.simplifyContent(inputText, "ADHD and Autism", "8-12")
      setSimplifiedContent(simplified)
    } catch (error) {
      console.error("[v0] Content simplification error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🌟 Accessibility Tools Hub</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Specialized tools powered by real AI - MediaPipe, Whisper, ElevenLabs, and Ollama
          </p>
        </div>

        <Tabs value={currentTool} onValueChange={setCurrentTool} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="voice-text" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice ↔ Text
            </TabsTrigger>
            <TabsTrigger value="sign-language" className="flex items-center gap-2">
              <Hand className="w-4 h-4" />
              Sign Language
            </TabsTrigger>
            <TabsTrigger value="content-simplifier" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Simplifier
            </TabsTrigger>
            <TabsTrigger value="multimodal" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Multimodal
            </TabsTrigger>
          </TabsList>

          {/* Voice ↔ Text Conversion with Whisper and ElevenLabs */}
          <TabsContent value="voice-text">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    Whisper Speech to Text
                  </CardTitle>
                  <CardDescription>Local AI-powered speech recognition using OpenAI Whisper</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {whisperSpeech.isLoading && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">Loading Whisper AI model...</p>
                      </div>
                    )}

                    {whisperSpeech.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{whisperSpeech.error}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={whisperSpeech.isRecording ? handleStopRecording : handleStartRecording}
                        disabled={whisperSpeech.isLoading}
                        className={`flex-1 h-16 text-lg ${
                          whisperSpeech.isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {whisperSpeech.isRecording ? (
                          <>
                            <MicOff className="w-6 h-6 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-6 h-6 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>

                    {whisperSpeech.transcription && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge>Whisper AI Transcription</Badge>
                          <Badge variant="outline">High Accuracy</Badge>
                        </div>
                        <p className="text-lg">{whisperSpeech.transcription}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5 text-green-600" />
                    ElevenLabs Text to Speech
                  </CardTitle>
                  <CardDescription>High-quality AI voice synthesis with natural-sounding voices</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {elevenLabsTTS.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{elevenLabsTTS.error}</p>
                      </div>
                    )}

                    <Textarea
                      placeholder="Type or paste text here for high-quality AI voice synthesis..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-32 text-lg"
                    />

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">ElevenLabs Voice</label>
                        <Select onValueChange={setSelectedVoice}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AI voice" />
                          </SelectTrigger>
                          <SelectContent>
                            {elevenLabsTTS.voices.map((voice) => (
                              <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                {voice.name} ({voice.labels?.accent || "Default"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSpeak(inputText)}
                        disabled={elevenLabsTTS.isPlaying || elevenLabsTTS.isLoading || !inputText}
                        className="flex-1 h-16 text-lg bg-green-500 hover:bg-green-600"
                      >
                        {elevenLabsTTS.isPlaying ? (
                          <>
                            <VolumeX className="w-6 h-6 mr-2" />
                            Playing...
                          </>
                        ) : elevenLabsTTS.isLoading ? (
                          <>
                            <Volume2 className="w-6 h-6 mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-6 h-6 mr-2" />
                            AI Voice Synthesis
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sign Language with MediaPipe */}
          <TabsContent value="sign-language">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-600" />
                    MediaPipe Hand Detection
                  </CardTitle>
                  <CardDescription>Real-time hand gesture recognition using Google MediaPipe</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mediaPipeHands.isLoading && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-800">Loading MediaPipe AI model...</p>
                      </div>
                    )}

                    {mediaPipeHands.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{mediaPipeHands.error}</p>
                      </div>
                    )}

                    <div className="relative bg-gray-900 rounded-lg overflow-hidden h-64">
                      <video ref={setVideoRef} autoPlay muted className="w-full h-full object-cover" />
                      <canvas ref={setCanvasRef} className="absolute inset-0 w-full h-full" width={640} height={480} />
                      {!videoRef && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>MediaPipe Camera</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {mediaPipeHands.detectedGestures.length > 0 && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge>MediaPipe Detection</Badge>
                          <Badge variant="outline">Real-time AI</Badge>
                        </div>
                        <p className="text-lg mb-2">🤟 {mediaPipeHands.detectedGestures.join(", ")}</p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSpeak(mediaPipeHands.detectedGestures.join(" "))}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Volume2 className="w-4 h-4 mr-1" />
                            Speak Gesture
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-200">
                <CardHeader className="bg-indigo-50">
                  <CardTitle className="flex items-center gap-2">
                    <Hand className="w-5 h-5 text-indigo-600" />
                    Voice-to-Sign Converter
                  </CardTitle>
                  <CardDescription>Converts spoken words into sign language demonstrations</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type what you want to convert to sign language..."
                      className="min-h-32 text-lg"
                    />

                    <Button className="w-full h-12 bg-indigo-500 hover:bg-indigo-600">
                      <Hand className="w-5 h-5 mr-2" />
                      Show Sign Language
                    </Button>

                    <div className="p-4 bg-indigo-50 rounded-lg text-center">
                      <div className="text-6xl mb-2">🤟</div>
                      <p className="text-lg font-medium">Sign demonstration will appear here</p>
                      <p className="text-sm text-gray-600">AI-powered sign language animation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Content Simplifier with Ollama */}
          <TabsContent value="content-simplifier">
            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-600" />
                  Ollama AI Content Simplifier
                </CardTitle>
                <CardDescription>
                  Uses Ollama Gemma 2B model to break down complex concepts for neurodivergent learners
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Complex Content Input</label>
                    <Textarea
                      placeholder="Paste complex text here for AI simplification using Ollama Gemma 2B..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-48 text-lg"
                    />

                    <Button
                      onClick={handleSimplifyContent}
                      disabled={!inputText || ollamaAI.isProcessing}
                      className="w-full h-12 bg-orange-500 hover:bg-orange-600"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      {ollamaAI.isProcessing ? "AI Processing..." : "Simplify with Ollama AI"}
                    </Button>

                    {ollamaAI.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{ollamaAI.error}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">AI Simplified Output</label>
                    <div className="min-h-48 p-4 bg-orange-50 rounded-lg border">
                      {simplifiedContent ? (
                        <div className="space-y-4">
                          <div>
                            <Badge className="mb-2">Ollama Gemma 2B Output</Badge>
                            <p className="text-lg">{simplifiedContent}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center py-12">
                          <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>AI simplified content will appear here</p>
                        </div>
                      )}
                    </div>

                    {simplifiedContent && (
                      <Button
                        onClick={() => handleSpeak(simplifiedContent)}
                        className="w-full h-12 bg-green-500 hover:bg-green-600"
                      >
                        <Volume2 className="w-5 h-5 mr-2" />
                        Read with ElevenLabs
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multimodal Learning */}
          <TabsContent value="multimodal">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-teal-200">
                <CardHeader className="bg-teal-50">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-teal-600" />
                    Visual to Audio
                  </CardTitle>
                  <CardDescription>Converts visual content to audio descriptions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-32 bg-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-teal-200">
                      <div className="text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2 text-teal-400" />
                        <p className="text-sm text-teal-600">Upload image</p>
                      </div>
                    </div>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Describe Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-pink-200">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Hand className="w-5 h-5 text-pink-600" />
                    Tactile Converter
                  </CardTitle>
                  <CardDescription>Converts visuals to tactile patterns</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="h-8 bg-pink-100 rounded border hover:bg-pink-200 cursor-pointer" />
                      ))}
                    </div>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                      <Hand className="w-4 h-4 mr-2" />
                      Generate Pattern
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-cyan-200">
                <CardHeader className="bg-cyan-50">
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-cyan-600" />
                    Format Converter
                  </CardTitle>
                  <CardDescription>Multi-format content conversion</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Badge variant="outline">Text → Braille</Badge>
                      <Badge variant="outline">Audio → Visual</Badge>
                      <Badge variant="outline">Sign → Text</Badge>
                    </div>
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Convert Format
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
