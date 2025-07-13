import { TrailMap } from "@/components/trail-map"
import { TrailList } from "@/components/trail-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"

async function getTrails() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trails`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch trails")
    }

    return response.json()
  } catch (error) {
    console.error("Failed to fetch trails:", error)
    return []
  }
}

function TrailsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 bg-muted rounded w-64 mb-2"></div>
        <div className="h-4 bg-muted rounded w-96"></div>
      </div>
      <div className="h-12 bg-muted rounded w-48"></div>
      <Card>
        <CardContent className="h-[500px] flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading trails...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function TrailsPage() {
  const trails = await getTrails()
  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Colorado Fourteeners</h1>
        <p className="text-muted-foreground">Explore all 58 peaks above 14,000 feet in Colorado</p>
      </div>

      <Suspense fallback={<TrailsLoading />}>
        <Tabs defaultValue="map" className="w-full">
          <TabsList>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            <TrailMap trails={trails} mapboxAccessToken={mapboxAccessToken} />
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <TrailList trails={trails} />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}
