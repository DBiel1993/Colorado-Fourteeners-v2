import { type NextRequest, NextResponse } from "next/server"
import { createGearShare } from "@/lib/actions/gear"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Basic validation, expand as needed
    if (!data.userId || !data.itemName || !data.category || !data.condition || data.pricePerDay === undefined) {
      return NextResponse.json({ error: "Missing required gear share fields" }, { status: 400 })
    }
    await createGearShare(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating gear share:", error)
    return NextResponse.json({ error: "Failed to create gear share" }, { status: 500 })
  }
}
