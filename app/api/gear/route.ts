import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/cqrs"

export async function GET() {
  try {
    const gear = await executeQuery({
      type: "GetGearShares",
      available: true,
    })

    return NextResponse.json(gear)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch gear shares" }, { status: 500 })
  }
}
