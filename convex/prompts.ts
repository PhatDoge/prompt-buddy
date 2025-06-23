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
    const userId = await getCurrentUserId(ctx);

    return await ctx.db.insert("prompts", {
      userId,
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
    const userId = await getCurrentUserId(ctx);

    return await ctx.db
      .query("prompts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
    const userId = await getCurrentUserId(ctx);

    const prompt = await ctx.db.get(args.promptId);
    if (!prompt || prompt.userId !== userId) {
      throw new Error("Prompt not found or unauthorized");
    }

    await ctx.db.patch(args.promptId, { rating: args.rating });
  },
});
