import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/cqrs"

export async function GET() {
  try {
    const trails = await executeQuery({
      type: "GetTrails",
      sort: "name",
    })

    return NextResponse.json(trails)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch trails" }, { status: 500 })
  }
}
