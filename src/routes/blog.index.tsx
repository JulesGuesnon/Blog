import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Effect, pipe } from "effect";
import { Link } from "@/components/Link";
import { ServerError } from "@/components/ServerError";
import * as Content from "@/core/content";
import * as Processor from "@/core/processor";
import * as Server from "@/core/server";
import * as Source from "@/core/source";

export const effect = pipe(
	Source.getDefault,
	Effect.andThen((source) => source.all()),
	Effect.andThen((contents) =>
		Effect.forEach(
			contents,
			(content) =>
				Processor.process(content).pipe(
					Effect.map(({ metadata }) => Content.serializeMetadata(metadata)),
				),
			{ concurrency: "unbounded" },
		),
	),
);

export const loadData = createServerFn({ method: "GET" }).handler(() =>
	pipe(effect, Server.provideServerFn, Server.runServerFn),
);

export const Route = createFileRoute("/blog/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Blog - Jules Guesnon",
			},
		],
	}),
	loader: () => loadData(),
});

const formatter = new Intl.DateTimeFormat("ja", {
	month: "short",
	day: "2-digit",
});

function RouteComponent() {
	const data = Route.useLoaderData();

	if (!data.success) {
		return <ServerError message={data.error} />;
	}

	return (
		<main className="max-w-prose m-auto flex flex-col items-center md:pt-16">
			<div className="self-start prose dark:prose-invert prose-zinc">
				<h1 className="">Blog</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-[1fr_max-content_max-content] gap-x-4 gap-y-4 mt-12 w-full">
				{data.data.map((entry, i) => {
					return (
						<Link
							key={i.toString()}
							to="/blog/$slug"
							params={{ slug: "article" }}
							className="grid grid-cols-subgrid col-span-3"
							overrideClassName="text-zinc-800 dark:text-zinc-100 group"
						>
							<span className="col-span-full md:col-span-1 text-lg opacity-80 group-hover:opacity-100 transition-opacity text-ellipsis min-w-0 overflow-hidden whitespace-nowra">
								{entry.title}
							</span>
							<span className="mt-1 col-span-1 md:mt-0 text-sm content-center opacity-60 group-hover:opacity-90 transition-opacity">
								{formatter.format(new Date(entry.createdAt))}
							</span>
							<span className="mt-1 col-span-1  md:mt-0 text-sm content-center opacity-60 group-hover:opacity-90 transition-opacity">
								{entry.timeToRead}min
							</span>
						</Link>
					);
				})}
			</div>
		</main>
	);
}
