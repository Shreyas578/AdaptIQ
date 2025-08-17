"use client"

import Navigation from "@/components/navigation"
import SignLanguageDictionary from "@/components/sign-language-dictionary"

export default function DictionaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation currentPath="/dictionary" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Sign Language Dictionary</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Learn and practice sign language with our interactive dictionary. Search for words, watch demonstrations,
            and build your vocabulary.
          </p>
        </div>

        <SignLanguageDictionary />
      </main>
    </div>
  )
}
