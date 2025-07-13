import { type NextRequest, NextResponse } from "next/server"
import { suggestTrailEdit } from "@/lib/actions/trails"

export async function POST(request: NextRequest) {
  try {
    const { trailId, userId, fieldName, oldValue, newValue, reason } = await request.json()
    // Basic validation, expand as needed
    if (!trailId || !userId || !fieldName || !oldValue || !newValue || !reason) {
      return NextResponse.json({ error: "Missing required fields for edit suggestion" }, { status: 400 })
    }
    await suggestTrailEdit(trailId, userId, fieldName, oldValue, newValue, reason)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error suggesting trail edit:", error)
    return NextResponse.json({ error: "Failed to suggest trail edit" }, { status: 500 })
  }
}
