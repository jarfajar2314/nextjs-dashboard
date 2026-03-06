import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Master Data | SPC Dashboard",
	description: "Manage system master data and configurations.",
};

export default function MasterDataLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="px-2 lg:px-4 lg:pt-6">{children}</div>;
}
