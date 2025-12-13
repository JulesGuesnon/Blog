import { createFileRoute } from "@tanstack/react-router";
import * as Blog from "@/components/Blog";
import * as Home from "../content/home.mdx";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<Blog.Container>
			<Blog.Page mdx={Home} />
		</Blog.Container>
	);
}
