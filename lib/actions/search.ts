"server-only"

import { executeQuery } from "@/lib/cqrs"
// No revalidatePath used here, but keeping "server-only" for consistency
// and to ensure it's not bundled client-side if it were to import other server-only modules.

export async function searchTrails(query: string) {
  return executeQuery({
    type: "SearchTrails",
    query,
    limit: 20,
  })
}
