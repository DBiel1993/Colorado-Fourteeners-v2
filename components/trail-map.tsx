"use client"

import { useEffect, useRef, useState } from "react"
import type { Trail } from "@/lib/database"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, AlertCircle } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface TrailMapProps {
  trails: Trail[]
  mapboxAccessToken: string
}

export function TrailMap({ trails, mapboxAccessToken }: TrailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const initializeMap = async () => {
      try {
        // Check if Mapbox token is available
        if (!mapboxAccessToken) {
          setMapError("Mapbox access token not configured")
          setIsLoading(false)
          return
        }

        // Set access token
        mapboxgl.accessToken = mapboxAccessToken

        // Create map
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/outdoors-v12",
          center: [-106.0, 39.0],
          zoom: 7,
        })

        // Wait for map to load
        map.current.on("load", () => {
          setIsLoading(false)

          // Add markers for trails
          trails.forEach((trail) => {
            if (map.current) {
              const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: false,
                maxWidth: "280px",
              }).setHTML(`
                <div class="p-3">
                  <h3 class="font-semibold text-base mb-1">${trail.name}</h3>
                  <p class="text-sm text-gray-600 mb-1">${trail.elevation.toLocaleString()}ft</p>
                  <p class="text-sm mb-2 capitalize">${trail.difficulty}</p>
                  <a href="/trails/${trail.id}" class="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">View Details</a>
                </div>
              `)

              new mapboxgl.Marker({
                color: getDifficultyColor(trail.difficulty),
              })
                .setLngLat([trail.location.lng, trail.location.lat])
                .setPopup(popup)
                .addTo(map.current)
            }
          })
        })

        map.current.on("error", (e: any) => {
          console.error("Mapbox error:", e)
          setMapError("Failed to load map")
          setIsLoading(false)
        })
      } catch (error) {
        console.error("Failed to initialize map:", error)
        setMapError("Map service unavailable")
        setIsLoading(false)
      }
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [trails, mapboxAccessToken])

  if (mapError) {
    return <MapFallback trails={trails} error={mapError} />
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading map...</span>
          </div>
        </div>
      )}
      <div
        ref={mapContainer}
        className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border touch-manipulation"
      />
    </div>
  )
}

function MapFallback({ trails, error }: { trails: Trail[]; error: string }) {
  return (
    <Card className="w-full h-[400px] sm:h-[500px] lg:h-[600px]">
      <CardContent className="h-full flex flex-col items-center justify-center p-6">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center">{error}</p>

        <div className="w-full max-w-md space-y-3 max-h-60 overflow-y-auto">
          <h4 className="font-medium text-center mb-3">Trail Locations:</h4>
          {trails.map((trail) => (
            <div key={trail.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{trail.name}</p>
                <p className="text-sm text-muted-foreground">
                  {trail.location.lat.toFixed(4)}, {trail.location.lng.toFixed(4)}
                </p>
              </div>
              <div className="text-xs px-2 py-1 bg-background rounded capitalize">{trail.difficulty}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "#22c55e"
    case "moderate":
      return "#eab308"
    case "hard":
      return "#f97316"
    case "expert":
      return "#ef4444"
    default:
      return "#6b7280"
  }
}
