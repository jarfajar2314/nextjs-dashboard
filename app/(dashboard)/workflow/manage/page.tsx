"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

type Workflow = {
	id: string;
	code: string;
	name: string;
	version: number;
	description: string | null;
	is_active: boolean;
	workflow_step: any[];
};

export default function WorkflowsPage() {
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [confirmingWorkflowId, setConfirmingWorkflowId] = useState<
		string | null
	>(null);
	const router = useRouter();

	useEffect(() => {
		async function fetchWorkflows() {
			try {
				const res = await fetch("/api/workflows");
				if (!res.ok) {
					throw new Error("Failed to fetch workflows");
				}
				const data = await res.json();
				setWorkflows(data);
			} catch (err) {
				console.error(err);
				setError("Failed to load workflows");
			} finally {
				setLoading(false);
			}
		}

		fetchWorkflows();
	}, []);

	const handleActivate = async (workflowId: string, code: string) => {
		try {
			const res = await fetch(`/api/workflows/${workflowId}/activate`, {
				method: "POST",
			});

			if (!res.ok) throw new Error("Failed to activate workflow");

			toast.success("Workflow activated");

			// Update local state to reflect change
			setWorkflows((prev) =>
				prev.map((w) => {
					if (w.code === code) {
						return { ...w, is_active: w.id === workflowId };
					}
					return w;
				})
			);
		} catch (error) {
			console.error(error);
			toast.error("Failed to activate workflow");
		}
	};

	const handleDeactivate = async (workflowId: string) => {
		try {
			const res = await fetch(`/api/workflows/${workflowId}/deactivate`, {
				method: "POST",
			});

			if (!res.ok) throw new Error("Failed to deactivate workflow");

			toast.success("Workflow deactivated");

			// Update local state to reflect change
			setWorkflows((prev) =>
				prev.map((w) =>
					w.id === workflowId ? { ...w, is_active: false } : w
				)
			);
		} catch (error) {
			console.error(error);
			toast.error("Failed to deactivate workflow");
		}
	};

	const handleNewVersion = async (workflowId: string) => {
		try {
			const res = await fetch(
				`/api/workflows/${workflowId}/new-version`,
				{
					method: "POST",
				}
			);

			if (!res.ok) throw new Error("Failed to create new version");

			const newWorkflow = await res.json();
			toast.success("New version created");
			router.push(`/workflow/manage/workflows/${newWorkflow.id}`);
		} catch (error) {
			console.error(error);
			toast.error("Failed to create new version");
		}
	};

	const onConfirmNewVersion = () => {
		if (confirmingWorkflowId) {
			handleNewVersion(confirmingWorkflowId);
			setConfirmingWorkflowId(null);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full min-h-[400px]">
				<Loader2
					className="animate-spin text-muted-foreground"
					size={32}
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full min-h-[400px] text-destructive">
				{error}
			</div>
		);
	}

	return (
		<div className="md:p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Workflows
					</h1>
					<p className="text-muted-foreground">
						Manage and define your workflow definitions.
					</p>
				</div>
				<Button asChild>
					<Link href="/workflow/manage/workflows/new">
						<Plus className="w-4 h-4 mr-2" />
						Create Workflow
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Workflows</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Code</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Version</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{workflows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center h-24 text-muted-foreground"
									>
										No workflows found.
									</TableCell>
								</TableRow>
							) : (
								workflows.map((workflow) => (
									<TableRow key={workflow.id}>
										<TableCell className="font-medium">
											{workflow.code}
										</TableCell>
										<TableCell>{workflow.name}</TableCell>
										<TableCell>
											v{workflow.version}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													workflow.is_active
														? "default"
														: "secondary"
												}
											>
												{workflow.is_active
													? "Active"
													: "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link
															href={`/workflow/manage/workflows/${workflow.id}`}
														>
															View
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															setConfirmingWorkflowId(
																workflow.id
															)
														}
													>
														New Version
													</DropdownMenuItem>
													{!workflow.is_active ? (
														<DropdownMenuItem
															onClick={() =>
																handleActivate(
																	workflow.id,
																	workflow.code
																)
															}
														>
															Activate
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem
															onClick={() =>
																handleDeactivate(
																	workflow.id
																)
															}
														>
															Deactivate
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<ConfirmationDialog
				open={!!confirmingWorkflowId}
				onOpenChange={(open) => !open && setConfirmingWorkflowId(null)}
				title="Create New Version"
				description="Are you sure you want to create a new version of this workflow? This will create a new draft version based on the current one."
				confirmText="Create"
				onConfirm={onConfirmNewVersion}
			/>
		</div>
	);
}
