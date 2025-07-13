import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/cqrs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trail = await executeQuery({
      type: "GetTrailById",
      id: params.id,
    })

    if (!trail) {
      return NextResponse.json({ error: "Trail not found" }, { status: 404 })
    }

    return NextResponse.json(trail)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch trail" }, { status: 500 })
  }
}
