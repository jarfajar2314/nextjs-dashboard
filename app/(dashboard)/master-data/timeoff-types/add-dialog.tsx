"use client";

import { useState } from "react";
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

interface AddTypeDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function AddTypeDialog({
	isOpen,
	onOpenChange,
	onSuccess,
}: AddTypeDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("#3b82f6");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name) return toast.error("Name is required");

		setIsLoading(true);
		try {
			const res = await fetch("/api/schedule/timeoff-types", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, description, color }),
			});

			if (res.ok) {
				toast.success("Time off type added");
				onSuccess();
				handleClose();
			} else {
				const err = await res.json();
				throw new Error(err.error || "Failed to add type");
			}
		} catch (error: any) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setName("");
		setDescription("");
		setColor("#3b82f6");
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Type</DialogTitle>
					<DialogDescription>
						Define a new category for time off. Code, payment
						status, and order will be set automatically.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Paid Leave, Sick Leave"
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
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
					<DialogFooter className="pt-4">
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
							Save Category
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
