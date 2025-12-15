import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, customSession } from "better-auth/plugins";
import { ac, admin, superadmin, user } from "@/lib/permissions";

// ---- BETTER AUTH CONFIG ----
export const auth = betterAuth({
	appName: "Dashboard Project",

	// Enable email change feature
	user: {
		changeEmail: {
			enabled: true,
			updateEmailWithoutVerification: true, // without verification for now
		},
	},

	// Enable email/password login
	emailAndPassword: {
		enabled: true,
	},

	// Use Prisma + PostgreSQL
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),

	trustedOrigins: [
		"http://localhost:3002",
		"http://127.0.0.1:3002",
		"http://0.0.0.0:3002",
	],

	// Required for Next.js App Router cookie handling
	plugins: [
		nextCookies(),
		adminPlugin({
			ac,
			roles: {
				admin,
				superadmin,
				user,
			},
			defaultRole: "user",
			adminRoles: ["admin", "superadmin"],
		}),
		// Custom session plugin to inject roles and permissions
		customSession(async ({ user, session }) => {
			// Fetch roles and permissions for this user
			const userData = await prisma.user.findUnique({
				where: { id: user.id },
				include: {
					roles: {
						include: {
							permissions: true,
						},
					},
				},
			});

			if (!userData) {
				return { user, session };
			}

			const allPermissions = new Set<string>();
			userData.roles.forEach((role) => {
				role.permissions.forEach((p) => {
					allPermissions.add(`${p.action}:${p.resource}`);
				});
			});

			return {
				user: {
					...user,
					roles: userData.roles.map((r) => r.name),
					permissions: Array.from(allPermissions),
				},
				session,
			};
		}),
	],
});
