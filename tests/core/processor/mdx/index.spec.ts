import { DateTime, Duration, Effect, Exit, Option } from "effect";
import { Slug } from "@/core/content";
import * as Index from "@/core/processor/mdx/index";
import * as Fixture from "../../../_fixtures/index.fixture";

describe("Core > Processor > Mdx > Index", () => {
	describe("process", () => {
		it("should work and map correctly the data", () => {
			const slug = Slug.make("slug");
			const title = "My title";
			const createdAt = "12/12/2025 12:12";

			const exit = Effect.runSyncExit(
				Index.process({
					slug,
					type: "mdx",
					data: `---
title: ${title} 
createdAt: ${createdAt} 
---`,
				}).pipe(Fixture.Config.provide()),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toEqual({
				slug,
				render: expect.any(Function),
				metadata: {
					createdAt: DateTime.makeZoned(createdAt, {
						timeZone: Fixture.Config.TIMEZONE,
						adjustForTimeZone: true,
					}).pipe(Option.getOrThrow),
					title: "My title",
					timeToRead: Duration.minutes(1),
				},
			});
		});
	});
});
