import { DateTime, Effect, Exit, Option } from "effect";
import * as Evaluate from "@/core/processor/mdx/evaluate";
import * as Fixture from "../../../_fixtures/index.fixture";

describe("Core > Processor > Mdx > Evaluate", () => {
	describe("evaluate", () => {
		it("should work", () => {
			const title = "My title";
			const createdAt = "12/12/2025 12:12";
			const exit = Effect.runSyncExit(
				Evaluate.evaluate(`---
title: ${title} 
createdAt: ${createdAt} 
---`).pipe(Fixture.Config.provide()),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toEqual({
				default: expect.any(Function),
				frontmatter: {
					createdAt: DateTime.makeZoned(createdAt, {
						timeZone: Fixture.Config.TIMEZONE,
						adjustForTimeZone: true,
					}).pipe(Option.getOrThrow),
					title: "My title",
				},
			});
		});

		it("should fail - missing metadata", () => {
			const exit = Effect.runSyncExit(
				Evaluate.evaluate(`---\nmeta: string\n---\n\n# Hello world`).pipe(
					Fixture.Config.provide(),
				),
			);

			expect(Exit.isFailure(exit)).toBeTruthy();

			if (Exit.isSuccess(exit)) {
				throw new Error("Unreachable");
			}

			if (exit.cause._tag !== "Fail") {
				throw new Error("Unreachable");
			}

			expect(
				exit.cause.error.toString(),
			).toEqual(`{ readonly default: { unknown | filter }; readonly frontmatter: { readonly title: string; readonly createdAt: (string <-> DateTimeZonedFromSelf) } }
└─ ["frontmatter"]
   └─ { readonly title: string; readonly createdAt: (string <-> DateTimeZonedFromSelf) }
      ├─ ["title"]
      │  └─ is missing
      └─ ["createdAt"]
         └─ is missing`);
		});

		it("should fail - invalid mdx", () => {
			const exit = Effect.runSyncExit(
				Evaluate.evaluate(`{1#1}`).pipe(Fixture.Config.provide()),
			);

			expect(Exit.isFailure(exit)).toBeTruthy();

			if (Exit.isSuccess(exit)) {
				throw new Error("Unreachable");
			}

			if (exit.cause._tag !== "Fail") {
				throw new Error("Unreachable");
			}

			expect(exit.cause.error).toMatchObject({
				type: "mdx",
				reason: "1:4: Could not parse expression with acorn",
				_tag: "FailedToProcessRawContent",
			});
		});
	});
});
