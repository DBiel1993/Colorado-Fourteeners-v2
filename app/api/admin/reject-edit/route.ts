import { type NextRequest, NextResponse } from "next/server"
import { rejectEdit } from "@/lib/actions/admin"

export async function POST(request: NextRequest) {
  try {
    const { editId } = await request.json()
    if (!editId) {
      return NextResponse.json({ error: "editId is required" }, { status: 400 })
    }
    await rejectEdit(editId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error rejecting edit:", error)
    return NextResponse.json({ error: "Failed to reject edit" }, { status: 500 })
  }
}
