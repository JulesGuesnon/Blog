import { createRouter } from "@tanstack/react-router";
import { NotFound } from "./components/NotFound";
import { ServerError } from "./components/ServerError";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultPreload: "intent",
		defaultErrorComponent: (options) => {
			return <ServerError message={options.error.message} />;
		},
		defaultNotFoundComponent: () => {
			return <NotFound />;
		},
	});

	return router;
};
