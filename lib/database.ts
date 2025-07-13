"server-only"

import { sql } from "@vercel/postgres"

// Ensure DATABASE_URL is set
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set. Please configure your database connection string.")
}

// Use the `sql` instance from @vercel/postgres
// For direct queries, you can use `sql` tagged template literal.
// For transactions or more complex scenarios, you might need to get a client from the pool.
// @vercel/postgres handles pooling internally.
const pool = {
  connect: async () => {
    // @vercel/postgres doesn't expose a direct 'pool.connect()' like 'pg'.
    // For simple queries, `sql` is sufficient. For transactions, you'd use `sql.begin()`.
    // For compatibility with existing code expecting a 'client' object, we can return a mock or adapt.
    // For now, we'll assume direct `sql` usage or adapt `CommandBus`/`QueryBus` to use `sql.begin()`
    // if transactions are needed.
    return {
      query: sql,
      release: () => {}, // No-op for @vercel/postgres
      // Add begin/commit/rollback if needed for transactions in CommandBus/QueryBus
      // For now, CommandBus/QueryBus will be updated to use `sql.begin()`
      // or rely on `sql` for individual queries.
      async begin() {
        // This is a placeholder. Actual transaction handling with @vercel/postgres
        // is typically done via `sql.begin(async (tx) => { ... })`
        // or by passing the `sql` instance itself.
        // For the existing CQRS pattern, we'll adapt `CommandBus` to use `sql.begin()`.
      },
      async commit() {},
      async rollback() {},
    }
  },
}

export { sql as pool } // Export `sql` as `pool` for compatibility with existing CQRS structure

export interface Trail {
  id: string
  name: string
  elevation: number
  difficulty: "easy" | "moderate" | "hard" | "expert"
  distance: number
  location: {
    lat: number
    lng: number
  }
  description: string
  route_description: string
  created_at: Date
  updated_at: Date
}

export interface PendingEdit {
  id: string
  trail_id: string
  user_id: string
  field_name: string
  old_value: string
  new_value: string
  reason: string
  status: "pending" | "approved" | "rejected"
  created_at: Date
}

export interface RideShare {
  id: string
  user_id: string
  trail_id: string
  date: Date
  departure_time: string
  departure_location: string
  available_spots: number
  description: string
  created_at: Date
}

export interface GearShare {
  id: string
  user_id: string
  item_name: string
  description: string
  category: string
  condition: "excellent" | "good" | "fair" | "poor"
  price_per_day: number
  available: boolean
  created_at: Date
}

export interface ForumThread {
  id: string
  user_id: string
  title: string
  category: string
  created_at: Date
  updated_at: Date
  post_count: number
}

export interface ForumPost {
  id: string
  thread_id: string
  user_id: string
  content: string
  created_at: Date
  updated_at: Date
}
