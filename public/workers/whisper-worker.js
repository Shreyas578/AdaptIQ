// Whisper Web Worker for local speech recognition
importScripts("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0/dist/transformers.min.js")

const Transformers = self.Transformers

class WhisperWorker {
  constructor() {
    this.model = null
    this.processor = null
    this.isInitialized = false
  }

  async initialize(modelName = "Xenova/whisper-tiny") {
    try {
      console.log("[v0] Initializing Whisper model...")

      const { pipeline } = Transformers

      this.model = await pipeline("automatic-speech-recognition", modelName, {
        revision: "main",
        quantized: false,
      })

      this.isInitialized = true

      self.postMessage({
        type: "initialized",
        data: { modelName },
      })

      console.log("[v0] Whisper model initialized successfully")
    } catch (error) {
      console.error("[v0] Whisper initialization error:", error)
      self.postMessage({
        type: "error",
        data: { message: error.message },
      })
    }
  }

  async transcribe(audioBuffer) {
    if (!this.isInitialized || !this.model) {
      throw new Error("Whisper model not initialized")
    }

    try {
      // Convert audio buffer to the format expected by Whisper
      const audioArray = new Float32Array(audioBuffer)

      const result = await this.model(audioArray, {
        language: "english",
        task: "transcribe",
        return_timestamps: true,
      })

      self.postMessage({
        type: "transcription",
        data: {
          text: result.text,
          confidence: 0.9, // Whisper doesn't provide confidence scores directly
          chunks: result.chunks || [],
        },
      })
    } catch (error) {
      console.error("[v0] Transcription error:", error)
      self.postMessage({
        type: "error",
        data: { message: error.message },
      })
    }
  }
}

const whisperWorker = new WhisperWorker()

self.onmessage = async (event) => {
  const { type, model, audio } = event.data

  switch (type) {
    case "initialize":
      await whisperWorker.initialize(model)
      break
    case "transcribe":
      await whisperWorker.transcribe(audio)
      break
    default:
      console.warn("[v0] Unknown message type:", type)
  }
}
