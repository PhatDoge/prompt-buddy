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
  }).index("by_user", ["userId"]),

  favoritePrompts: defineTable({
    userId: v.id("users"),
    promptId: v.id("prompts"),
  })
    .index("by_user", ["userId"])
    .index("by_prompt", ["promptId"])
    .index("by_user_prompt", ["userId", "promptId"]),
};

export default defineSchema({
  ...applicationTables,
});
