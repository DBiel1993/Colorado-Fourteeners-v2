"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, User, Calendar, Plus } from "lucide-react"
import { CreateForumThreadForm } from "@/components/create-forum-thread-form"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

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
  threads: ForumThread[]
}

export function ForumThreadList({ threads }: ForumThreadListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Discussion Threads</h2>
        {isAuthenticated && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        )}
      </div>

      {threads.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No forum threads yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
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

      {showCreateForm && <CreateForumThreadForm onClose={() => setShowCreateForm(false)} />}
    </div>
  )
}
