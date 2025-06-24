import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper function to get current user ID from Clerk
async function getCurrentUserId(ctx: any): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return identity.subject;
}

export const addFavoritePrompt = mutation({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error("User must be authenticated to add a favorite prompt.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User not found in Convex 'users' table.");
    }

    // Check if the prompt is already favorited
    const existingFavorite = await ctx.db
      .query("favoritePrompts")
      .withIndex("by_user_prompt", (q) =>
        q.eq("userId", user._id).eq("promptId", args.promptId)
      )
      .unique();

    if (existingFavorite) {
      // Prompt is already a favorite, maybe return a message or the existing favorite ID
      return existingFavorite._id;
    }

    return await ctx.db.insert("favoritePrompts", {
      userId: user._id,
      promptId: args.promptId,
    });

    // Increment popularity
    const prompt = await ctx.db.get(args.promptId);
    if (prompt) {
      await ctx.db.patch(args.promptId, {
        popularity: (prompt.popularity || 0) + 1,
      });
    }

    return favoriteId;
  },
});

export const removeFavoritePrompt = mutation({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error(
        "User must be authenticated to remove a favorite prompt."
      );
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User not found in Convex 'users' table.");
    }

    const favoriteToRemove = await ctx.db
      .query("favoritePrompts")
      .withIndex("by_user_prompt", (q) =>
        q.eq("userId", user._id).eq("promptId", args.promptId)
      )
      .unique();

    if (!favoriteToRemove) {
      throw new Error("Favorite prompt not found.");
    }

    await ctx.db.delete(favoriteToRemove._id);

    // Decrement popularity
    const prompt = await ctx.db.get(args.promptId);
    if (
      prompt &&
      typeof prompt.popularity === "number" &&
      prompt.popularity > 0
    ) {
      await ctx.db.patch(args.promptId, { popularity: prompt.popularity - 1 });
    } else if (prompt) {
      await ctx.db.patch(args.promptId, { popularity: 0 }); // Ensure it doesn't go below 0
    }
  },
});

export const getFavoritePrompts = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      return []; // No user, no favorites
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      return []; // User not found in Convex, no favorites
    }

    const favoriteEntries = await ctx.db
      .query("favoritePrompts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (favoriteEntries.length === 0) {
      return [];
    }

    const promptIds = favoriteEntries.map((fav) => fav.promptId);

    // Fetch all prompts whose _id is in promptIds
    // Note: Convex doesn't have a direct "IN" query. We need to fetch them one by one or all and filter.
    // For simplicity and smaller scale, fetching all and filtering client-side or fetching one by one might be acceptable.
    // A more optimized approach for larger datasets might involve multiple queries or a different data model.
    // However, let's try to fetch them efficiently.

    const prompts = [];
    for (const id of promptIds) {
      const prompt = await ctx.db.get(id);
      if (prompt) {
        // Add a flag to indicate if the prompt is a favorite
        prompts.push({
          ...prompt,
          isFavorite: true,
          favoriteEntryId: favoriteEntries.find((fav) => fav.promptId === id)
            ?._id,
        });
      }
    }
    return prompts.sort((a, b) => b._creationTime - a._creationTime); // Sort by creation time, newest first
  },
});

export const isPromptFavorite = query({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      return false;
    }

    const favorite = await ctx.db
      .query("favoritePrompts")
      .withIndex("by_user_prompt", (q) =>
        q.eq("userId", user._id).eq("promptId", args.promptId)
      )
      .unique();

    return !!favorite;
  },
});
