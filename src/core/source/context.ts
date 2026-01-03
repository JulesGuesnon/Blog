import { Context, type Effect } from "effect";
import type { Slug } from "@/core/content";
import type * as Error from "@/core/errors";
import type { RawContent } from "../raw-content";

export class Source extends Context.Tag("App/Source")<
	Source,
	{
		readonly get: (slug: Slug) => Effect.Effect<RawContent, Error.Error>;
		readonly all: () => Effect.Effect<Array<RawContent>, Error.Error>;
	}
>() {}
