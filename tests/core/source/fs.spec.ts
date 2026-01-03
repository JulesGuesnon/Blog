import { Effect, Exit } from "effect";
import type { Brand } from "effect/Brand";
import { Slug } from "@/core/content";
import * as Runtime from "@/core/runtime";
import * as Source from "@/core/source";
import * as Fixture from "../../_fixtures/index.fixture";

const BASE_FOLDER = "folder" as string & Brand<"Path"> & Brand<"Folder">;

const FsSource = Source.fromConfig({ type: "fs", baseFolder: BASE_FOLDER });

describe("Core > Source", () => {
	describe("get", () => {
		it("should get the raw content correctly", async () => {
			const slug = Slug.make("slug");
			const content = "content";

			const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({
				files: new Map([[`${BASE_FOLDER}/${slug}.mdx`, content]]),
			});

			const exit = await Runtime.make().runPromiseExit(
				Effect.gen(function* () {
					const source = yield* Source.Source;

					// To test the cache behaviour
					yield* source.get(slug);
					yield* source.get(slug);

					return yield* source.get(slug);
				}).pipe(Effect.provide(FsSource), provideFs),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toEqual({
				data: content,
				slug: slug,
				type: "mdx",
			});

			expect(fsMocks.readDirectory).toHaveBeenCalledOnce();
			expect(fsMocks.readFileString).toHaveBeenCalledOnce();
		});

		it("should fail to get the raw content", async () => {
			const slug = Slug.make("slug");

			const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({});

			const exit = await Runtime.make().runPromiseExit(
				Effect.gen(function* () {
					const source = yield* Source.Source;

					return yield* source.get(slug);
				}).pipe(Effect.provide(FsSource), provideFs),
			);

			expect(Exit.isFailure(exit)).toBeTruthy();

			if (Exit.isSuccess(exit)) {
				throw new Error("Unreachable");
			}

			if (exit.cause._tag !== "Fail") {
				throw new Error("Unreachable");
			}

			expect(exit.cause.error).toMatchObject({
				slug,
				_tag: "MissingContent",
			});

			expect(fsMocks.readDirectory).toHaveBeenCalledOnce();
			expect(fsMocks.readFileString).toHaveBeenCalledTimes(0);
		});
	});

	describe("all", () => {
		it("should get all the content", async () => {
			const slug1 = Slug.make("slug1");
			const slug2 = Slug.make("slug2");
			const slug3 = Slug.make("slug3");
			const content = "content";

			const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({
				files: new Map([
					[`${BASE_FOLDER}/${slug1}.mdx`, content],
					[`${BASE_FOLDER}/${slug2}.mdx`, content],
					[`${BASE_FOLDER}/${slug3}.mdx`, content],
				]),
			});

			const exit = await Runtime.make().runPromiseExit(
				Effect.gen(function* () {
					const source = yield* Source.Source;

					// To test the cache behaviour
					yield* source.all();
					yield* source.all();

					return yield* source.all();
				}).pipe(Effect.provide(FsSource), provideFs),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toHaveLength(3);
			expect(exit.value[0]).toEqual({
				data: content,
				slug: slug1,
				type: "mdx",
			});

			expect(exit.value[1]).toEqual({
				data: content,
				slug: slug2,
				type: "mdx",
			});

			expect(exit.value[2]).toEqual({
				data: content,
				slug: slug3,
				type: "mdx",
			});

			expect(fsMocks.readDirectory).toHaveBeenCalledOnce();
			expect(fsMocks.readFileString).toHaveBeenCalledTimes(3);
		});
	});
});
