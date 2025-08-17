"use client"

import { useState, useCallback } from "react"

// ElevenLabs Text-to-Speech integration
export class ElevenLabsTTS {
  private apiKey: string | null = null
  private baseUrl = "https://api.elevenlabs.io/v1"

  constructor() {
    // In production, this should come from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || null
  }

  public async synthesizeSpeech(
    text: string,
    voiceId = "pNInz6obpgDQGcFmaJgB", // Default voice
    options: {
      stability?: number
      similarity_boost?: number
      style?: number
      use_speaker_boost?: boolean
    } = {},
  ): Promise<ArrayBuffer> {
    if (!this.apiKey) {
      throw new Error("ElevenLabs API key not configured")
    }

    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": this.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarity_boost || 0.5,
          style: options.style || 0.0,
          use_speaker_boost: options.use_speaker_boost || true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    return await response.arrayBuffer()
  }

  public async getVoices(): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error("ElevenLabs API key not configured")
    }

    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        "xi-api-key": this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`)
    }

    const data = await response.json()
    return data.voices
  }

  public playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      audioContext
        .decodeAudioData(audioBuffer)
        .then((decodedData) => {
          const source = audioContext.createBufferSource()
          source.buffer = decodedData
          source.connect(audioContext.destination)

          source.onended = () => resolve()
          source.start()
        })
        .catch(reject)
    })
  }
}

export function useElevenLabsTTS() {
  const [tts] = useState(() => new ElevenLabsTTS())
  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const speak = useCallback(
    async (text: string, voiceId?: string, options?: any) => {
      if (isPlaying) return

      setIsLoading(true)
      setError(null)

      try {
        const audioBuffer = await tts.synthesizeSpeech(text, voiceId, options)
        setIsPlaying(true)
        await tts.playAudio(audioBuffer)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Speech synthesis failed")
        console.error("[v0] ElevenLabs TTS error:", err)
      } finally {
        setIsPlaying(false)
        setIsLoading(false)
      }
    },
    [tts, isPlaying],
  )

  const loadVoices = useCallback(async () => {
    try {
      const voiceList = await tts.getVoices()
      setVoices(voiceList)
    } catch (err) {
      console.error("[v0] Failed to load voices:", err)
    }
  }, [tts])

  return {
    speak,
    loadVoices,
    voices,
    isPlaying,
    isLoading,
    error,
  }
}
