import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Calendar, Layers } from "lucide-react";
import Link from "next/link";

export default function MasterDataPage() {
	const sections = [
		{
			title: "Time Off Types",
			description:
				"Manage leave categories, payment status, and blocking behavior.",
			href: "/master-data/timeoff-types",
			icon: Calendar,
			color: "text-blue-600 bg-blue-50",
		},
		{
			title: "Other Master Data",
			description:
				"Coming soon: Manage other system-wide data categories.",
			href: "/master-data#",
			icon: Layers,
			color: "text-gray-400 bg-gray-50 bg-opacity-50 grayscale",
			disabled: true,
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Master Data
				</h1>
				<p className="text-muted-foreground text-lg">
					Central repository for system-wide configuration and
					reference data.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{sections.map((section) => (
					<Link
						key={section.title}
						href={section.href}
						className={
							section.disabled ? "pointer-events-none" : undefined
						}
					>
						<Card
							className={`h-full border hover:border-primary transition-all shadow-sm ${section.disabled ? "opacity-60" : "hover:shadow-md cursor-pointer"}`}
						>
							<CardHeader>
								<div
									className={`p-2 rounded-lg w-fit mb-2 ${section.color}`}
								>
									<section.icon className="h-6 w-6" />
								</div>
								<CardTitle>{section.title}</CardTitle>
								<CardDescription>
									{section.description}
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
