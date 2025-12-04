"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut(); // Clear session tokens
		router.push("/auth/login"); // Redirect to login
		router.refresh(); // Refresh session state in App Router
	};

	return (
		<Button variant="outline" onClick={handleLogout}>
			Logout
		</Button>
	);
}
