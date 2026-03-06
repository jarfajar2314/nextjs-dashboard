import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId, handleApiError } from "@/lib/task-utils";

export async function GET(req: Request) {
	try {
		await requireUserId();
		const { searchParams } = new URL(req.url);

		const startParam = searchParams.get("start");
		const endParam = searchParams.get("end");
		const resourceTypeCode = searchParams.get("type");
		const divisionParams = searchParams.getAll("division");
		const divisions = divisionParams
			.flatMap((d) => d.split(","))
			.filter(Boolean);

		const startDate = startParam ? new Date(startParam) : null;
		const endDate = endParam ? new Date(endParam) : null;
		const isValidRange =
			startDate &&
			endDate &&
			!isNaN(startDate.getTime()) &&
			!isNaN(endDate.getTime());

		if (resourceTypeCode === "TASK") {
			const taskWhere: any = {
				status: { isActive: true },
			};

			if (isValidRange) {
				taskWhere.AND = [
					{ startAt: { lte: endDate } },
					{ endAt: { gte: startDate } },
				];
			}

			// In this view, we want to see People on the Task rows
			// Rows are tasks, Events are people (found in TaskResource)
			const tasks = await prisma.task.findMany({
				where: taskWhere,
				include: {
					resources: {
						include: {
							resource: {
								include: {
									resourceType: true,
								},
							},
						},
					},
				},
			});

			const events: any[] = [];
			tasks.forEach((task) => {
				const rowResourceId = task.code || task.id;
				// Filter for resources that are PEOPLE
				const peopleResources = task.resources.filter(
					(tr) => tr.resource.resourceType.code === "PEOPLE",
				);

				peopleResources.forEach((tr) => {
					events.push({
						id: `${task.id}_${tr.resourceId}`,
						taskId: task.id,
						resourceId: rowResourceId,
						text: tr.resource.name,
						start: task.startAt?.toISOString() || "",
						end: task.endAt?.toISOString() || "",
						backColor: tr.resource.color || "#3d85c6",
						fontColor: "#fff",
						resource: rowResourceId,
						bubbleHtml: `<strong>${tr.resource.name}</strong><br/>on ${task.title}`,
						moveDisabled: true,
						tags: {
							allDay: task.allDay,
							type: "TASK_ASSIGNMENT",
							resourceId: tr.resourceId,
						},
					});
				});
			});

			return NextResponse.json({ ok: true, data: events });
		}

		if (resourceTypeCode === "TIMEOFF") {
			const where: any = {};

			if (isValidRange) {
				where.AND = [
					{ startAt: { lte: endDate } },
					{ endAt: { gte: startDate } },
				];
			}

			if (divisions.length > 0) {
				where.resource = {
					user: {
						profile: {
							division: {
								code: { in: divisions },
							},
						},
					},
				};
			}

			const timeOffRequests = await prisma.timeOffRequest.findMany({
				where,
				include: {
					type: true,
					resource: true,
				},
			});

			const events = timeOffRequests.map((to) => ({
				id: to.id,
				resourceId: to.resourceId,
				text: `${to.type.name}${to.reason ? `: ${to.reason}` : ""}`,
				start: to.startAt.toISOString(),
				end: to.endAt.toISOString(),
				resource: to.resourceId,
				backColor: to.type.color || "#e06666",
				fontColor: "#fff",
				bubbleHtml: `<strong>${to.type.name}</strong><br/>${to.reason || ""}`,
				tags: {
					allDay: to.allDay,
					type: "TIMEOFF",
					status: to.status,
				},
			}));

			return NextResponse.json({ ok: true, data: events });
		}

		// Default Task logic
		const where: any = {
			task: {
				startAt: { not: null },
				endAt: { not: null },
			},
		};

		if (resourceTypeCode) {
			where.resource = {
				resourceType: {
					code: resourceTypeCode,
				},
			};
		}

		if (divisions.length > 0) {
			where.resource = {
				...where.resource,
				user: {
					profile: {
						division: {
							code: { in: divisions },
						},
					},
				},
			};
		}

		if (isValidRange) {
			where.task = {
				...where.task,
				AND: [
					{ startAt: { lte: endDate } },
					{ endAt: { gte: startDate } },
				],
			};
		}

		const taskResources = await prisma.taskResource.findMany({
			where,
			include: {
				task: true,
				resource: true,
			},
		});

		const events = taskResources.map((tr) => {
			return {
				id: `${tr.taskId}_${tr.resourceId}`,
				taskId: tr.taskId,
				resourceId: tr.resourceId,
				text: tr.task.title,
				start: tr.task.startAt ? tr.task.startAt.toISOString() : "",
				end: tr.task.endAt ? tr.task.endAt.toISOString() : "",
				resource: tr.resourceId,
				backColor: tr.task.color || tr.resource.color || "#3d85c6",
				fontColor: "#fff",
				bubbleHtml: `<strong>${tr.task.title}</strong>`,
				tags: {
					allDay: tr.task.allDay,
					type: "TASK",
				},
			};
		});

		return NextResponse.json({ ok: true, data: events });
	} catch (error) {
		return handleApiError(error);
	}
}
