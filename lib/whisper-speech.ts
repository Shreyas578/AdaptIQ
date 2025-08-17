"use client"

import { useEffect, useState } from "react"

// Whisper.js integration for local speech-to-text
export class WhisperSpeechRecognition {
  private worker: Worker | null = null
  private isInitialized = false
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []

  constructor() {
    this.initializeWhisper()
  }

  private async initializeWhisper() {
    try {
      // Initialize Whisper Web Worker
      this.worker = new Worker("/workers/whisper-worker.js")

      this.worker.onmessage = (event) => {
        const { type, data } = event.data

        switch (type) {
          case "initialized":
            this.isInitialized = true
            console.log("[v0] Whisper initialized successfully")
            break
          case "transcription":
            window.dispatchEvent(
              new CustomEvent("whisperTranscription", {
                detail: { text: data.text, confidence: data.confidence },
              }),
            )
            break
          case "error":
            console.error("[v0] Whisper error:", data)
            break
        }
      }

      // Initialize Whisper model
      this.worker.postMessage({ type: "initialize", model: "whisper-tiny" })
    } catch (error) {
      console.error("[v0] Whisper initialization failed:", error)
    }
  }

  public async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" })
        this.transcribeAudio(audioBlob)
      }

      this.mediaRecorder.start(1000) // Collect data every second
    } catch (error) {
      console.error("[v0] Failed to start recording:", error)
      throw error
    }
  }

  public stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop()
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    }
  }

  private async transcribeAudio(audioBlob: Blob): Promise<void> {
    if (!this.worker || !this.isInitialized) {
      console.error("[v0] Whisper not initialized")
      return
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      this.worker.postMessage({
        type: "transcribe",
        audio: arrayBuffer,
      })
    } catch (error) {
      console.error("[v0] Transcription failed:", error)
    }
  }
}

export function useWhisperSpeech() {
  const [whisper, setWhisper] = useState<WhisperSpeechRecognition | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initWhisper = async () => {
      try {
        const whisperInstance = new WhisperSpeechRecognition()
        setWhisper(whisperInstance)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to initialize Whisper")
        setIsLoading(false)
      }
    }

    initWhisper()

    // Listen for transcription events
    const handleTranscription = (event: any) => {
      setTranscription(event.detail.text)
    }

    window.addEventListener("whisperTranscription", handleTranscription)

    return () => {
      window.removeEventListener("whisperTranscription", handleTranscription)
    }
  }, [])

  const startRecording = async () => {
    if (whisper) {
      try {
        await whisper.startRecording()
        setIsRecording(true)
      } catch (err) {
        setError("Failed to start recording")
      }
    }
  }

  const stopRecording = () => {
    if (whisper) {
      whisper.stopRecording()
      setIsRecording(false)
    }
  }

  return {
    whisper,
    isRecording,
    transcription,
    isLoading,
    error,
    startRecording,
    stopRecording,
  }
}
