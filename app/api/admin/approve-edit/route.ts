import { type NextRequest, NextResponse } from "next/server"
import { approveEdit } from "@/lib/actions/admin"

export async function POST(request: NextRequest) {
  try {
    const { editId, adminId } = await request.json()
    if (!editId || !adminId) {
      return NextResponse.json({ error: "editId and adminId are required" }, { status: 400 })
    }
    await approveEdit(editId, adminId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error approving edit:", error)
    return NextResponse.json({ error: "Failed to approve edit" }, { status: 500 })
  }
}
