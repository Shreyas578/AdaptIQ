"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/auth-helpers-nextjs"

interface UserProfile {
  id: string
  user_id: string
  full_name: string
  age: number
  disability_type: string[]
  learning_preferences: {
    visualLearner: boolean
    auditoryLearner: boolean
    kinestheticLearner: boolean
    preferredPace: "slow" | "normal" | "fast"
    attentionSpan: "short" | "medium" | "long"
    processingSpeed: "slow" | "normal" | "fast"
  }
  accessibility_settings: {
    textSize: string
    contrast: string
    audioEnabled: boolean
    signLanguage: boolean
    motorAssistance: boolean
  }
  created_at: string
  updated_at: string
}

interface UserProfileContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  createProfile: (profileData: Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>
  signOut: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const createProfile = async (profileData: Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("No user logged in")

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: user.id,
          ...profileData,
        })
        .select()
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      console.error("Error creating profile:", error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) throw new Error("No user or profile found")

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <UserProfileContext.Provider
      value={{
        user,
        profile,
        loading,
        updateProfile,
        createProfile,
        signOut,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
