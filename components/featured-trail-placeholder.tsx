import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mountain, MapPin, Ruler } from "lucide-react"

export function FeaturedTrailPlaceholder() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-2 text-lg leading-tight">
                  <Mountain className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <div className="h-4 bg-muted rounded w-12"></div>
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="h-6 w-16 bg-muted"></Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-16 bg-muted rounded mb-4"></div>
            <Button className="w-full" disabled>
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
