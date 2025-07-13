"use client"

import type { Trail } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mountain, MapPin, Ruler, Edit } from "lucide-react"
import { TrailMap } from "@/components/trail-map"
import { SimpleMap } from "@/components/simple-map"
import { SuggestEditForm } from "@/components/suggest-edit-form"
import { useState } from "react"

interface TrailDetailProps {
  trail: Trail
  mapboxAccessToken: string
}

export function TrailDetail({ trail, mapboxAccessToken }: TrailDetailProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [useSimpleMap, setUseSimpleMap] = useState(false)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 leading-tight">
            <Mountain className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <span className="break-words">{trail.name}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1 text-sm sm:text-base">
              <MapPin className="h-4 w-4" />
              {trail.elevation.toLocaleString()}ft
            </span>
            <span className="flex items-center gap-1 text-sm sm:text-base">
              <Ruler className="h-4 w-4" />
              {trail.distance} miles
            </span>
            <Badge variant={getDifficultyVariant(trail.difficulty)} className="text-xs">
              {trail.difficulty}
            </Badge>
          </div>
        </div>
        <Button onClick={() => setShowEditForm(true)} variant="outline" className="w-full sm:w-auto">
          <Edit className="h-4 w-4 mr-2" />
          Suggest Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Trail Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{trail.description}</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Route Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{trail.route_description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex gap-2 mb-4">
            <Button variant={!useSimpleMap ? "default" : "outline"} size="sm" onClick={() => setUseSimpleMap(false)}>
              Interactive Map
            </Button>
            <Button variant={useSimpleMap ? "default" : "outline"} size="sm" onClick={() => setUseSimpleMap(true)}>
              Simple View
            </Button>
          </div>

          {useSimpleMap ? (
            <SimpleMap trails={[trail]} title={`${trail.name} Location`} />
          ) : (
            <TrailMap trails={[trail]} mapboxAccessToken={mapboxAccessToken} />
          )}
        </div>
      </div>

      {showEditForm && <SuggestEditForm trail={trail} onClose={() => setShowEditForm(false)} />}
    </div>
  )
}

function getDifficultyVariant(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "default"
    case "moderate":
      return "secondary"
    case "hard":
      return "destructive"
    case "expert":
      return "destructive"
    default:
      return "outline"
  }
}
