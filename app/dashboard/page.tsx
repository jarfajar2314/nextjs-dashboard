// inside dashboard/page.tsx
import { LogoutButton } from "@/components/logout-button";

export default function DashboardPage() {
	return (
		<div className="p-6">
			<div className="flex justify-between">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<LogoutButton />
			</div>
		</div>
	);
}
