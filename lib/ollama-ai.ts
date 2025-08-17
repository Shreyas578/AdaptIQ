"use client"

import { useState, useCallback } from "react"

// Ollama AI integration for content processing
export class OllamaAI {
  private baseUrl: string
  private model: string

  constructor(baseUrl = "http://localhost:11434", model = "gemma:2b") {
    this.baseUrl = baseUrl
    this.model = model
  }

  public async generateResponse(
    prompt: string,
    options: {
      temperature?: number
      max_tokens?: number
      system?: string
    } = {},
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          system: options.system || "",
          options: {
            temperature: options.temperature || 0.7,
            num_predict: options.max_tokens || 500,
          },
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("[v0] Ollama AI error:", error)
      throw error
    }
  }

  public async simplifyContent(content: string, disabilityType: string, ageGroup: string): Promise<string> {
    const systemPrompt = `You are an AI assistant specialized in making educational content accessible for children with disabilities. 
    Simplify the following content for a ${ageGroup} year old child with ${disabilityType}.
    
    Guidelines:
    - Use simple, clear language
    - Break down complex concepts into smaller parts
    - Add visual descriptions where helpful
    - Make it engaging and age-appropriate
    - Ensure the core learning objectives are maintained`

    return await this.generateResponse(content, {
      system: systemPrompt,
      temperature: 0.3,
    })
  }

  public async generateAlternativeExplanation(
    concept: string,
    currentExplanation: string,
    learningStyle: string,
  ): Promise<string> {
    const prompt = `Current explanation: "${currentExplanation}"
    
    Generate an alternative explanation of "${concept}" that caters to ${learningStyle} learning style.
    Make it more engaging and easier to understand.`

    return await this.generateResponse(prompt, {
      temperature: 0.5,
    })
  }
}

export function useOllamaAI() {
  const [ai] = useState(() => new OllamaAI())
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const simplifyContent = useCallback(
    async (content: string, disabilityType: string, ageGroup: string) => {
      setIsProcessing(true)
      setError(null)

      try {
        const simplified = await ai.simplifyContent(content, disabilityType, ageGroup)
        return simplified
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Content simplification failed"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [ai],
  )

  const generateAlternative = useCallback(
    async (concept: string, currentExplanation: string, learningStyle: string) => {
      setIsProcessing(true)
      setError(null)

      try {
        const alternative = await ai.generateAlternativeExplanation(concept, currentExplanation, learningStyle)
        return alternative
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Alternative generation failed"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [ai],
  )

  return {
    simplifyContent,
    generateAlternative,
    isProcessing,
    error,
  }
}
