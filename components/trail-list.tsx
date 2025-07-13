import type { Trail } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mountain, MapPin, Ruler } from "lucide-react"
import Link from "next/link"

interface TrailListProps {
  trails: Trail[]
}

export function TrailList({ trails }: TrailListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {trails.map((trail) => (
        <Card key={trail.id} className="hover:shadow-lg transition-shadow touch-manipulation">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-2 text-lg leading-tight">
                  <Mountain className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{trail.name}</span>
                </CardTitle>
                <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {trail.elevation.toLocaleString()}ft
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    {trail.distance}mi
                  </span>
                </CardDescription>
              </div>
              <Badge variant={getDifficultyVariant(trail.difficulty)} className="flex-shrink-0 text-xs">
                {trail.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{trail.description}</p>
            <Button asChild className="w-full touch-manipulation">
              <Link href={`/trails/${trail.id}`}>View Details</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
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
