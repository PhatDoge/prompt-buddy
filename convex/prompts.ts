import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  //   baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get current user ID from Clerk
async function getCurrentUserId(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("User must be authenticated");
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
    });
  },
});

export const getUserPrompts = query({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await getCurrentUserId(ctx);

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
    return await ctx.db
      .query("prompts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const deletePrompt = mutation({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    const prompt = await ctx.db.get(args.promptId);
    if (!prompt || prompt.userId !== userId) {
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
