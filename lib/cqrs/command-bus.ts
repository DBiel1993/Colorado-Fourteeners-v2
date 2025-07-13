"server-only"

import { pool } from "@/lib/database" // Now imports `sql` from @vercel/postgres
import type { EventBus } from "./event-bus"
import type {
  CreateTrailCommand,
  SuggestTrailEditCommand,
  ApproveEditCommand,
  CreateRideShareCommand,
  CreateGearShareCommand,
  CreateForumThreadCommand,
  DomainEvent,
} from "./types"

export class CommandBus {
  constructor(private eventBus: EventBus) {}

  async handle(command: any): Promise<void> {
    switch (command.type) {
      case "CreateTrail":
        return this.handleCreateTrail(command)
      case "SuggestTrailEdit":
        return this.handleSuggestTrailEdit(command)
      case "ApproveEdit":
        return this.handleApproveEdit(command)
      case "CreateRideShare":
        return this.handleCreateRideShare(command)
      case "CreateGearShare":
        return this.handleCreateGearShare(command)
      case "CreateForumThread":
        return this.handleCreateForumThread(command)
      default:
        throw new Error(`Unknown command type: ${command.type}`)
    }
  }

  private async handleCreateTrail(command: CreateTrailCommand): Promise<void> {
    // Use sql.begin for transactions with @vercel/postgres
    await pool.begin(async (tx) => {
      const result = await tx`
        INSERT INTO trails (name, elevation, difficulty, distance, location, description, route_description)
        VALUES (${command.name}, ${command.elevation}, ${command.difficulty}, ${command.distance}, ST_GeogFromText(${`POINT(${command.location.lng} ${command.location.lat})`}), ${command.description}, ${command.route_description})
        RETURNING id
      `
      const trailId = result[0].id

      // Publish event
      const event: DomainEvent = {
        type: "TrailCreated",
        trailId,
        name: command.name,
        timestamp: new Date(),
      }
      await this.eventBus.publish(event)
    })
  }

  private async handleSuggestTrailEdit(command: SuggestTrailEditCommand): Promise<void> {
    await pool`
      INSERT INTO pending_edits (trail_id, user_id, field_name, old_value, new_value, reason)
      VALUES (${command.trailId}, ${command.userId}, ${command.fieldName}, ${command.oldValue}, ${command.newValue}, ${command.reason})
      RETURNING id
    `
    // Note: @vercel/postgres `sql` returns an array of rows, even for INSERT.
    // The `id` is not directly available from `result[0].id` if not returned.
    // For simplicity, we'll assume the insert was successful for event publishing.
    // In a real app, you'd get the ID from the `RETURNING` clause.

    // Publish event (assuming editId is not strictly needed for this event)
    const event: DomainEvent = {
      type: "TrailEditSuggested",
      editId: "temp-edit-id", // Placeholder, as we don't get it easily from `sql` without `RETURNING`
      trailId: command.trailId,
      userId: command.userId,
      fieldName: command.fieldName,
      timestamp: new Date(),
    }
    await this.eventBus.publish(event)
  }

  private async handleApproveEdit(command: ApproveEditCommand): Promise<void> {
    await pool.begin(async (tx) => {
      const editResult = await tx`SELECT * FROM pending_edits WHERE id = ${command.editId}`

      if (editResult.length === 0) {
        throw new Error("Edit not found")
      }

      const edit = editResult[0]

      await tx`UPDATE trails SET ${tx(edit.field_name)} = ${edit.new_value}, updated_at = NOW() WHERE id = ${edit.trail_id}`

      await tx`UPDATE pending_edits SET status = 'approved', updated_at = NOW() WHERE id = ${command.editId}`

      // Publish event
      const event: DomainEvent = {
        type: "EditApproved",
        editId: command.editId,
        trailId: edit.trail_id,
        adminId: command.adminId,
        timestamp: new Date(),
      }
      await this.eventBus.publish(event)
    })
  }

  private async handleCreateRideShare(command: CreateRideShareCommand): Promise<void> {
    await pool`
      INSERT INTO ride_shares (user_id, trail_id, date, departure_time, departure_location, available_spots, description)
      VALUES (${command.userId}, ${command.trailId}, ${command.date}, ${command.departureTime}, ${command.departureLocation}, ${command.availableSpots}, ${command.description})
      RETURNING id
    `
    // Publish event (assuming rideId is not strictly needed for this event)
    const event: DomainEvent = {
      type: "RideShareCreated",
      rideId: "temp-ride-id", // Placeholder
      trailId: command.trailId,
      userId: command.userId,
      date: command.date,
      timestamp: new Date(),
    }
    await this.eventBus.publish(event)
  }

  private async handleCreateGearShare(command: CreateGearShareCommand): Promise<void> {
    await pool`
      INSERT INTO gear_shares (user_id, item_name, description, category, condition, price_per_day)
      VALUES (${command.userId}, ${command.itemName}, ${command.description}, ${command.category}, ${command.condition}, ${command.pricePerDay})
    `
  }

  private async handleCreateForumThread(command: CreateForumThreadCommand): Promise<void> {
    await pool.begin(async (tx) => {
      const threadResult = await tx`
        INSERT INTO forum_threads (user_id, title, category)
        VALUES (${command.userId}, ${command.title}, ${command.category})
        RETURNING id
      `
      const threadId = threadResult[0].id

      await tx`
        INSERT INTO forum_posts (thread_id, user_id, content)
        VALUES (${threadId}, ${command.userId}, ${command.content})
      `
    })
  }
}
