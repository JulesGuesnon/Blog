import { notFound } from "@tanstack/react-router";
import { Effect } from "effect";
import { formatError, TanstackError, UnknownContentType } from "@/core/errors";
import * as Server from "@/core/server";

describe("Core > Server", () => {
	describe("runServerFn", () => {
		it("should convert the effect into an either and serialize it - success", async () => {
			const input = 1;
			const output = await Server.runServerFn(Effect.succeed(input));

			expect(output.success).toBeTruthy();

			if (!output.success) {
				throw new Error("unreachable");
			}

			expect(output.data).toBe(input);
		});

		it("should convert the effect into an either and serialize it - failure", async () => {
			const error = new UnknownContentType({ from: ".md" });
			const output = await Server.runServerFn(Effect.fail(error));

			expect(output.success).toBeFalsy();

			if (output.success) {
				throw new Error("unreachable");
			}

			expect(output.error).toBe(formatError(error));
		});

		it("should handle correctly tanstack errors", async () => {
			await expect(() =>
				Server.runServerFn(Effect.fail(new TanstackError({ e: notFound() }))),
			).rejects.toThrow();
		});
	});
});
