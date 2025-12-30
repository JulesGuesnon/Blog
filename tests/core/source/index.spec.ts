import { Effect } from "effect";
import * as Source from "@/core/source";
import * as Fixture from "../../_fixtures/index.fixture";

describe("Core > Source", () => {
	describe("getDefault", () => {
		it("should get the source correctly", async () => {
			const { provide: provideFs } = Fixture.Fs.make();

			const out = Effect.runSync(
				Source.getDefault.pipe(provideFs, Fixture.Config.provide()),
			);

			expect(out).toBeDefined();
		});
	});
});
