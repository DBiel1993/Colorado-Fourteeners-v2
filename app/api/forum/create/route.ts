import { type NextRequest, NextResponse } from "next/server"
import { createForumThread } from "@/lib/actions/forum"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Basic validation, expand as needed
    if (!data.userId || !data.title || !data.category || !data.content) {
      return NextResponse.json({ error: "Missing required forum thread fields" }, { status: 400 })
    }
    await createForumThread(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating forum thread:", error)
    return NextResponse.json({ error: "Failed to create forum thread" }, { status: 500 })
  }
}
