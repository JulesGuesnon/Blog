import { Effect, Schema } from "effect";
import * as Error from "@/core/errors";
import { Path } from "@/utils";
import type { Slug } from "./content";

export const Mdx = Schema.Literal("mdx");
export type Mdx = typeof Mdx.Type;

export const Type = Schema.Union(Mdx);
export type Type = typeof Type.Type;

export type RawContent = {
	slug: Slug;
	type: typeof Mdx.Type;
	data: string;
};

export const typeFromPath = (path: string): Effect.Effect<Type, Error.Error> =>
	Effect.gen(function* () {
		const ext = Path.extname(path);

		switch (ext) {
			case ".mdx": {
				return Mdx.literals[0];
			}
		}

		return yield* Effect.fail(new Error.UnknownContentType({ from: ext }));
	});
