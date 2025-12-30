import { Effect, Exit } from "effect";
import * as RawContent from "@/core/raw-content";

describe("Core > Raw-Content", () => {
	describe("typeFromPath", () => {
		it("should extract the type successfully", () => {
			const exit = Effect.runSyncExit(
				RawContent.typeFromPath("hello/world/my-nice-path2.mdx"),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toBe(RawContent.Mdx.literals[0]);
		});

		it("should fail to extract the type", () => {
			const exit = Effect.runSyncExit(
				RawContent.typeFromPath("hello/world/my-nice-path2.md"),
			);

			expect(Exit.isFailure(exit)).toBeTruthy();

			if (Exit.isSuccess(exit)) {
				throw new Error("Unreachable");
			}

			if (exit.cause._tag !== "Fail") {
				throw new Error("Unreachable");
			}

			expect(exit.cause.error).toMatchObject({
				_tag: "UnknownContentType",
				from: ".md",
			});
		});
	});
});
