import type React from "react"
import type { Metadata } from "next"
import { Inter, Fredoka } from "next/font/google"
import "./globals.css"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { UserProfileProvider } from "@/components/user-profile-provider"
import AccessibilityPanel from "@/components/accessibility-panel"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "AdaptIQ - AI-Powered Learning for Every Child",
  description: "Inclusive educational platform designed for children with disabilities",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable} antialiased`}>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <UserProfileProvider>
          <AccessibilityProvider>
            {children}
            <AccessibilityPanel />
          </AccessibilityProvider>
        </UserProfileProvider>
      </body>
    </html>
  )
}
