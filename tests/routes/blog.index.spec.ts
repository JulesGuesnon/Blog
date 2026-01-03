import { Exit } from "effect";
import * as Runtime from "@/core/runtime";
import * as BlogIndex from "@/routes/blog.index";
import * as Fixture from "../_fixtures/index.fixture";

describe("Routes > Blog.Index", () => {
	describe("effect", () => {
		it("should work", async () => {
			const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({
				files: new Map([
					[`${Fixture.Config.BASE_FOLDER}/hello.mdx`, Fixture.Content.MDX1.str],
					[
						`${Fixture.Config.BASE_FOLDER}/hello-2.mdx`,
						Fixture.Content.MDX2.str,
					],
				]),
			});

			const exit = await Runtime.make().runPromiseExit(
				BlogIndex.effect.pipe(provideFs, Fixture.Config.provide()),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toEqual([
				{
					createdAt: new Date(Fixture.Content.MDX1.metadata.createdAt),
					timeToRead: 1,
					title: Fixture.Content.MDX1.metadata.title,
				},
				{
					createdAt: new Date("2025-12-12T11:12:00.000Z"),
					timeToRead: 1,
					title: Fixture.Content.MDX2.metadata.title,
				},
			]);

			expect(fsMocks.readDirectory).toHaveBeenCalledOnce();
			expect(fsMocks.readFileString).toHaveBeenCalledTimes(2);
		});
	});
});
