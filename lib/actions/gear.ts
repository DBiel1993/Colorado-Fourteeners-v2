"server-only"

import { executeCommand, executeQuery } from "@/lib/cqrs"
import { revalidatePath } from "next/cache" // Direct import again

export async function getGearShares(filters?: any) {
  return executeQuery({
    type: "GetGearShares",
    available: true,
    ...filters,
  })
}

export async function createGearShare(data: {
  userId: string
  itemName: string
  description: string
  category: string
  condition: string
  pricePerDay: number
}) {
  await executeCommand({
    type: "CreateGearShare",
    ...data,
  })

  revalidatePath("/gear")
}
