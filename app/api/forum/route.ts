import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/cqrs"

export async function GET() {
  try {
    const threads = await executeQuery({
      type: "GetForumThreads",
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch forum threads" }, { status: 500 })
  }
}
