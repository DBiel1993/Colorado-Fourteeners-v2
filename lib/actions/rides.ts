"server-only"

import { executeCommand, executeQuery } from "@/lib/cqrs"
import { revalidatePath } from "next/cache" // Direct import again

export async function getRideShares(filters?: any) {
  return executeQuery({
    type: "GetRideShares",
    ...filters,
  })
}

export async function createRideShare(data: {
  userId: string
  trailId: string
  date: string
  departureTime: string
  departureLocation: string
  availableSpots: number
  description: string
}) {
  await executeCommand({
    type: "CreateRideShare",
    ...data,
  })

  revalidatePath("/rides")
}
