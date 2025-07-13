import { ForumThreadList } from "@/components/forum-thread-list"

async function getForumThreads() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forum`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch forum threads")
  }

  return response.json()
}

export default async function ForumPage() {
  const threads = await getForumThreads()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <p className="text-muted-foreground">Discuss trails, conditions, and share experiences</p>
      </div>

      <ForumThreadList threads={threads} />
    </div>
  )
}
