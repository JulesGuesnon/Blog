import * as Schema from "@/core/config/schema";
import * as Fixture from "../../_fixtures/index.fixture";

describe("Core > Config > Schema", () => {
	describe("serialize", () => {
		it("should work", () => {
			const output = Schema.serialize(Fixture.Config.make());

			expect(output).toEqual({
				$schema: "./path",
				source: {
					baseFolder: "folder",
					type: "fs",
				},
				time: {
					timezone: "Asia/Tokyo",
				},
			});
		});
	});

	describe("deserialize", () => {
		it("should work", () => {
			const output = Schema.deserialize({
				$schema: "./path",
				source: {
					baseFolder: "folder",
					type: "fs",
				},
				time: {
					timezone: "Asia/Tokyo",
				},
			});

			expect(output).toEqual(Fixture.Config.make());
		});
	});
});
