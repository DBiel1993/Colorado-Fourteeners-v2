// Command Types
export interface CreateTrailCommand {
  name: string
  elevation: number
  difficulty: "easy" | "moderate" | "hard" | "expert"
  distance: number
  location: { lat: number; lng: number }
  description: string
  route_description: string
}

export interface SuggestTrailEditCommand {
  trailId: string
  userId: string
  fieldName: string
  oldValue: string
  newValue: string
  reason: string
}

export interface ApproveEditCommand {
  editId: string
  adminId: string
}

export interface CreateRideShareCommand {
  userId: string
  trailId: string
  date: string
  departureTime: string
  departureLocation: string
  availableSpots: number
  description: string
}

export interface CreateGearShareCommand {
  userId: string
  itemName: string
  description: string
  category: string
  condition: "excellent" | "good" | "fair" | "poor"
  pricePerDay: number
}

export interface CreateForumThreadCommand {
  userId: string
  title: string
  category: string
  content: string
}

// Query Types
export interface GetTrailsQuery {
  filters?: {
    difficulty?: string[]
    minElevation?: number
    maxElevation?: number
    maxDistance?: number
  }
  sort?: "name" | "elevation" | "difficulty" | "distance"
  limit?: number
  offset?: number
}

export interface GetTrailByIdQuery {
  id: string
}

export interface SearchTrailsQuery {
  query: string
  limit?: number
}

export interface GetPendingEditsQuery {
  status?: "pending" | "approved" | "rejected"
  limit?: number
}

export interface GetRideSharesQuery {
  trailId?: string
  userId?: string
  dateFrom?: string
  dateTo?: string
}

export interface GetGearSharesQuery {
  category?: string
  available?: boolean
  userId?: string
}

export interface GetForumThreadsQuery {
  category?: string
  limit?: number
  offset?: number
}

// Event Types
export interface TrailCreatedEvent {
  type: "TrailCreated"
  trailId: string
  name: string
  timestamp: Date
}

export interface TrailEditSuggestedEvent {
  type: "TrailEditSuggested"
  editId: string
  trailId: string
  userId: string
  fieldName: string
  timestamp: Date
}

export interface EditApprovedEvent {
  type: "EditApproved"
  editId: string
  trailId: string
  adminId: string
  timestamp: Date
}

export interface RideShareCreatedEvent {
  type: "RideShareCreated"
  rideId: string
  trailId: string
  userId: string
  date: string
  timestamp: Date
}

export type DomainEvent = TrailCreatedEvent | TrailEditSuggestedEvent | EditApprovedEvent | RideShareCreatedEvent
