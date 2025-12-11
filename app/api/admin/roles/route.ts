import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const roles = await prisma.role.findMany({
			include: {
				permissions: true,
			},
		});
		return NextResponse.json(roles);
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Failed to fetch roles", details: error.message },
			{ status: 500 }
		);
	}
}
