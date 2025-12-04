"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleRegister() {
		setLoading(true);
		setError(null);

		const res = await authClient.signUp.email({
			name,
			email,
			password,
		});

		if (res.error) {
			const msg = res.error.message || "Registration failed.";

			setError(msg);
			setLoading(false);
			return;
		}

		router.push("/");
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
			<Card className="w-full max-w-sm shadow-lg">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-semibold">
						Create Account
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Name */}
					<div className="space-y-1">
						<Label>Name</Label>
						<Input
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={loading}
						/>
					</div>

					{/* Email */}
					<div className="space-y-1">
						<Label>Email</Label>
						<Input
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
						/>
					</div>

					{/* Password */}
					<div className="space-y-1">
						<Label>Password</Label>
						<Input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
					</div>

					{/* Error Message */}
					{error && <p className="text-sm text-red-600">{error}</p>}

					{/* Register Button */}
					<Button
						className="w-full"
						onClick={handleRegister}
						disabled={loading}
					>
						{loading ? "Creating account..." : "Register"}
					</Button>

					{/* Link to Login */}
					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<a href="/auth/login" className="underline">
							Login
						</a>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
