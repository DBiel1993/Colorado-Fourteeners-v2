"server-only"

import { executeCommand, executeQuery } from "@/lib/cqrs"
import { revalidatePath } from "next/cache" // Direct import again

export async function getTrails(filters?: any) {
  return executeQuery({
    type: "GetTrails",
    filters,
    sort: "name",
  })
}

export async function getTrail(id: string) {
  return executeQuery({
    type: "GetTrailById",
    id,
  })
}

export async function suggestTrailEdit(
  trailId: string,
  userId: string,
  fieldName: string,
  oldValue: string,
  newValue: string,
  reason: string,
) {
  await executeCommand({
    type: "SuggestTrailEdit",
    trailId,
    userId,
    fieldName,
    oldValue,
    newValue,
    reason,
  })

  revalidatePath("/admin/edits")
}
