"use server";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { WebhookEvent } from "@clerk/nextjs/server";

// Alternative: Direct import if internal.users doesn't work
// import { createUser } from "./users";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result: WebhookEvent = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          // Try this first
          await ctx.runMutation(internal.users.createUser, {
            clerkId: result.data.id,
            email: result.data.email_addresses[0]?.email_address || "",
            firstName: result.data.first_name || undefined,
            lastName: result.data.last_name || undefined,
            imageUrl: result.data.image_url || undefined,
          });

          // Alternative if internal.users doesn't work:
          // await createUser(ctx, {
          //   clerkId: result.data.id,
          //   email: result.data.email_addresses[0]?.email_address || "",
          //   firstName: result.data.first_name || undefined,
          //   lastName: result.data.last_name || undefined,
          //   imageUrl: result.data.image_url || undefined,
          // });
          break;

        case "organizationMembership.updated":
        case "organizationMembership.created":
          await ctx.runMutation(internal.memberships.addUserIdToOrg, {
            userId: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
          });
          break;

        case "organizationMembership.deleted":
          await ctx.runMutation(internal.memberships.removeUserIdFromOrg, {
            userId: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
