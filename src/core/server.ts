import { BunContext } from "@effect/platform-bun";
import { notFound } from "@tanstack/react-router";
import { Effect } from "effect";
import * as Config from "./config/index.ts";
import * as Error from "./errors";
import { RuntimeLive } from "./runtime";

export const provideServerFn = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
	effect.pipe(
		Effect.provide(Config.ConfigLive),
		Effect.provide(BunContext.layer),
	);

export const runServerFn = async <A>(
	effect: Effect.Effect<A, Error.Error | Error.TanstackError, never>,
): Promise<Error.Serialized<A>> => {
	const outputRes = await effect.pipe(Effect.either, RuntimeLive.runPromise);

	if (Error.isOk(outputRes)) {
		return {
			success: true,
			data: outputRes.right,
		};
	}

	if (outputRes.left._tag !== "TanstackError") {
		return {
			success: false,
			error: Error.formatError(outputRes.left),
		};
	}

	throw notFound();
};
