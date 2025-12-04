import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

// ---- BETTER AUTH CONFIG ----
export const auth = betterAuth({
	appName: "Dashboard Project",

	// Enable email/password login
	emailAndPassword: {
		enabled: true,
	},

	// Use Prisma + PostgreSQL
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),

	trustedOrigins: ["http://localhost:3002"],

	// Required for Next.js App Router cookie handling
	// plugins: [nextCookies()],
});
