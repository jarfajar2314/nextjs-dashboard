import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const h = await headers();

	const headerObj: Record<string, string> = {};
	h.forEach((value, key) => (headerObj[key] = value));

	const session = await auth.api.getSession({
		headers: headerObj,
	});

	if (!session) {
		redirect("/auth/login");
	}

	return <div className="min-h-screen bg-background">{children}</div>;
}
