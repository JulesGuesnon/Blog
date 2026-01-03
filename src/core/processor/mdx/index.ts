import { Effect, pipe } from "effect";
import type { Content } from "../../content";
import type { Mdx, RawContent } from "../../raw-content";
import { getTimeToRead } from "../common";
import { evaluate } from "./evaluate";

export const process = (rawMdx: Extract<RawContent, { type: Mdx }>) => {
	return pipe(
		evaluate(rawMdx.data),
		Effect.map(
			(mod) =>
				({
					slug: rawMdx.slug,
					metadata: {
						...mod.frontmatter,
						timeToRead: getTimeToRead(rawMdx.data),
					},
					render: mod.default,
				}) satisfies Content,
		),
	);
};

export const getMetadata = (rawMdx: Extract<RawContent, { type: Mdx }>) => {
	return pipe(
		evaluate(rawMdx.data),
		Effect.map(
			(mod) =>
				({
					...mod.frontmatter,
					timeToRead: getTimeToRead(rawMdx.data),
				}) satisfies Content["metadata"],
		),
	);
};
