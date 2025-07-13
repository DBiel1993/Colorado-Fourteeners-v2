import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RideSharePlaceholder() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg leading-tight">
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardTitle>
            <CardDescription className="text-sm">
              <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <Badge variant="secondary" className="h-6 w-24 bg-muted"></Badge>
            </div>
            <div className="h-12 bg-muted rounded"></div>
            <Button className="w-full" size="sm" disabled>
              Contact Driver
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
