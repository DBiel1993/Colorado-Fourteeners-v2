import { getPendingEdits } from "@/lib/actions/admin"
import { PendingEditsList } from "@/components/pending-edits-list"
import { ProtectedRoute } from "@/components/protected-route"

export default async function AdminEditsPage() {
  const pendingEdits = await getPendingEdits()

  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pending Edits</h1>
          <p className="text-muted-foreground">Review and approve trail edit suggestions from the community</p>
        </div>

        <PendingEditsList edits={pendingEdits} />
      </div>
    </ProtectedRoute>
  )
}
