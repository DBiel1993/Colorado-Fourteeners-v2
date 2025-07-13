"server-only"

import { executeCommand, executeQuery } from "@/lib/cqrs"
import { revalidatePath } from "next/cache" // Direct import again

export async function getForumThreads(filters?: any) {
  return executeQuery({
    type: "GetForumThreads",
    ...filters,
  })
}

export async function createForumThread(data: {
  userId: string
  title: string
  category: string
  content: string
}) {
  await executeCommand({
    type: "CreateForumThread",
    ...data,
  })

  revalidatePath("/forum")
}
