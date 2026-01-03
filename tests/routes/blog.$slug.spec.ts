import { notFound } from "@tanstack/react-router";
import { Exit } from "effect";
import * as Config from "@/core/config";
import { Slug } from "@/core/content";
import * as Runtime from "@/core/runtime";
import * as BlogSlug from "@/routes/blog.$slug";
import * as Fixture from "../_fixtures/index.fixture";

describe("Routes > Blog.$Slug", () => {
	describe("effect", () => {
		it("should work", async () => {
			const slug = Slug.make("my-slug");
			const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({
				files: new Map([
					[
						`${Fixture.Config.BASE_FOLDER}/${slug}.mdx`,
						Fixture.Content.MDX1.str,
					],
				]),
			});

			const exit = await Runtime.make().runPromiseExit(
				BlogSlug.effect(slug).pipe(provideFs, Fixture.Config.provide()),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toEqual({
				config: Config.serialize(Fixture.Config.make()),
				rawContent: {
					slug,
					type: "mdx",
					data: Fixture.Content.MDX1.str,
				},
			});

			expect(fsMocks.readDirectory).toHaveBeenCalledOnce();
			expect(fsMocks.readFileString).toHaveBeenCalledTimes(1);
		});

		it("should return the error", async () => {
			const slug = Slug.make("my-slug");
			const { provide: provideFs } = Fixture.Fs.make({
				files: new Map([
					[
						`${Fixture.Config.BASE_FOLDER}/${slug}.mdx`,
						Fixture.Content.MDX1.str,
					],
				]),
			});

			const exit = await Runtime.make().runPromiseExit(
				// @ts-expect-error test purpose
				BlogSlug.effect(slug).pipe(provideFs),
			);

			expect(Exit.isFailure(exit)).toBeTruthy();

			if (Exit.isSuccess(exit)) {
				throw new Error("Unreachable");
			}

			if (exit.cause._tag !== "Die") {
				throw new Error("Unreachable");
			}

			expect((exit.cause.defect as Error).message).toContain(
				"Service not found: App/Config",
			);
		});

		it("should return the tanstack not found error", async () => {
			const slug = Slug.make("my-slug");
			const { provide: provideFs } = Fixture.Fs.make({});

			const exit = await Runtime.make().runPromiseExit(
				BlogSlug.effect(slug).pipe(provideFs, Fixture.Config.provide()),
			);

			expect(Exit.isFailure(exit)).toBeTruthy();

			if (Exit.isSuccess(exit)) {
				throw new Error("Unreachable");
			}

			if (exit.cause._tag !== "Fail") {
				throw new Error("Unreachable");
			}

			expect(exit.cause.error).toMatchObject({
				_tag: "TanstackError",
				e: notFound(),
			});
		});
	});
});
