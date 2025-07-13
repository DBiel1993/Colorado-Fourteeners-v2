import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, User, Calendar } from "lucide-react"

export function ForumThreadPlaceholder() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 w-full">
                <CardTitle className="text-lg">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="h-6 w-24 bg-muted"></Badge>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
