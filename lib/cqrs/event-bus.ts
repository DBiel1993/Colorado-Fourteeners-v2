import type { DomainEvent } from "./types"

export class EventBus {
  private handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map()

  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || []

    // Execute all handlers in parallel
    await Promise.all(handlers.map((handler) => handler(event)))
  }
}

// Event handlers
export class EventHandlers {
  static async handleTrailCreated(event: DomainEvent): Promise<void> {
    if (event.type === "TrailCreated") {
      console.log(`Trail created: ${event.name} (ID: ${event.trailId})`)
      // Could trigger notifications, cache updates, etc.
    }
  }

  static async handleTrailEditSuggested(event: DomainEvent): Promise<void> {
    if (event.type === "TrailEditSuggested") {
      console.log(`Edit suggested for trail ${event.trailId} by user ${event.userId}`)
      // Could send notifications to admins
    }
  }

  static async handleEditApproved(event: DomainEvent): Promise<void> {
    if (event.type === "EditApproved") {
      console.log(`Edit ${event.editId} approved by admin ${event.adminId}`)
      // Could invalidate caches, send notifications
    }
  }

  static async handleRideShareCreated(event: DomainEvent): Promise<void> {
    if (event.type === "RideShareCreated") {
      console.log(`Ride share created for trail ${event.trailId} on ${event.date}`)
      // Could send notifications to interested users
    }
  }
}
