"server-only"

import { CommandBus } from "./command-bus"
import { QueryBus } from "./query-bus"
import { EventBus, EventHandlers } from "./event-bus"

// Initialize CQRS infrastructure
const eventBus = new EventBus()
const commandBus = new CommandBus(eventBus)
const queryBus = new QueryBus()

// Register event handlers
eventBus.subscribe("TrailCreated", EventHandlers.handleTrailCreated)
eventBus.subscribe("TrailEditSuggested", EventHandlers.handleTrailEditSuggested)
eventBus.subscribe("EditApproved", EventHandlers.handleEditApproved)
eventBus.subscribe("RideShareCreated", EventHandlers.handleRideShareCreated)

export { commandBus, queryBus, eventBus }

// Helper functions for easier usage
export const executeCommand = (command: any) => commandBus.handle(command)
export const executeQuery = (query: any) => queryBus.handle(query)
