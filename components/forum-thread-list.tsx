"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, User, Calendar, Plus } from "lucide-react"
import { CreateForumThreadForm } from "@/components/create-forum-thread-form"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ForumThreadPlaceholder } from "@/components/forum-thread-placeholder"

interface ForumThread {
  id: string
  title: string
  category: string
  user_name: string
  post_count: number
  created_at: string
  updated_at: string
}

interface ForumThreadListProps {
  threads: ForumThread[] // Initial threads from server
}

const categories = [
  "All Categories",
  "General Discussion",
  "Trail Conditions",
  "Route Planning",
  "Gear Reviews",
  "Trip Reports",
  "Safety & Weather",
  "Photography",
  "Beginner Questions",
]

export function ForumThreadList({ threads: initialThreads }: ForumThreadListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { isAuthenticated } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [displayedThreads, setDisplayedThreads] = useState<ForumThread[]>(initialThreads)
  const [loadingThreads, setLoadingThreads] = useState(false)

  const fetchThreads = useCallback(async () => {
    setLoadingThreads(true)
    try {
      const queryParams = selectedCategory !== "All Categories" ? `?category=${selectedCategory}` : ""
      const response = await fetch(`/api/forum${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch forum threads")
      }
      const data = await response.json()
      setDisplayedThreads(data)
    } catch (error) {
      console.error("Error fetching forum threads:", error)
      setDisplayedThreads([]) // Clear threads on error
    } finally {
      setLoadingThreads(false)
    }
  }, [selectedCategory])

  // Effect to fetch threads when category changes
  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  const handleThreadCreated = () => {
    setShowCreateForm(false)
    fetchThreads() // Re-fetch threads after a new one is created
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Discussion Threads</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAuthenticated && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          )}
        </div>
      </div>

      {loadingThreads || displayedThreads.length === 0 ? ( // Show placeholder if loading OR no threads
        <ForumThreadPlaceholder />
      ) : (
        <div className="space-y-4">
          {displayedThreads.map((thread) => (
            <Card key={thread.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">
                      <Link href={`/forum/${thread.id}`} className="hover:text-primary transition-colors">
                        {thread.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {thread.user_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(thread.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {thread.post_count} posts
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{thread.category}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {showCreateForm && <CreateForumThreadForm onClose={handleThreadCreated} />}
    </div>
  )
}
