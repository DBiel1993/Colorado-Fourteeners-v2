import { TrailMap } from "@/components/trail-map"
import { TrailList } from "@/components/trail-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FeaturedTrailPlaceholder } from "@/components/featured-trail-placeholder" // New import

async function getTrails() {
  try {
    const response = await fetch("/api/trails", {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Failed to fetch trails: ${response.status} ${response.statusText}`)
      return []
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching trails:", error)
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

  // For demonstration, let's pick a few "featured" trails
  // If no trails are fetched, featuredTrails will be empty, triggering the placeholder
  const featuredTrails = trails.slice(0, 3)

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

          <TabsContent value="list" className="mt-6 space-y-8">
            {/* Featured Trails Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Featured Trails</h2>
                <Button variant="ghost" asChild>
                  <Link href="/trails">View All</Link>
                </Button>
              </div>
              <p className="text-muted-foreground">Discover some of the most popular and recommended routes.</p>
              {featuredTrails.length > 0 ? (
                <TrailList trails={featuredTrails} />
              ) : (
                <FeaturedTrailPlaceholder /> // Display placeholders if no featured trails
              )}
            </section>

            {/* All Trails Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">All Trails</h2>
              <p className="text-muted-foreground">A complete list of all Colorado 14ers.</p>
              {trails.length > 0 ? (
                <TrailList trails={trails} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No trails available.</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}
