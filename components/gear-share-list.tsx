"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, Plus } from "lucide-react"
import { CreateGearShareForm } from "@/components/create-gear-share-form"
import { useAuth } from "@/components/auth-provider"

interface GearShare {
  id: string
  user_name: string
  item_name: string
  description: string
  category: string
  condition: string
  price_per_day: number
}

interface GearShareListProps {
  gear: GearShare[]
}

export function GearShareList({ gear }: GearShareListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Available Gear</h2>
        {isAuthenticated && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Share Gear
          </Button>
        )}
      </div>

      {gear.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No gear available for sharing</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gear.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {item.item_name}
                </CardTitle>
                <CardDescription>by {item.user_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge variant={getConditionVariant(item.condition)}>{item.condition}</Badge>
                </div>

                <div className="flex items-center gap-2 text-lg font-semibold">
                  <DollarSign className="h-4 w-4" />${item.price_per_day}/day
                </div>

                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}

                <Button className="w-full" size="sm">
                  Contact Owner
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateForm && <CreateGearShareForm onClose={() => setShowCreateForm(false)} />}
    </div>
  )
}

function getConditionVariant(condition: string) {
  switch (condition) {
    case "excellent":
      return "default"
    case "good":
      return "secondary"
    case "fair":
      return "outline"
    case "poor":
      return "destructive"
    default:
      return "outline"
  }
}
