"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ColorPicker } from "@/components/color-picker";
import { TimeOffType } from "./columns";

interface TimeOffTypeDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	initialData?: TimeOffType | null;
}

export function TimeOffTypeDialog({
	isOpen,
	onOpenChange,
	onSuccess,
	initialData,
}: TimeOffTypeDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("#3b82f6");
	const [isLoading, setIsLoading] = useState(false);

	const isEdit = !!initialData;

	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setName(initialData.name || "");
				setDescription(initialData.description || "");
				setColor(initialData.color || "#3b82f6");
			} else {
				setName("");
				setDescription("");
				setColor("#3b82f6");
			}
		}
	}, [isOpen, initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name) return toast.error("Name is required");

		setIsLoading(true);
		try {
			const url = isEdit
				? `/api/schedule/timeoff-types/${initialData.id}`
				: "/api/schedule/timeoff-types";

			const method = isEdit ? "PATCH" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, description, color }),
			});

			if (res.ok) {
				toast.success(isEdit ? "Type updated" : "Type added");
				onSuccess();
				handleClose();
			} else {
				const err = await res.json();
				throw new Error(err.error || "Failed to save category");
			}
		} catch (error: any) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="p-0 overflow-hidden gap-0">
				<DialogHeader className="p-6 pb-2">
					<DialogTitle>
						{isEdit ? "Edit Type" : "Add New Type"}
					</DialogTitle>
					<DialogDescription>
						{isEdit
							? "Update the details for this time off category."
							: "Define a new category for time off. Code, payment status, and order will be set automatically."}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit}
					className="space-y-4 px-6 pb-6 pt-2"
				>
					<div className="space-y-2">
						<Label htmlFor="type-name">Name</Label>
						<Input
							id="type-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Paid Leave, Sick Leave"
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="type-description">Description</Label>
						<Textarea
							id="type-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Optional details about this leave type"
							disabled={isLoading}
							rows={3}
						/>
					</div>
					<div className="space-y-2">
						<Label>Accent Color</Label>
						<ColorPicker
							value={color}
							onChange={setColor}
							className="pt-1"
						/>
					</div>
					<DialogFooter className="pt-4 mb-3">
						<Button
							type="button"
							variant="ghost"
							onClick={handleClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isEdit ? "Update Changes" : "Save Category"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
