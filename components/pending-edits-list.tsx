"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, X, User, Calendar } from "lucide-react"
// Removed direct import of approveEdit, rejectEdit
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider" // Import useAuth to get adminId

interface PendingEdit {
  id: string
  trail_id: string
  trail_name: string
  user_name: string
  field_name: string
  old_value: string
  new_value: string
  reason: string
  created_at: string
}

interface PendingEditsListProps {
  edits: PendingEdit[]
}

export function PendingEditsList({ edits }: PendingEditsListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth() // Get user for adminId

  const handleApprove = async (editId: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You must be an admin to approve edits.",
        variant: "destructive",
      })
      return
    }

    setLoading(editId)
    try {
      const response = await fetch("/api/admin/approve-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editId, adminId: user.id }), // Pass adminId
      })

      if (!response.ok) {
        throw new Error("Failed to approve edit")
      }

      toast({
        title: "Edit Approved",
        description: "The edit has been approved and applied.",
      })
      // Optionally re-fetch edits or update state to reflect change
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve edit.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (editId: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You must be an admin to reject edits.",
        variant: "destructive",
      })
      return
    }

    setLoading(editId)
    try {
      const response = await fetch("/api/admin/reject-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editId }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject edit")
      }

      toast({
        title: "Edit Rejected",
        description: "The edit has been rejected.",
      })
      // Optionally re-fetch edits or update state to reflect change
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject edit.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  if (edits.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No pending edits to review</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {edits.map((edit) => (
        <Card key={edit.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{edit.trail_name}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {edit.user_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(edit.created_at).toLocaleDateString()}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="outline">{edit.field_name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Current Value</h4>
                <p className="text-sm bg-muted p-2 rounded">{edit.old_value}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Proposed Value</h4>
                <p className="text-sm bg-green-50 p-2 rounded border border-green-200">{edit.new_value}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">Reason</h4>
              <p className="text-sm text-muted-foreground">{edit.reason}</p>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button onClick={() => handleApprove(edit.id)} disabled={loading === edit.id} size="sm">
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(edit.id)}
                disabled={loading === edit.id}
                variant="destructive"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
