import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId, handleApiError } from "@/lib/task-utils";

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireUserId();
		const { id } = await params;
		const { name, description, color, sortOrder, isActive } =
			await req.json();

		const updated = await prisma.timeOffType.update({
			where: { id },
			data: {
				name,
				description,
				color,
				sortOrder,
				isActive,
			},
		});

		return NextResponse.json({ ok: true, data: updated });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireUserId();
		const { id } = await params;

		// Soft delete: just set isActive = false
		const deleted = await prisma.timeOffType.update({
			where: { id },
			data: { isActive: false },
		});

		return NextResponse.json({ ok: true, data: deleted });
	} catch (error) {
		return handleApiError(error);
	}
}
