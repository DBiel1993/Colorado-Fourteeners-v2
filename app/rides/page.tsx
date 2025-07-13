import { RideShareList } from "@/components/ride-share-list"

async function getRideShares() {
  try {
    const response = await fetch("/api/rides", {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Failed to fetch ride shares: ${response.status} ${response.statusText}`)
      return []
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching ride shares:", error)
    return []
  }
}

export default async function RidesPage() {
  const rides = await getRideShares()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ride Shares</h1>
          <p className="text-muted-foreground">Find hiking partners and share transportation costs</p>
        </div>
      </div>

      <RideShareList rides={rides} />
    </div>
  )
}
