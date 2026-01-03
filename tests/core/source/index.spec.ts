import * as Runtime from "@/core/runtime";
import * as Source from "@/core/source";
import * as Fixture from "../../_fixtures/index.fixture";

describe("Core > Source", () => {
	describe("getDefault", () => {
		it("should get the source correctly", async () => {
			const { provide: provideFs } = Fixture.Fs.make();

			const out = Runtime.make().runSync(
				Source.getDefault.pipe(provideFs, Fixture.Config.provide()),
			);

			expect(out).toBeDefined();
		});
	});
});
