import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NotFound } from "@/components/NotFound";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { ServerError } from "@/components/ServerError";
import { Shortcuts } from "@/components/Shortcuts";
import appCss from "../styles.css?url";
import { Seo } from "@/utils";

export const Route = createRootRoute({
	head: () => {
		return {
			meta: [
				{
					charSet: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					title: "Jules Guesnon",
				},
				...Seo.make({
					title: "Jules Guesnon",
					description: "Yet, another website",
				}),
			],
			links: [
				{
					rel: "preload",
					as: "style",
					href: appCss,
				},
				{
					rel: "stylesheet",
					href: appCss,
				},
			],
		};
	},
	shellComponent: RootDocument,
	errorComponent: (options) => {
		return <ServerError message={options.error.message} />;
	},
	notFoundComponent: () => {
		return <NotFound />;
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<style>{`
.initial-loading {
  opacity: 0;
  transition: opacity 0.1s ease-in;
}
`}</style>
				<HeadContent />
			</head>
			<body
				className={
					"bg-bg-light text-zinc-800 dark:bg-bg-dark dark:text-zinc-200"
				}
			>
				<Shortcuts />
				<div className="min-h-screen grid grid-rows-[max-content_1fr_max-content]">
					<Header />
					<div className="flex-grow initial-loading px-8 md:px-0">
						{children}
					</div>
					<ScrollTopButton />
					<Footer />
				</div>
				<Scripts />
				<script src="/loaded.js"></script>
			</body>
		</html>
	);
}
