import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/cqrs"

export async function GET() {
  try {
    const rides = await executeQuery({
      type: "GetRideShares",
    })

    return NextResponse.json(rides)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch ride shares" }, { status: 500 })
  }
}
