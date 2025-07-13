import { GearShareList } from "@/components/gear-share-list"

async function getGearShares() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/gear`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch gear shares")
  }

  return response.json()
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
