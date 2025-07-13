import { type NextRequest, NextResponse } from "next/server"
import { createRideShare } from "@/lib/actions/rides"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Basic validation, expand as needed
    if (
      !data.userId ||
      !data.trailId ||
      !data.date ||
      !data.departureTime ||
      !data.departureLocation ||
      data.availableSpots === undefined
    ) {
      return NextResponse.json({ error: "Missing required ride share fields" }, { status: 400 })
    }
    await createRideShare(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating ride share:", error)
    return NextResponse.json({ error: "Failed to create ride share" }, { status: 500 })
  }
}
