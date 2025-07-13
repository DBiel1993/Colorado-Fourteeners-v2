"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, Lock } from "lucide-react"
import { CreateRideShareForm } from "@/components/create-ride-share-form"
import { useAuth } from "@/components/auth-provider"
import { RideSharePlaceholder } from "@/components/ride-share-placeholder" // New import

interface RideShare {
  id: string
  trail_name: string
  user_name: string
  date: string
  departure_time: string
  departure_location: string
  available_spots: number
  description: string
}

interface RideShareListProps {
  rides: RideShare[]
}

const MAX_PREVIEW_ITEMS = 3

export function RideShareList({ rides }: RideShareListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { isAuthenticated, login } = useAuth()

  const displayedRides = isAuthenticated ? rides : rides.slice(0, MAX_PREVIEW_ITEMS)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Available Rides</h2>
        {isAuthenticated ? (
          <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Ride Share
          </Button>
        ) : (
          <Button onClick={login} className="w-full sm:w-auto bg-transparent" variant="outline">
            <Lock className="h-4 w-4 mr-2" />
            Sign In to Create
          </Button>
        )}
      </div>

      {displayedRides.length === 0 ? (
        <RideSharePlaceholder /> // Use placeholder when no rides are available
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedRides.map((ride) => (
            <Card key={ride.id} className="touch-manipulation">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{ride.trail_name}</CardTitle>
                <CardDescription className="text-sm">by {ride.user_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{new Date(ride.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{ride.departure_time}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{ride.departure_location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <Badge variant="secondary" className="text-xs">
                    {ride.available_spots} spots available
                  </Badge>
                </div>
                {ride.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{ride.description}</p>
                )}
                {isAuthenticated ? (
                  <Button className="w-full touch-manipulation" size="sm">
                    Contact Driver
                  </Button>
                ) : (
                  <Button
                    className="w-full touch-manipulation bg-transparent"
                    size="sm"
                    variant="outline"
                    onClick={login}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In to Contact
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isAuthenticated && rides.length > MAX_PREVIEW_ITEMS && (
        <Card className="text-center py-8">
          <CardHeader>
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Sign In to See More</CardTitle>
            <CardDescription>
              Create an account or sign in to view all available ride shares and connect with drivers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full max-w-xs">
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      {showCreateForm && <CreateRideShareForm onClose={() => setShowCreateForm(false)} />}
    </div>
  )
}
