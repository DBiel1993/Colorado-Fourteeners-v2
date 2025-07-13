import { TrailDetail } from "@/components/trail-detail"
import { notFound } from "next/navigation"

interface TrailPageProps {
  params: {
    id: string
  }
}

async function getTrail(id: string) {
  try {
    const response = await fetch(`/api/trails/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Failed to fetch trail ${id}: ${response.status} ${response.statusText}`)
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching trail ${id}:`, error)
    return null
  }
}

export default async function TrailPage({ params }: TrailPageProps) {
  const trail = await getTrail(params.id)
  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  if (!trail) {
    notFound()
  }

  return <TrailDetail trail={trail} mapboxAccessToken={mapboxAccessToken} />
}
