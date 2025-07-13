"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Removed direct import of createRideShare
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { Trail } from "@/lib/database"

interface CreateRideShareFormProps {
  onClose: () => void
}

export function CreateRideShareForm({ onClose }: CreateRideShareFormProps) {
  const [trails, setTrails] = useState<Trail[]>([])
  const [formData, setFormData] = useState({
    trailId: "",
    date: "",
    departureTime: "",
    departureLocation: "",
    availableSpots: 1,
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadTrails = async () => {
      try {
        const response = await fetch("/api/trails")
        if (response.ok) {
          const trailData = await response.json()
          setTrails(trailData)
        }
      } catch (error) {
        console.error("Failed to load trails:", error)
      }
    }
    loadTrails()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a ride share.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create ride share")
      }

      toast({
        title: "Ride Share Created",
        description: "Your ride share has been posted successfully.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ride share.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Ride Share</CardTitle>
        <CardDescription>Share transportation costs and find hiking partners</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="trail">Trail</Label>
            <Select
              value={formData.trailId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, trailId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a trail" />
              </SelectTrigger>
              <SelectContent>
                {trails.map((trail) => (
                  <SelectItem key={trail.id} value={trail.id}>
                    {trail.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Departure Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, departureTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Departure Location</Label>
            <Input
              id="location"
              value={formData.departureLocation}
              onChange={(e) => setFormData((prev) => ({ ...prev, departureLocation: e.target.value }))}
              placeholder="e.g., Denver Union Station"
              required
            />
          </div>

          <div>
            <Label htmlFor="spots">Available Spots</Label>
            <Input
              id="spots"
              type="number"
              min="1"
              max="8"
              value={formData.availableSpots}
              onChange={(e) => setFormData((prev) => ({ ...prev, availableSpots: Number.parseInt(e.target.value) }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about the trip..."
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Ride Share"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
