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
      // console.log("Prompt already favorited");
      return { favoriteId: existingFavorite._id, status: "already_favorited" };
    }

    // Check if the prompt to be favorited is public
    const promptToFavorite = await ctx.db.get(args.promptId);
    if (!promptToFavorite) {
      throw new Error("Prompt not found.");
    }
    if (!promptToFavorite.isPublic) {
      throw new Error("Cannot favorite a private prompt.");
    }

    const newFavoriteId = await ctx.db.insert("favoritePrompts", {
      userId: user._id,
      promptId: args.promptId,
    });

    // Increment popularity
    if (promptToFavorite) {
      // promptToFavorite is already fetched and checked
      await ctx.db.patch(args.promptId, {
        popularity: (promptToFavorite.popularity || 0) + 1,
      });
    }

    return { favoriteId: newFavoriteId, status: "added" };
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

    const detailedPrompts = await Promise.all(
      promptIds.map(async (id) => {
        const prompt = await ctx.db.get(id);
        if (!prompt) return null; // Prompt might have been deleted

        // Similar enrichment as in getCommunityPrompts
        const author = await ctx.db.get(prompt.userId);

        const promptRatings = await ctx.db
          .query("ratings")
          .withIndex("by_prompt", (q) => q.eq("promptId", prompt._id))
          .collect();

        let averageRating = 0;
        const totalRatings = promptRatings.length;
        if (totalRatings > 0) {
          averageRating =
            promptRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
        }

        let currentUserRatingObj = null;
        if (user) {
          // user object is available here from the clerk user check
          currentUserRatingObj = await ctx.db
            .query("ratings")
            .withIndex("by_prompt_user", (q) =>
              q.eq("promptId", prompt._id).eq("userId", user._id)
            )
            .unique();
        }

        const commentsCount = (
          await ctx.db
            .query("comments")
            .withIndex("by_prompt", (q) => q.eq("promptId", prompt._id))
            .collect()
        ).length;
        const favoriteEntry = favoriteEntries.find(
          (fav) => fav.promptId === id
        );

        return {
          ...prompt,
          author:
            author ?
              {
                firstName: author.firstName,
                lastName: author.lastName,
                imageUrl: author.imageUrl,
              }
            : null,
          isFavorite: true, // By definition, these are favorited
          favoriteId: favoriteEntry?._id, // Renamed from favoriteEntryId for consistency
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalRatings: totalRatings,
          currentUserRating:
            currentUserRatingObj ? currentUserRatingObj.rating : null,
          commentsCount: commentsCount,
        };
      })
    );

    // Filter out any nulls (e.g. if a prompt was deleted) and sort
    return detailedPrompts
      .filter((p) => p !== null)
      .sort((a, b) => b!._creationTime - a!._creationTime);
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
