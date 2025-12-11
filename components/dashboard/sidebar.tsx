"use client";

import { useSidebar } from "./sidebar-context";
import {
	LayoutDashboard,
	Settings,
	RocketIcon,
	User,
	ChevronDown,
	ChevronRight,
	UserCircle,
	ShieldCheck,
	Palette,
	CreditCard,
} from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const menu = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{
		name: "Admin",
		href: "/admin",
		icon: ShieldCheck,
		children: [
			{ name: "Users", href: "/users", icon: User },
			{ name: "Roles", href: "/admin/roles", icon: UserCircle },
			{
				name: "Permissions",
				href: "/admin/permissions",
				icon: ShieldCheck,
			},
		],
	},
	{
		name: "Settings",
		href: "/settings",
		icon: Settings,
		children: [
			{ name: "Profile", href: "/settings/profile", icon: UserCircle },
			{
				name: "Account Security",
				href: "/settings/security",
				icon: ShieldCheck,
			},
			{ name: "Appearance", href: "/settings/appearance", icon: Palette },
			{ name: "Billing", href: "/settings/billing", icon: CreditCard },
		],
	},
];

export function Sidebar() {
	const { collapsed, setCollapsed } = useSidebar();
	const sidebarRef = useRef<HTMLDivElement | null>(null);
	const pathname = usePathname();

	function isActive(href: string) {
		return pathname === href || pathname.startsWith(href + "/");
	}

	// Manage which accordion is open
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	// Auto-expand menu based on URL
	useEffect(() => {
		const parent = menu.find((m) =>
			m.children?.some((c) => pathname.startsWith(c.href))
		);

		const openMenu = (parent: { href: SetStateAction<string | null> }) => {
			if (parent) setOpenMenu(parent.href);
		};

		if (parent) {
			openMenu(parent);
		}
	}, [pathname]);

	// Close on mobile
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			const sidebar = sidebarRef.current;
			const isMobile = window.innerWidth < 768;
			if (
				isMobile &&
				sidebar &&
				!sidebar.contains(e.target as Node) &&
				!collapsed
			) {
				setCollapsed(true);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [collapsed, setCollapsed]);

	return (
		<div
			ref={sidebarRef}
			className={`
				flex flex-col border-r bg-white dark:bg-neutral-900
				fixed md:static z-50
				transition-all duration-300 ease-in-out
				${collapsed ? "w-20" : "w-64"}
				${collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
				left-0 top-0
				h-dvh md:h-screen
				min-h-0
				overflow-hidden
    `}
		>
			{/* HEADER */}
			<nav className="px-2">
				<div className="flex items-center min-h-16 gap-3 px-6 py-2 rounded-md text-sm">
					<RocketIcon size={24} className="shrink-0" />

					<span
						className={`
              font-bold text-lg whitespace-nowrap overflow-hidden
              transition-all duration-300
              ${collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"}
            `}
					>
						Dashboard
					</span>
				</div>
			</nav>

			{/* MENU */}
			<nav className="flex-1 overflow-y-auto min-h-0 px-2 space-y-1 mt-3">
				{menu.map((m) => {
					const Icon = m.icon;

					// --------------------
					// MENU WITH CHILDREN
					// --------------------
					if (m.children) {
						const menuOpen = openMenu === m.href;

						return (
							<div key={m.href}>
								<button
									onClick={() =>
										setOpenMenu(menuOpen ? null : m.href)
									}
									className={`
                    w-full flex items-center gap-3 px-6 py-2 rounded-md text-sm
                    transition-all duration-300
                    ${
						isActive(m.href)
							? "bg-muted text-primary font-medium"
							: "text-muted-foreground hover:bg-muted"
					}
                  `}
								>
									<Icon size={18} className="shrink-0" />

									<span
										className={`
                      whitespace-nowrap overflow-hidden transition-all duration-300
                      ${
							collapsed
								? "opacity-0 max-w-0"
								: "opacity-100 max-w-[200px]"
						}
                    `}
									>
										{m.name}
									</span>

									{!collapsed && (
										<span className="ml-auto">
											{menuOpen ? (
												<ChevronDown size={16} />
											) : (
												<ChevronRight size={16} />
											)}
										</span>
									)}
								</button>

								{/* SUBMENU */}
								{!collapsed && (
									<div
										className={`
                      overflow-hidden transition-all duration-300 ml-10
                      ${menuOpen ? "max-h-96" : "max-h-0"}
                    `}
									>
										{m.children.map((sub) => {
											const SubIcon = sub.icon;

											return (
												<Link
													key={sub.href}
													href={sub.href}
													className={`
                            flex items-center gap-2 px-4 py-2 rounded-md text-sm
                            ${
								isActive(sub.href)
									? "text-primary font-medium"
									: "text-muted-foreground hover:bg-muted"
							}
                          `}
												>
													<SubIcon
														size={15}
														className="shrink-0"
													/>
													{sub.name}
												</Link>
											);
										})}
									</div>
								)}
							</div>
						);
					}

					// --------------------
					// NORMAL MENU ITEM
					// --------------------
					return (
						<Link
							key={m.href}
							href={m.href}
							className={`
                flex items-center gap-3 px-6 py-2 rounded-md text-sm hover:bg-muted
                transition-all duration-300
                ${
					isActive(m.href)
						? "bg-muted text-primary font-medium"
						: "text-muted-foreground hover:bg-muted"
				}
                relative
              `}
						>
							{isActive(m.href) && (
								<span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-full" />
							)}

							<Icon size={18} className="shrink-0" />

							<span
								className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${
						collapsed
							? "opacity-0 max-w-0"
							: "opacity-100 max-w-[200px]"
					}
                `}
							>
								{m.name}
							</span>
						</Link>
					);
				})}
			</nav>

			{/* FOOTER */}
			<div className="p-4 border-t shrink-0">
				{collapsed ? <LogoutButton iconOnly /> : <LogoutButton />}
			</div>
		</div>
	);
}
