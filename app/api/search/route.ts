import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/cqrs"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const trails = await executeQuery({
      type: "SearchTrails",
      query,
      limit: 20,
    })

    return NextResponse.json(trails)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
