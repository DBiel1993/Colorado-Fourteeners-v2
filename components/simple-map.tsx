"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Mountain, ExternalLink } from "lucide-react"
import type { Trail } from "@/lib/database"
import Link from "next/link"

interface SimpleMapProps {
  trails: Trail[]
  title?: string
}

export function SimpleMap({ trails, title = "Trail Locations" }: SimpleMapProps) {
  const centerLat = trails.reduce((sum, trail) => sum + trail.location.lat, 0) / trails.length
  const centerLng = trails.reduce((sum, trail) => sum + trail.location.lng, 0) / trails.length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Center coordinates: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {trails.map((trail) => (
            <div
              key={trail.id}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Mountain className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{trail.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {trail.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {trail.elevation.toLocaleString()}ft • {trail.distance}mi
                </p>
                <p className="text-xs text-muted-foreground">
                  {trail.location.lat.toFixed(4)}, {trail.location.lng.toFixed(4)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Button asChild size="sm" variant="outline" className="h-8 px-2 bg-transparent">
                  <Link href={`/trails/${trail.id}`}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${trail.location.lat},${trail.location.lng}`
                    window.open(url, "_blank")
                  }}
                >
                  Maps
                </Button>
              </div>
            </div>
          ))}
        </div>

        {trails.length > 0 && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                const url = `https://www.google.com/maps?q=${centerLat},${centerLng}&z=8`
                window.open(url, "_blank")
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All on Google Maps
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
