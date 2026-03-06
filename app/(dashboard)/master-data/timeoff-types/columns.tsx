"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
	ChevronDown,
	ChevronUp,
	Edit2,
	Trash2,
	MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TimeOffType = {
	id: string;
	code: string;
	name: string;
	description: string | null;
	color: string | null;
	isPaid: boolean;
	isBlocking: boolean;
	isActive: boolean;
	sortOrder: number;
};

export const getColumns = (
	onMoveUp: (row: TimeOffType) => void,
	onMoveDown: (row: TimeOffType) => void,
	onEdit: (row: TimeOffType) => void,
	onDelete: (row: TimeOffType) => void,
	totalRows: number,
): ColumnDef<TimeOffType>[] => [
	{
		accessorKey: "sortOrder",
		header: "Sort",
		cell: ({ row }) => {
			const isFirst = row.index === 0;
			const isLast = row.index === totalRows - 1;

			return (
				<div className="flex items-center gap-2">
					<div className="flex flex-col gap-0.5 min-w-[20px] min-h-[42px] justify-center">
						{!isFirst && (
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-slate-100"
								onClick={(e) => {
									e.stopPropagation();
									onMoveUp(row.original);
								}}
							>
								<ChevronUp className="h-3 w-3" />
							</Button>
						)}
						{!isLast && (
							<Button
								variant="ghost"
								size="icon"
								className="h-5 w-5 hover:bg-slate-100"
								onClick={(e) => {
									e.stopPropagation();
									onMoveDown(row.original);
								}}
							>
								<ChevronDown className="h-3 w-3" />
							</Button>
						)}
					</div>
					<span className="text-xs font-medium tabular-nums text-muted-foreground w-4 text-center">
						{row.original.sortOrder}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				{row.original.color && (
					<div
						className="w-3 h-3 rounded-full border border-black/10"
						style={{ backgroundColor: row.original.color }}
					/>
				)}
				<span className="font-semibold">{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm line-clamp-1">
				{row.original.description || "—"}
			</span>
		),
	},
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => (
			<Badge
				variant={row.original.isActive ? "default" : "secondary"}
				className="font-normal"
			>
				{row.original.isActive ? "Active" : "Archived"}
			</Badge>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				<div className="flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[160px]">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => onEdit(row.original)}
							>
								<Edit2 className="mr-2 h-4 w-4" />
								Edit Details
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={() => onDelete(row.original)}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Type
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
