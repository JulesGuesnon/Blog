import { Effect } from "effect";
import * as Cache from "@/core/cache";

describe("Core > Cache", () => {
	it("should work", async () => {
		const storage = new Map();

		const key = "mykey";
		const value = { hello: 1, world: { hello: 1 } };

		const cache = Cache.make(storage);

		await Effect.runPromise(
			Effect.gen(function* () {
				const cache = yield* Cache.Cache;

				const emptyValue = yield* cache.get(key);

				expect(emptyValue).toBeUndefined();

				yield* cache.set(key, value);

				expect(yield* cache.get(key)).toEqual(value);
			}).pipe(Effect.provide(cache), Effect.scoped),
		);

		expect(storage.size).toBe(0);
	});

	describe("each", () => {
		it("should work", async () => {
			const storage = new Map();

			const baseKey = "baseKey";

			const arg1 = "hello1";
			const arg2 = "hello2";

			const impl = (str: string) => `${str} world`;
			const op = vi.fn(impl);

			const cache = Cache.make(storage);

			const cachedFn = Cache.each(baseKey, (str: string) =>
				Effect.succeed(op(str)),
			);

			await Effect.runPromise(
				Effect.gen(function* () {
					const fn = yield* cachedFn;

					expect(yield* fn(arg1)).toBe(impl(arg1));
					expect(yield* fn(arg1)).toBe(impl(arg1));
					expect(yield* fn(arg1)).toBe(impl(arg1));

					expect(yield* fn(arg2)).toBe(impl(arg2));
					expect(yield* fn(arg2)).toBe(impl(arg2));
					expect(yield* fn(arg2)).toBe(impl(arg2));
				}).pipe(Effect.provide(cache), Effect.scoped),
			);

			expect(storage.size).toBe(0);

			expect(op).toHaveBeenCalledTimes(2);

			expect(op.mock.calls.filter(([arg]) => arg === arg1)).toHaveLength(1);

			expect(op.mock.calls.filter(([arg]) => arg === arg2)).toHaveLength(1);
		});
	});

	describe("all", () => {
		it("should work", async () => {
			const storage = new Map();

			const baseKey = "baseKey";

			const out = "out";
			const op = vi.fn(() => out);

			const cache = Cache.make(storage);

			const cachedFn = Cache.all(baseKey, Effect.succeed(op()));

			await Effect.runPromise(
				Effect.gen(function* () {
					const fn = yield* cachedFn;

					expect(yield* fn).toBe(out);
					expect(yield* fn).toBe(out);
					expect(yield* fn).toBe(out);
				}).pipe(Effect.provide(cache), Effect.scoped),
			);

			expect(storage.size).toBe(0);

			expect(op).toHaveBeenCalledTimes(1);
		});
	});
});
