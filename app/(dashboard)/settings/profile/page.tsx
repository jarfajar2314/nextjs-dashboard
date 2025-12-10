"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";

export default function ProfilePage() {
	const [loadingProfile, setLoadingProfile] = useState(false);
	const [loadingPassword, setLoadingPassword] = useState(false);
	const [profileLoaded, setProfileLoaded] = useState(false);

	// Editable user fields
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [initialEmail, setInitialEmail] = useState("");

	// Password fields
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// ------------------------------
	// Load user profile on mount
	// ------------------------------
	useEffect(() => {
		async function loadUser() {
			const { data } = await authClient.getSession();

			if (!data?.user) return;

			setName(data.user.name || "");
			setEmail(data.user.email || "");
			setInitialEmail(data.user.email || "");

			setProfileLoaded(true);
		}

		loadUser();
	}, []);

	// ------------------------------
	// Update Profile Information
	// ------------------------------
	async function handleUpdateProfile() {
		setLoadingProfile(true);

		try {
			if (email !== initialEmail) {
				const emailRes = await authClient.changeEmail({
					newEmail: email,
					callbackURL: "/settings/profile",
				});

				if (emailRes.error) {
					toast.error(
						emailRes.error.message || "Failed to update email."
					);
				} else {
					// If verification is required, show a success message
					// toast.success(
					// 	"Email verification sent. Please check your inbox."
					// );

					// When without verification
					toast.success("Email updated successfully.");
					setInitialEmail(email); // Update initial email to reflect the change
				}
			}

			const res = await authClient.updateUser({
				name,
			});

			if (res.error) {
				toast.error(res.error.message || "Failed to update profile.");
			} else {
				toast.success("Profile updated successfully.");
			}
		} catch (err) {
			toast.error("Unexpected error while updating profile.");
			console.error("Error", err);
		} finally {
			setLoadingProfile(false);
		}
	}

	// ------------------------------
	// Update Password
	// ------------------------------
	async function handlePasswordChange() {
		if (!currentPassword || !newPassword) {
			toast.error("Please fill all password fields.");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		setLoadingPassword(true);

		try {
			const res = await authClient.changePassword({
				newPassword,
				currentPassword,
				revokeOtherSessions: true,
			});

			if (res.error) {
				toast.error(res.error.message || "Failed to update password.");
			} else {
				toast.success("Password updated successfully.");

				// reset fields
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}
		} catch (err) {
			toast.error("Unexpected error while updating password.");
			console.error("Error", err);
		} finally {
			setLoadingPassword(false);
		}
	}

	if (!profileLoaded) {
		return <ProfileSkeleton />;
	}

	return (
		<div className="space-y-8">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Profile</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences.
					</p>
				</div>
			</header>

			{/* Profile Information */}
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your name and email address.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label className="mb-2 md:mb-3">Name</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div>
						<Label className="mb-2 md:mb-3">Email</Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<Button
						onClick={handleUpdateProfile}
						disabled={loadingProfile}
					>
						{loadingProfile ? "Saving..." : "Save Changes"}
					</Button>
				</CardContent>
			</Card>

			{/* Password Section */}
			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>
						Ensure your account is secure by using a strong
						password.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label className="mb-2 md:mb-3">Current Password</Label>
						<PasswordInput
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
					</div>

					<div>
						<Label className="mb-2 md:mb-3">New Password</Label>
						<PasswordInput
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>

					<div>
						<Label className="mb-2 md:mb-3">
							Confirm New Password
						</Label>
						<PasswordInput
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>

					<Button
						variant="default"
						onClick={handlePasswordChange}
						disabled={loadingPassword}
					>
						{loadingPassword ? "Updating..." : "Update Password"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
