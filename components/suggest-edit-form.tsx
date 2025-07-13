"use client"

import type React from "react"

import { useState } from "react"
import type { Trail } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Removed direct import of suggestTrailEdit
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface SuggestEditFormProps {
  trail: Trail
  onClose: () => void
}

export function SuggestEditForm({ trail, onClose }: SuggestEditFormProps) {
  const [fieldName, setFieldName] = useState("")
  const [newValue, setNewValue] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to suggest an edit.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const oldValue = getFieldValue(trail, fieldName)
      const response = await fetch("/api/trails/suggest-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trailId: trail.id,
          userId: user.id,
          fieldName,
          oldValue,
          newValue,
          reason,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit edit suggestion")
      }

      toast({
        title: "Edit Suggested",
        description: "Your edit suggestion has been submitted for review.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit edit suggestion.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggest Edit for {trail.name}</CardTitle>
        <CardDescription>Help improve trail information by suggesting corrections or updates</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="field">Field to Edit</Label>
            <Select value={fieldName} onValueChange={setFieldName}>
              <SelectTrigger>
                <SelectValue placeholder="Select field to edit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="elevation">Elevation</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="description">Description</SelectItem>
                <SelectItem value="route_description">Route Description</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="current">Current Value</Label>
            <Input id="current" value={getFieldValue(trail, fieldName)} disabled className="bg-muted" />
          </div>

          <div>
            <Label htmlFor="new">New Value</Label>
            <Input
              id="new"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter new value"
              required
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason for Change</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this change is needed"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !fieldName}>
              {loading ? "Submitting..." : "Submit Edit"}
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

function getFieldValue(trail: Trail, fieldName: string): string {
  switch (fieldName) {
    case "name":
      return trail.name
    case "elevation":
      return trail.elevation.toString()
    case "difficulty":
      return trail.difficulty
    case "distance":
      return trail.distance.toString()
    case "description":
      return trail.description
    case "route_description":
      return trail.route_description
    default:
      return ""
  }
}
