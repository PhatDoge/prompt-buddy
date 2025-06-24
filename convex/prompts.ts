import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  //   baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get current user ID from Clerk
async function getCurrentUserId(ctx: any): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    // Return null instead of throwing an error
    return null;
  }
  return identity.subject;
}

export const generatePrompt = action({
  args: {
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
    category: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user ID from Clerk
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      // Handle the case where the user is not authenticated, if necessary for this action
      // For generatePrompt, it's probably best to throw an error or return a specific error state
      // as this action likely requires an authenticated user to save the prompt.
      throw new Error("User must be authenticated to generate a prompt.");
    }

    const systemPrompt = `You are an expert prompt engineer with deep knowledge of AI systems and prompt optimization. Your task is to create precise, robust, and highly effective prompts that will produce consistent, high-quality results from AI agents.

Key principles for excellent prompts:
1. Be specific and unambiguous
2. Provide clear context and background
3. Define the exact output format and structure
4. Include relevant constraints and guidelines
5. Specify the appropriate tone and style
6. Add examples when helpful
7. Use clear, actionable language
8. Consider edge cases and potential misunderstandings

Create a comprehensive, well-structured prompt that maximizes the AI's understanding and output quality. The prompt should be ready to use directly in any AI system.

Return ONLY the generated prompt without any additional commentary, explanations, or meta-text.`;

    const userPrompt = `Generate a precise AI prompt based on these detailed requirements:

**Primary Goal/Objective:** ${args.goal}

**Context & Background:** ${args.context}

**Target Audience:** ${args.audience}

**Desired Tone & Style:** ${args.tone}

**Required Output Format:** ${args.format}

**Constraints & Limitations:** ${args.constraints}

**Reference Examples:** ${args.examples}

**Complexity Level:** ${args.complexity}

**Industry/Domain:** ${args.industry}

**Category:** ${args.category}

**Additional Requirements:** ${args.additionalInfo}

Create a comprehensive, production-ready prompt that incorporates all these elements effectively. The prompt should be clear, actionable, and optimized for consistent AI performance.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const generatedPrompt = response.choices[0].message.content || "";

    // Save the prompt to the database
    await ctx.runMutation(api.prompts.savePrompt, {
      title: args.title,
      userInput: {
        goal: args.goal,
        context: args.context,
        audience: args.audience,
        tone: args.tone,
        format: args.format,
        constraints: args.constraints,
        examples: args.examples,
        additionalInfo: args.additionalInfo,
        complexity: args.complexity,
        industry: args.industry,
      },
      generatedPrompt,
      category: args.category,
    });

    return generatedPrompt;
  },
});

// Renamed from publishPrompt for clarity
export const sharePrompt = mutation({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error("User must be authenticated to share a prompt.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }

    const prompt = await ctx.db.get(args.promptId);
    if (!prompt) {
      throw new Error("Prompt not found.");
    }
    if (prompt.userId !== user._id) {
      throw new Error("User is not the owner of the prompt.");
    }

    await ctx.db.patch(args.promptId, { isPublic: true });
    // Potentially update popularity or other metrics when a prompt is shared
    // For example, could increment a 'sharesCount' field if added to prompts table
  },
});

export const unsharePrompt = mutation({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error("User must be authenticated to unshare a prompt.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }

    const prompt = await ctx.db.get(args.promptId);
    if (!prompt) {
      throw new Error("Prompt not found.");
    }
    if (prompt.userId !== user._id) {
      throw new Error("User is not the owner of the prompt.");
    }

    await ctx.db.patch(args.promptId, { isPublic: false });
  },
});

export const getCommunityPrompts = query({
  args: {
    category: v.optional(v.string()),
    sortBy: v.optional(
      v.union(v.literal("popularity"), v.literal("latest"), v.literal("rating"))
    ), // Added rating sort
    paginationOpts: v.optional(v.any()), // For pagination
  },
  handler: async (ctx, args) => {
    let queryBuilder = ctx.db
      .query("prompts")
      .filter((q) => q.eq(q.field("isPublic"), true));

    if (args.category && args.category !== "all") {
      queryBuilder = queryBuilder.filter((q) =>
        q.eq(q.field("category"), args.category)
      );
    }

    // Note: Sorting by computed values like averageRating or commentsCount directly in the query
    // is complex in Convex if they are not stored on the prompt document itself.
    // For now, 'popularity' and 'latest' (_creationTime) are direct fields.
    // Sorting by 'rating' would ideally use an average rating stored on the prompt.
    // If we sort by rating, we might need to fetch all, calculate, then sort in handler, which is not ideal for pagination.
    // Or, denormalize averageRating onto the prompt document.
    // For this iteration, we'll keep existing sort options and add averageRating to the returned data.

    if (args.sortBy === "popularity") {
      queryBuilder = queryBuilder.order("desc", "popularity");
    } else {
      // Default to sorting by latest
      queryBuilder = queryBuilder.order("desc"); // Orders by _creationTime descending
    }

    const prompts = await queryBuilder.paginate(args.paginationOpts);

    const clerkUserId = await getCurrentUserId(ctx);
    let userConvexId: string | null = null;
    let userFavorites: any[] = [];

    if (clerkUserId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
        .unique();
      if (user) {
        userConvexId = user._id;
        userFavorites = await ctx.db
          .query("favoritePrompts")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();
      }
    }

    const promptsPageWithDetails = await Promise.all(
      prompts.page.map(async (prompt) => {
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
        if (userConvexId) {
          currentUserRatingObj = await ctx.db
            .query("ratings")
            .withIndex("by_prompt_user", (q) =>
              q.eq("promptId", prompt._id).eq("userId", userConvexId as any)
            )
            .unique();
        }

        const commentsCount = (
          await ctx.db
            .query("comments")
            .withIndex("by_prompt", (q) => q.eq("promptId", prompt._id))
            .collect()
        ).length;

        const userFavorite = userFavorites.find(
          (fav) => fav.promptId === prompt._id
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
          isFavorite: !!userFavorite,
          favoriteId: userFavorite?._id,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalRatings: totalRatings,
          currentUserRating:
            currentUserRatingObj ? currentUserRatingObj.rating : null,
          commentsCount: commentsCount,
        };
      })
    );

    return { ...prompts, page: promptsPageWithDetails };
  },
});

export const savePrompt = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);

    if (!clerkUserId) {
      throw new Error("User must be authenticated to save a prompt.");
    }

    // Find the user document by Clerk ID to get the Convex user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      throw new Error(
        "User not found in Convex 'users' table. Please ensure storeUser has been called."
      );
    }

    return await ctx.db.insert("prompts", {
      userId: user._id, // Use the Convex user ID (_id from the users table)
      title: args.title,
      userInput: args.userInput,
      generatedPrompt: args.generatedPrompt,
      category: args.category,
      isPublic: false, // Default to not public
      popularity: 0, // Default popularity
    });
  },
});

export const getUserPrompts = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getCurrentUserId(ctx);

    if (!clerkUserId) {
      // If there's no user ID, they can't have any prompts.
      return [];
    }

    // Find the user document by Clerk ID to get the Convex user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      // If the user is not found in the users table, they cannot have any prompts.
      // This might happen if storeUser hasn't completed yet for a new user.
      return [];
    }

    // Now query prompts using the Convex user ID (_id from the users table)
    const userPrompts = await ctx.db
      .query("prompts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // For each prompt, fetch the current user's rating if it exists
    const promptsWithUserRating = await Promise.all(
      userPrompts.map(async (prompt) => {
        const userRatingDoc = await ctx.db
          .query("ratings")
          .withIndex("by_prompt_user", (q) =>
            q.eq("promptId", prompt._id).eq("userId", user._id)
          )
          .unique();
        return {
          ...prompt,
          currentUserRating: userRatingDoc ? userRatingDoc.rating : null,
        };
      })
    );
    return promptsWithUserRating;
  },
});

export const deletePrompt = mutation({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx); // Changed from userId to clerkUserId for consistency with other mutations
    if (!clerkUserId) {
      throw new Error("User must be authenticated to delete a prompt.");
    }

    // It's generally better to check ownership against the Convex user._id if available,
    // but if prompts are stored with clerkUserId directly, this is fine.
    // Assuming prompts store Convex user._id based on savePrompt logic.
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }

    const prompt = await ctx.db.get(args.promptId);
    if (!prompt || prompt.userId !== user._id) {
      // Check against Convex user._id
      throw new Error("Prompt not found or unauthorized");
    }

    await ctx.db.delete(args.promptId);
  },
});

export const ratePrompt = mutation({
  args: {
    promptId: v.id("prompts"),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);

    if (!clerkUserId) {
      throw new Error("User must be authenticated to rate a prompt.");
    }

    // Find the user document by Clerk ID to get the Convex user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      throw new Error(
        "User not found in Convex 'users' table. Please ensure storeUser has been called."
      );
    }

    const prompt = await ctx.db.get(args.promptId);
    // Check if the prompt exists and if its userId matches the Convex user ID
    if (!prompt || prompt.userId !== user._id) {
      throw new Error("Prompt not found or unauthorized");
    }

    await ctx.db.patch(args.promptId, { rating: args.rating });
  },
});

export const getTotalPromptsCreated = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getCurrentUserId(ctx);

    if (!clerkUserId) {
      return 0; // User not authenticated, so no prompts.
    }

    if (!clerkUserId) {
      return 0; // User not authenticated, so success rate is 0.
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      return 0; // Or throw error, depending on desired behavior for non-existent user
    }

    const prompts = await ctx.db
      .query("prompts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return prompts.length;
  },
});

export const getPromptSuccessRate = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getCurrentUserId(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (!user) {
      return 0; // Or handle as appropriate
    }

    const prompts = await ctx.db
      .query("prompts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("rating"), undefined)) // Only consider prompts that have been rated
      .collect();

    if (prompts.length === 0) {
      return 0; // No rated prompts, so success rate is 0 or undefined based on preference
    }

    const successfulPrompts = prompts.filter(
      (prompt) => prompt.rating !== undefined && prompt.rating >= 4
    ).length;
    return Math.round((successfulPrompts / prompts.length) * 100);
  },
});

// Comments
export const addComment = mutation({
  args: {
    promptId: v.id("prompts"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error("User must be authenticated to comment.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }

    const prompt = await ctx.db.get(args.promptId);
    if (!prompt) {
      throw new Error("Prompt not found.");
    }
    // Optionally check if prompt isPublic before allowing comments
    // if (!prompt.isPublic) {
    //   throw new Error("Cannot comment on a private prompt.");
    // }

    return await ctx.db.insert("comments", {
      promptId: args.promptId,
      userId: user._id,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

export const getComments = query({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_prompt", (q) => q.eq("promptId", args.promptId))
      .order("desc") // Show newest comments first
      .collect();

    return Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.userId);
        return {
          ...comment,
          author:
            author ?
              {
                firstName: author.firstName,
                lastName: author.lastName,
                imageUrl: author.imageUrl,
                clerkId: author.clerkId, // useful for frontend to check if current user is author
              }
            : null,
        };
      })
    );
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error("User must be authenticated to delete a comment.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found.");
    }

    if (comment.userId !== user._id) {
      // Optionally, allow prompt owners or admins to delete comments too
      // const prompt = await ctx.db.get(comment.promptId);
      // if (!prompt || prompt.userId !== user._id) {
      //   throw new Error("User is not authorized to delete this comment.");
      // }
      throw new Error("User is not authorized to delete this comment.");
    }
    await ctx.db.delete(args.commentId);
  },
});

// Ratings
export const addOrUpdateRating = mutation({
  args: {
    promptId: v.id("prompts"),
    rating: v.number(), // Expecting 1-5
  },
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error("User must be authenticated to rate a prompt.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }

    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }

    const prompt = await ctx.db.get(args.promptId);
    if (!prompt) {
      throw new Error("Prompt not found.");
    }
    // Optionally check if prompt isPublic before allowing ratings
    // if (!prompt.isPublic) {
    //   throw new Error("Cannot rate a private prompt.");
    // }

    // Check if the user has already rated this prompt
    const existingRating = await ctx.db
      .query("ratings")
      .withIndex("by_prompt_user", (q) =>
        q.eq("promptId", args.promptId).eq("userId", user._id)
      )
      .unique();

    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, {
        rating: args.rating,
        createdAt: Date.now(),
      });
      return existingRating._id;
    } else {
      // Add new rating
      return await ctx.db.insert("ratings", {
        promptId: args.promptId,
        userId: user._id,
        rating: args.rating,
        createdAt: Date.now(),
      });
    }
    // After rating, we might want to update the denormalized average rating on the prompt table
    // This would require another function or an action. For now, average is calculated on the fly in getCommunityPrompts.
  },
});

// The old ratePrompt is now replaced by addOrUpdateRating.
// The getRatings query is implicitly handled by getCommunityPrompts for average rating.
// If a dedicated getRatings for a prompt (list of all individual ratings) is needed, it can be added:
export const getPromptRatings = query({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_prompt", (q) => q.eq("promptId", args.promptId))
      .order("desc")
      .collect();

    return Promise.all(
      ratings.map(async (rating) => {
        const rater = await ctx.db.get(rating.userId);
        return {
          ...rating,
          rater:
            rater ?
              {
                firstName: rater.firstName,
                lastName: rater.lastName,
                imageUrl: rater.imageUrl,
              }
            : null,
        };
      })
    );
  },
});

export const deleteRating = mutation({
  args: { ratingId: v.id("ratings") }, // Or promptId to find the user's rating for that prompt
  handler: async (ctx, args) => {
    const clerkUserId = await getCurrentUserId(ctx);
    if (!clerkUserId) {
      throw new Error("User must be authenticated to delete a rating.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();
    if (!user) {
      throw new Error("User not found.");
    }

    const rating = await ctx.db.get(args.ratingId);
    if (!rating) {
      throw new Error("Rating not found.");
    }

    if (rating.userId !== user._id) {
      throw new Error("User is not authorized to delete this rating.");
    }
    await ctx.db.delete(args.ratingId);
  },
});
