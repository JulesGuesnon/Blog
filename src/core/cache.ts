import { Context, Effect, Layer } from "effect";

export class Cache extends Context.Tag("App/Cache")<
	Cache,
	{
		get: <T>(key: string) => Effect.Effect<T | undefined, never, never>;
		set: <T>(key: string, value: T) => Effect.Effect<void, never, never>;
	}
>() {}

export const make = () =>
	Layer.effect(
		Cache,
		Effect.gen(function* () {
			const storage = yield* Effect.acquireRelease(
				Effect.succeed(new Map<string, unknown>()),
				(map) =>
					Effect.sync(() => {
						map.clear();
					}),
			);

			return {
				get: <T>(key: string) =>
					Effect.sync(() => storage.get(key) as T | undefined),
				set: (key, value) => Effect.sync(() => storage.set(key, value)),
			};
		}),
	);

// Sort stringify
const replaced = (_: string, value: unknown) => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return (
		Object.keys(value)
			.sort()
			// @ts-expect-error no need to be typed correctly
			// biome-ignore lint/suspicious/noAssignInExpressions: https://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify
			// biome-ignore lint/complexity/noCommaOperator: same than above
			.reduce((obj, key) => ((obj[key] = value[key]), obj), {})
	);
};

export const each = <A, B, E, R>(
	key: string,
	f: (a: A) => Effect.Effect<B, E, R>,
): Effect.Effect<(a: A) => Effect.Effect<B, E, R>, never, Cache> =>
	Effect.gen(function* () {
		const cache = yield* Cache;

		return (a: A) =>
			Effect.gen(function* () {
				const finalKey = `${key}:${JSON.stringify(a, replaced)}`;

				const cacheValue = yield* cache.get(finalKey);

				if (cacheValue) {
					yield* Effect.logDebug(`[Cache] Hit ${finalKey}`);

					return cacheValue as B;
				}

				yield* Effect.logDebug(`[Cache] Miss ${finalKey}`);
				const output = yield* f(a);

				yield* cache.set(finalKey, output);

				return output;
			});
	});

export const all = <B, E, R>(
	key: string,
	e: Effect.Effect<B, E, R>,
): Effect.Effect<Effect.Effect<B, E, R>, never, Cache> =>
	Effect.gen(function* () {
		const cache = yield* Cache;

		return Effect.gen(function* () {
			const cacheValue = yield* cache.get(key);

			if (cacheValue) {
				yield* Effect.logDebug(`[Cache] Hit ${key}`);
				return cacheValue as B;
			}

			yield* Effect.logDebug(`[Cache] Miss ${key}`);
			const output = yield* e;

			yield* cache.set(key, output);

			return output;
		});
	});
