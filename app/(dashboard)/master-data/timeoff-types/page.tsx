"use client";

import { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/datatable/data-table";
import { getColumns, TimeOffType } from "./columns";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { TimeOffTypeDialog } from "./type-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

export default function TimeOffTypesPage() {
	const [data, setData] = useState<TimeOffType[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedType, setSelectedType] = useState<TimeOffType | null>(null);
	const [typeToDelete, setTypeToDelete] = useState<TimeOffType | null>(null);

	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/schedule/timeoff-types");
			if (!res.ok) throw new Error("Failed to fetch types");
			const json = await res.json();
			if (json.ok) {
				setData(json.data);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to load time off types");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleReorder = async (
		type: TimeOffType,
		direction: "up" | "down",
	) => {
		const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
		const idx = sorted.findIndex((t) => t.id === type.id);

		if (direction === "up" && idx > 0) {
			const other = sorted[idx - 1];
			await performSwap(type, other);
		} else if (direction === "down" && idx < sorted.length - 1) {
			const other = sorted[idx + 1];
			await performSwap(type, other);
		}
	};

	const performSwap = async (itemA: TimeOffType, itemB: TimeOffType) => {
		try {
			const orderA = itemA.sortOrder;
			const orderB = itemB.sortOrder;

			await Promise.all([
				fetch(`/api/schedule/timeoff-types/${itemA.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ sortOrder: orderB }),
				}),
				fetch(`/api/schedule/timeoff-types/${itemB.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ sortOrder: orderA }),
				}),
			]);

			toast.success("Order updated");
			await fetchData();
		} catch (error) {
			console.error(error);
			toast.error("Failed to update order");
		}
	};

	const handleDelete = async () => {
		if (!typeToDelete) return;

		try {
			const res = await fetch(
				`/api/schedule/timeoff-types/${typeToDelete.id}`,
				{
					method: "DELETE",
				},
			);

			if (res.ok) {
				toast.success("Type archived");
				fetchData();
			} else {
				throw new Error("Failed to delete");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to archive type");
		} finally {
			setTypeToDelete(null);
		}
	};

	const columns = useMemo(
		() =>
			getColumns(
				(row) => handleReorder(row, "up"),
				(row) => handleReorder(row, "down"),
				(row) => {
					setSelectedType(row);
					setIsDialogOpen(true);
				},
				(row) => setTypeToDelete(row),
				data.length,
			),
		[data],
	);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Time Off Types
					</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Manage categories for leave. Use arrows to organize
						priority or edit details via actions.
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => {
							setSelectedType(null);
							setIsDialogOpen(true);
						}}
						className="shadow-sm"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Type
					</Button>
				</div>
			</div>

			{/* <Card className="border shadow-sm">
				<CardHeader className="pb-3 border-b">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg">
								Type Configuration
							</CardTitle>
							<CardDescription>
								List of categories used in the scheduler.
							</CardDescription>
						</div>
						{loading && (
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-6">
				</CardContent>
			</Card> */}
			{loading && data.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-slate-50/30 rounded-lg border border-dashed">
					<Loader2 className="h-8 w-8 animate-spin mb-2" />
					<span>Fetching current categories...</span>
				</div>
			) : (
				<DataTable columns={columns} data={data} filterKey="name" />
			)}

			<TimeOffTypeDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSuccess={fetchData}
				initialData={selectedType}
			/>

			<ConfirmationDialog
				open={!!typeToDelete}
				onOpenChange={(open) => !open && setTypeToDelete(null)}
				title="Archive Time Off Type"
				description={`Are you sure you want to archive "${typeToDelete?.name}"? It will no longer be available for new requests.`}
				confirmText="Archive"
				variant="destructive"
				onConfirm={handleDelete}
			/>
		</div>
	);
}
