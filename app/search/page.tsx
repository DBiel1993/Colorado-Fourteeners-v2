"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Sparkles } from "lucide-react"
import { TrailList } from "@/components/trail-list"
import type { Trail } from "@/lib/database"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Trail[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const searchResults = await response.json()
      setResults(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
          AI Trail Search
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Use natural language to find the perfect trail. Try queries like "easy hikes near Denver" or "challenging
          peaks with great views"
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Search Trails</CardTitle>
          <CardDescription className="text-sm">
            Describe what kind of hiking experience you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., moderate difficulty peaks under 10 miles"
              className="flex-1 text-base sm:text-sm"
            />
            <Button type="submit" disabled={loading} className="w-full sm:w-auto touch-manipulation">
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Search Results</h2>
          <TrailList trails={results} />
        </div>
      )}
    </div>
  )
}
