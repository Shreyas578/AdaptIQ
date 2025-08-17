"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Hand, Play, BookOpen, Star, Volume2 } from "lucide-react"

interface DictionaryEntry {
  word: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  description: string
  videoUrl?: string
  relatedWords: string[]
  isFavorite?: boolean
}

const sampleDictionary: DictionaryEntry[] = [
  {
    word: "Hello",
    category: "greetings",
    difficulty: "beginner",
    description: "A common greeting used to say hi to someone",
    relatedWords: ["Hi", "Good morning", "Welcome"],
  },
  {
    word: "Thank you",
    category: "politeness",
    difficulty: "beginner",
    description: "Express gratitude or appreciation",
    relatedWords: ["Thanks", "Grateful", "Appreciate"],
  },
  {
    word: "Learn",
    category: "education",
    difficulty: "intermediate",
    description: "To gain knowledge or skill through study or experience",
    relatedWords: ["Study", "Practice", "Understand"],
  },
  {
    word: "Friend",
    category: "relationships",
    difficulty: "beginner",
    description: "A person you like and know well",
    relatedWords: ["Buddy", "Pal", "Companion"],
  },
  {
    word: "Happy",
    category: "emotions",
    difficulty: "beginner",
    description: "Feeling joy or pleasure",
    relatedWords: ["Joy", "Excited", "Cheerful"],
  },
  {
    word: "Mathematics",
    category: "subjects",
    difficulty: "advanced",
    description: "The study of numbers, shapes, and patterns",
    relatedWords: ["Math", "Numbers", "Calculate"],
  },
]

const categories = [
  { id: "all", label: "All Categories", icon: BookOpen },
  { id: "greetings", label: "Greetings", icon: Hand },
  { id: "emotions", label: "Emotions", icon: Star },
  { id: "education", label: "Education", icon: BookOpen },
  { id: "subjects", label: "School Subjects", icon: BookOpen },
  { id: "politeness", label: "Politeness", icon: Hand },
  { id: "relationships", label: "Relationships", icon: Hand },
]

export default function SignLanguageDictionary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  const filteredEntries = sampleDictionary.filter((entry) => {
    const matchesSearch =
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || entry.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const favoriteEntries = sampleDictionary.filter((entry) => favorites.includes(entry.word))

  const toggleFavorite = (word: string) => {
    setFavorites((prev) => (prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderDictionaryEntry = (entry: DictionaryEntry) => (
    <Card key={entry.word} className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-display text-lg font-semibold">{entry.word}</h3>
              <Badge variant="secondary" className={getDifficultyColor(entry.difficulty)}>
                {entry.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(entry.word)}
            className={favorites.includes(entry.word) ? "text-yellow-500" : "text-gray-400"}
          >
            <Star className={`h-4 w-4 ${favorites.includes(entry.word) ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Sign Language Video Placeholder */}
        <div className="bg-gray-100 rounded-lg p-6 mb-3 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Hand className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">Sign for "{entry.word}"</span>
            <Button size="sm" variant="outline">
              <Play className="h-3 w-3 mr-1" />
              Watch Sign
            </Button>
          </div>
        </div>

        {/* Related Words */}
        {entry.relatedWords.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Related Words:</span>
            <div className="flex flex-wrap gap-1">
              {entry.relatedWords.map((word) => (
                <Badge key={word} variant="outline" className="text-xs">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <Button variant="outline" size="sm">
            <Volume2 className="h-3 w-3 mr-1" />
            Pronounce
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="h-3 w-3 mr-1" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hand className="h-6 w-6 text-primary" />
            <span>Sign Language Dictionary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for words or meanings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dictionary Content */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Dictionary</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites ({favorites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntries.map(renderDictionaryEntry)}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No words found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favoriteEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteEntries.map(renderDictionaryEntry)}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">Star words you want to remember and practice</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
