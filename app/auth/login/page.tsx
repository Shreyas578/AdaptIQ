"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "@/lib/auth-actions"
import { useUserProfile } from "@/components/user-profile-provider"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium rounded-lg h-[60px] font-display"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useUserProfile()
  const [state, formAction] = useActionState(signIn, null)

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/")
    }
  }, [user, loading, router])

  // Handle successful login
  useEffect(() => {
    if (state?.success) {
      router.push("/")
    }
  }, [state, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 animate-pulse text-primary" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/images/adaptiq-logo.png" alt="AdaptIQ Logo" width={60} height={60} className="rounded-lg" />
          </div>
          <CardTitle className="font-display text-3xl font-bold text-primary">Welcome Back</CardTitle>
          <p className="text-muted-foreground">Sign in to continue your learning journey</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded text-center">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input id="password" name="password" type="password" required className="h-12 text-base" />
            </div>

            <SubmitButton />
          </form>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>

            <div className="text-xs text-muted-foreground">
              <p>Need help? Contact your teacher or parent for assistance.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
