"server-only"

import { executeCommand, executeQuery } from "@/lib/cqrs"
import { revalidatePath } from "next/cache" // Direct import again

export async function getPendingEdits() {
  return executeQuery({
    type: "GetPendingEdits",
    status: "pending",
  })
}

export async function approveEdit(editId: string, adminId: string) {
  await executeCommand({
    type: "ApproveEdit",
    editId,
    adminId,
  })

  revalidatePath("/trails")
  revalidatePath("/admin/edits")
}

export async function rejectEdit(editId: string) {
  const { pool } = await import("@/lib/database")
  const client = await pool.connect()
  try {
    await client.query(`UPDATE pending_edits SET status = 'rejected', updated_at = NOW() WHERE id = $1`, [editId])
    revalidatePath("/admin/edits")
  } finally {
    client.release()
  }
}
