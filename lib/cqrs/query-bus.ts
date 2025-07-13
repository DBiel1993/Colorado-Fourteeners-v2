"server-only"

import { pool } from "@/lib/database" // Now imports `sql` from @vercel/postgres
import type {
  GetTrailsQuery,
  GetTrailByIdQuery,
  SearchTrailsQuery,
  GetPendingEditsQuery,
  GetRideSharesQuery,
  GetGearSharesQuery,
  GetForumThreadsQuery,
} from "./types"

export class QueryBus {
  async handle(query: any): Promise<any> {
    switch (query.type) {
      case "GetTrails":
        return this.handleGetTrails(query)
      case "GetTrailById":
        return this.handleGetTrailById(query)
      case "SearchTrails":
        return this.handleSearchTrails(query)
      case "GetPendingEdits":
        return this.handleGetPendingEdits(query)
      case "GetRideShares":
        return this.handleGetRideShares(query)
      case "GetGearShares":
        return this.handleGetGearShares(query)
      case "GetForumThreads":
        return this.handleGetForumThreads(query)
      default:
        throw new Error(`Unknown query type: ${query.type}`)
    }
  }

  private async handleGetTrails(query: GetTrailsQuery): Promise<any[]> {
    let sqlQuery = `
      SELECT 
        id, name, elevation, difficulty, distance,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat,
        description, route_description, created_at, updated_at
      FROM trails 
      WHERE 1=1
    `
    const params: any[] = []

    if (query.filters?.difficulty?.length) {
      sqlQuery += ` AND difficulty = ANY($${params.length + 1})`
      params.push(query.filters.difficulty)
    }

    if (query.filters?.minElevation) {
      sqlQuery += ` AND elevation >= $${params.length + 1}`
      params.push(query.filters.minElevation)
    }

    if (query.filters?.maxElevation) {
      sqlQuery += ` AND elevation <= $${params.length + 1}`
      params.push(query.filters.maxElevation)
    }

    if (query.filters?.maxDistance) {
      sqlQuery += ` AND distance <= $${params.length + 1}`
      params.push(query.filters.maxDistance)
    }

    sqlQuery += ` ORDER BY ${query.sort || "name"}`

    if (query.limit) {
      sqlQuery += ` LIMIT $${params.length + 1}`
      params.push(query.limit)
    }

    if (query.offset) {
      sqlQuery += ` OFFSET $${params.length + 1}`
      params.push(query.offset)
    }

    const result = await pool.query(sqlQuery, params)

    return result.rows.map((row) => ({
      ...row,
      location: { lat: row.lat, lng: row.lng },
    }))
  }

  private async handleGetTrailById(query: GetTrailByIdQuery): Promise<any | null> {
    const result = await pool`
      SELECT 
        id, name, elevation, difficulty, distance,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat,
        description, route_description, created_at, updated_at
      FROM trails 
      WHERE id = ${query.id}
    `

    if (result.length === 0) return null

    const row = result[0]
    return {
      ...row,
      location: { lat: row.lat, lng: row.lng },
    }
  }

  private async handleSearchTrails(query: SearchTrailsQuery): Promise<any[]> {
    const result = await pool`
      SELECT 
        id, name, elevation, difficulty, distance,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat,
        description, route_description, created_at, updated_at,
        ts_rank(search_vector, plainto_tsquery(${query.query})) as rank
      FROM trails 
      WHERE search_vector @@ plainto_tsquery(${query.query})
      ORDER BY rank DESC, name
      LIMIT ${query.limit || 20}
    `

    return result.map((row) => ({
      ...row,
      location: { lat: row.lat, lng: row.lng },
    }))
  }

  private async handleGetPendingEdits(query: GetPendingEditsQuery): Promise<any[]> {
    let sqlQuery = `
      SELECT 
        pe.*,
        t.name as trail_name,
        u.name as user_name
      FROM pending_edits pe
      JOIN trails t ON pe.trail_id = t.id
      JOIN users u ON pe.user_id = u.id
    `
    const params: any[] = []

    if (query.status) {
      sqlQuery += ` WHERE pe.status = $${params.length + 1}`
      params.push(query.status)
    } else {
      sqlQuery += ` WHERE pe.status = 'pending'`
    }

    sqlQuery += ` ORDER BY pe.created_at DESC`

    if (query.limit) {
      sqlQuery += ` LIMIT $${params.length + 1}`
      params.push(query.limit)
    }

    const result = await pool.query(sqlQuery, params)
    return result.rows
  }

  private async handleGetRideShares(query: GetRideSharesQuery): Promise<any[]> {
    let sqlQuery = `
      SELECT 
        rs.*,
        t.name as trail_name,
        u.name as user_name
      FROM ride_shares rs
      JOIN trails t ON rs.trail_id = t.id
      JOIN users u ON rs.user_id = u.id
      WHERE rs.date >= CURRENT_DATE
    `
    const params: any[] = []

    if (query.trailId) {
      sqlQuery += ` AND rs.trail_id = $${params.length + 1}`
      params.push(query.trailId)
    }

    if (query.userId) {
      sqlQuery += ` AND rs.user_id = $${params.length + 1}`
      params.push(query.userId)
    }

    if (query.dateFrom) {
      sqlQuery += ` AND rs.date >= $${params.length + 1}`
      params.push(query.dateFrom)
    }

    if (query.dateTo) {
      sqlQuery += ` AND rs.date <= $${params.length + 1}`
      params.push(query.dateTo)
    }

    sqlQuery += ` ORDER BY rs.date, rs.departure_time`

    const result = await pool.query(sqlQuery, params)
    return result.rows
  }

  private async handleGetGearShares(query: GetGearSharesQuery): Promise<any[]> {
    let sqlQuery = `
      SELECT 
        gs.*,
        u.name as user_name
      FROM gear_shares gs
      JOIN users u ON gs.user_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (query.available !== undefined) {
      sqlQuery += ` AND gs.available = $${params.length + 1}`
      params.push(query.available)
    } else {
      sqlQuery += ` AND gs.available = true`
    }

    if (query.category) {
      sqlQuery += ` AND gs.category = $${params.length + 1}`
      params.push(query.category)
    }

    if (query.userId) {
      sqlQuery += ` AND gs.user_id = $${params.length + 1}`
      params.push(query.userId)
    }

    sqlQuery += ` ORDER BY gs.created_at DESC`

    const result = await pool.query(sqlQuery, params)
    return result.rows
  }

  private async handleGetForumThreads(query: GetForumThreadsQuery): Promise<any[]> {
    let sqlQuery = `
      SELECT 
        ft.*,
        u.name as user_name,
        COUNT(fp.id) as post_count
      FROM forum_threads ft
      JOIN users u ON ft.user_id = u.id
      LEFT JOIN forum_posts fp ON ft.id = fp.thread_id
    `
    const params: any[] = []

    if (query.category) {
      sqlQuery += ` WHERE ft.category = $${params.length + 1}`
      params.push(query.category)
    }

    sqlQuery += ` GROUP BY ft.id, u.name ORDER BY ft.updated_at DESC`

    if (query.limit) {
      sqlQuery += ` LIMIT $${params.length + 1}`
      params.push(query.limit)
    }

    if (query.offset) {
      sqlQuery += ` OFFSET $${params.length + 1}`
      params.push(query.offset)
    }

    const result = await pool.query(sqlQuery, params)
    return result.rows
  }
}
