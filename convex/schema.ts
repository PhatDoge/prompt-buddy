import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  // Add a users table to store Clerk user data
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Update your prompts table
  prompts: defineTable({
    userId: v.id("users"), // Still references users table, but now it's the Clerk users table
    title: v.string(),
    userInput: v.object({
      goal: v.string(),
      context: v.string(),
      audience: v.string(),
      tone: v.string(),
      format: v.string(),
      constraints: v.string(),
      examples: v.string(),
      additionalInfo: v.string(),
      complexity: v.string(),
      industry: v.string(),
    }),
    generatedPrompt: v.string(),
    category: v.string(),
    rating: v.optional(v.number()),
    isPublic: v.optional(v.boolean()), // Used for community sharing
    popularity: v.optional(v.number()), // Added for sorting by popularity
    // The existing 'rating' field might be an average, we'll use a separate table for individual ratings
  })
    .index("by_user", ["userId"])
    .index("by_public_popularity", ["isPublic", "popularity"]), // Index for querying public prompts by popularity

  favoritePrompts: defineTable({
    userId: v.id("users"),
    promptId: v.id("prompts"),
  })
    .index("by_user", ["userId"])
    .index("by_prompt", ["promptId"])
    .index("by_user_prompt", ["userId", "promptId"]),

  comments: defineTable({
    promptId: v.id("prompts"),
    userId: v.id("users"),
    text: v.string(),
    createdAt: v.number(), // Store as a timestamp
  })
    .index("by_prompt", ["promptId"])
    .index("by_user", ["userId"]),

  ratings: defineTable({
    promptId: v.id("prompts"),
    userId: v.id("users"),
    rating: v.number(), // e.g., a number from 1 to 5
    createdAt: v.number(), // Store as a timestamp
  })
    .index("by_prompt", ["promptId"])
    .index("by_user", ["userId"])
    .index("by_prompt_user", ["promptId", "userId"]), // To ensure a user can rate a prompt only once or to easily update a rating
};

export default defineSchema({
  ...applicationTables,
});
