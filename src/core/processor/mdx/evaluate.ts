import * as MdxJs from "@mdx-js/mdx";
import { Effect, Schema as S } from "effect";
import type { MDXModule } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import * as Content from "@/core/content";
import * as Error from "@/core/errors";
import { remarkHeadingIds } from "./plugin";

export const MdxMetadata = Content.Metadata.pipe(S.omit("timeToRead"));

export const EvaluateOutput = S.Struct({
	default: Content.Content.fields.render,
	frontmatter: MdxMetadata,
});

interface MdxModule extends MDXModule {
	frontmatter: typeof MdxMetadata.Encoded;
}

export const evaluate = (str: string) =>
	Effect.try({
		try: () =>
			MdxJs.evaluateSync(str, {
				...runtime,
				remarkPlugins: [
					remarkFrontmatter,
					remarkMdxFrontmatter,
					remarkHeadingIds,
				],
			}) as MdxModule,
		catch: (e) =>
			new Error.FailedToProcessRawContent({
				type: "mdx",
				reason: e instanceof global.Error ? e.toString() : JSON.stringify(e),
			}),
	}).pipe(Effect.andThen(S.decode(EvaluateOutput, { errors: "all" })));
