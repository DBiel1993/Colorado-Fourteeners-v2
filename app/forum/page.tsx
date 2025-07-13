import { ForumThreadList } from "@/components/forum-thread-list"

async function getForumThreads() {
  try {
    const response = await fetch("/api/forum", {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Failed to fetch forum threads: ${response.status} ${response.statusText}`)
      return []
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching forum threads:", error)
    return []
  }
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
