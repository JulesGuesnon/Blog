import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Effect, pipe, Schema as S } from "effect";
import * as Blog from "@/components/Blog";
import { Heading } from "@/components/Heading";
import { Link } from "@/components/Link";
import { ServerError } from "@/components/ServerError";
import { Content, type RawContent, Server } from "@/core";
// Importing from core results into an error
import * as Config from "@/core/config";
import * as Error from "@/core/errors";
import * as Processor from "@/core/processor";
import * as Source from "@/core/source";

export const effect = (slug: Content.Slug) =>
	pipe(
		Source.getDefault,
		Effect.andThen((source) => source.get(slug)),
		Effect.zip(Config.Config),
		Effect.map(([rawContent, config]) => {
			return {
				rawContent,
				config: Config.serialize(config),
			} satisfies GetContentOutput;
		}),
		Effect.mapError((e) => {
			if (e._tag !== "MissingContent") return e;

			return new Error.TanstackError({
				e: notFound(),
			});
		}),
	);

const GetFileContentValidator = S.Struct({
	slug: Content.Slug,
});

type GetContentOutput = {
	rawContent: RawContent.RawContent;
	config: Config.Serialized;
};

export const loadData = createServerFn({ method: "GET" })
	.inputValidator(S.decodeSync(GetFileContentValidator))
	.handler((input) =>
		pipe(effect(input.data.slug), Server.provideServerFn, Server.runServerFn),
	);

const outputToContent = (output: GetContentOutput) =>
	Processor.process(output.rawContent).pipe(
		Effect.provideService(Config.Config, Config.deserialize(output.config)),
	);

export const Route = createFileRoute("/blog/$slug")({
	component: RouteComponent,
	loader: (ctx) => loadData({ data: { slug: ctx.params.slug } }),
	head: async ({ loaderData, match }) => {
		if (!loaderData || !loaderData.success) return {};

		const content = await Effect.runPromise(outputToContent(loaderData.data));

		const isNotFound = match.status === "notFound";

		return {
			meta: [
				{
					title: `${isNotFound ? "Not found" : content.metadata.title} - Jules Guesnon`,
				},
			],
		};
	},
});

const Slug = ({ content }: { content: Content.Content }) => {
	const h1Data = Processor.extractHeadingId(content.metadata.title);
	return (
		<>
			<Heading as="h1" id={h1Data.id}>
				{h1Data.cleanText}
			</Heading>
			<Blog.Page
				mdx={{ default: content.render }}
				props={{ slug: content.slug }}
			/>
			<hr />
			<Link to="..">Back to all posts</Link>
		</>
	);
};

function RouteComponent() {
	const data = Route.useLoaderData();

	if (!data.success) {
		return <ServerError message={data.error} />;
	}

	const content = Effect.runSync(outputToContent(data.data));

	return (
		<Blog.Container>
			<Slug content={content} />
		</Blog.Container>
	);
}
