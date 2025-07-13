import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/cqrs"

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category") // Get category from query params

    const threads = await executeQuery({
      type: "GetForumThreads",
      category: category === "All Categories" ? undefined : category, // Pass category or undefined
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch forum threads" }, { status: 500 })
  }
}
