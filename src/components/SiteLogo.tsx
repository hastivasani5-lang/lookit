import Image from "next/image";

type SiteLogoSize = "nav" | "auth" | "admin" | "sidebar" | "footer";

type SiteLogoProps = {
	size?: SiteLogoSize;
	priority?: boolean;
	className?: string;
	onDark?: boolean;
};

const sizeClassMap: Record<SiteLogoSize, string> = {
	nav: "h-11 md:h-12",
	auth: "h-16",
	admin: "h-14",
	sidebar: "h-12",
	footer: "h-16",
};

export default function SiteLogo({ size = "nav", priority = false, className = "", onDark = false }: SiteLogoProps) {
	return (
		<div
			className={`inline-flex items-center rounded-md ${sizeClassMap[size]} ${
				onDark ? "bg-white/95 px-2 py-1 ring-1 ring-white/20" : ""
			} ${className}`.trim()}
		>
			<Image
				src="/logo.svg"
				alt="Lookit logo"
				width={260}
				height={64}
				priority={priority}
				sizes="(max-width: 768px) 180px, 260px"
				className="h-full w-auto object-contain"
			/>
		</div>
	);
}
