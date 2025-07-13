import { RideShareList } from "@/components/ride-share-list"

async function getRideShares() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/rides`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch ride shares")
  }

  return response.json()
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
