"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Removed direct import of createGearShare
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface CreateGearShareFormProps {
  onClose: () => void
}

const categories = [
  "Backpacks",
  "Tents",
  "Sleeping Bags",
  "Sleeping Pads",
  "Stoves",
  "Water Filters",
  "Trekking Poles",
  "Crampons",
  "Ice Axes",
  "Helmets",
  "Other",
]

const conditions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
]

export function CreateGearShareForm({ onClose }: CreateGearShareFormProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    condition: "",
    pricePerDay: 0,
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to share gear.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/gear/create", {
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
        throw new Error("Failed to create gear share")
      }

      toast({
        title: "Gear Share Created",
        description: "Your gear is now available for sharing.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create gear share.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Gear</CardTitle>
        <CardDescription>Rent out your hiking gear to fellow adventurers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => setFormData((prev) => ({ ...prev, itemName: e.target.value }))}
              placeholder="e.g., REI Co-op Flash 55 Backpack"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price per Day ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerDay}
              onChange={(e) => setFormData((prev) => ({ ...prev, pricePerDay: Number.parseFloat(e.target.value) }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the item, its features, and any usage notes..."
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Share Gear"}
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
