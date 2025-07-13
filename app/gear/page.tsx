import { GearShareList } from "@/components/gear-share-list"

async function getGearShares() {
  try {
    const response = await fetch("/api/gear", {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Failed to fetch gear shares: ${response.status} ${response.statusText}`)
      // Return an empty array on non-OK response to allow build to proceed
      return []
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching gear shares:", error)
    // Return an empty array on network errors (TypeError: Failed to fetch)
    return []
  }
}

export default async function GearPage() {
  const gear = await getGearShares()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gear Shares</h1>
        <p className="text-muted-foreground">Rent or lend hiking gear within the community</p>
      </div>

      <GearShareList gear={gear} />
    </div>
  )
}
