import { TrailDetail } from "@/components/trail-detail"
import { notFound } from "next/navigation"

interface TrailPageProps {
  params: {
    id: string
  }
}

async function getTrail(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trails/${id}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export default async function TrailPage({ params }: TrailPageProps) {
  const trail = await getTrail(params.id)
  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  if (!trail) {
    notFound()
  }

  return <TrailDetail trail={trail} mapboxAccessToken={mapboxAccessToken} />
}
