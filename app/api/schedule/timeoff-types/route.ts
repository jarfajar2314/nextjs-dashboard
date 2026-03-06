import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId, handleApiError } from "@/lib/task-utils";

export async function GET() {
	try {
		await requireUserId();
		const types = await prisma.timeOffType.findMany({
			where: { isActive: true },
			orderBy: { sortOrder: "asc" },
		});

		return NextResponse.json({ ok: true, data: types });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		await requireUserId();
		const { name, description, color } = await req.json();

		if (!name) {
			return NextResponse.json(
				{ ok: false, error: "Name is required" },
				{ status: 400 },
			);
		}

		// Generate code: lowercase, kebab-case
		const code = name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");

		// Get latest sortOrder
		const lastType = await prisma.timeOffType.findFirst({
			orderBy: { sortOrder: "desc" },
		});

		const sortOrder = lastType ? lastType.sortOrder + 1 : 1;

		const newType = await prisma.timeOffType.create({
			data: {
				name,
				code,
				description,
				color,
				sortOrder,
				isPaid: true,
				isBlocking: true,
				isActive: true,
			},
		});

		return NextResponse.json({ ok: true, data: newType });
	} catch (error) {
		return handleApiError(error);
	}
}
