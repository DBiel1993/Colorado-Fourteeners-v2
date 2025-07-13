import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GearSharePlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div className="h-5 bg-muted rounded w-3/4"></div>
            </CardTitle>
            <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="h-6 w-20 bg-muted"></Badge>
              <Badge variant="outline" className="h-6 w-16 bg-muted"></Badge>
            </div>

            <div className="flex items-center gap-2 text-lg font-semibold">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="h-6 bg-muted rounded w-24"></div>
            </div>

            <div className="h-12 bg-muted rounded"></div>

            <Button className="w-full" size="sm" disabled>
              Contact Owner
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
