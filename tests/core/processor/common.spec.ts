import * as Common from "@/core/processor/common";

describe("Core > Processor > Common", () => {
	describe("extractHeadingId", () => {
		it("should correctly extract the id", () => {
			expect(Common.extractHeadingId("hello world 12")).toEqual({
				cleanText: "hello world 12",
				id: "hello-world-12",
			});

			expect(Common.extractHeadingId("hello world 12 [[#ohno ]]")).toEqual({
				cleanText: "hello world 12",
				id: "ohno",
			});

			expect(
				Common.extractHeadingId("hello world 12 [[ #カタ_カナ２ ]]"),
			).toEqual({
				cleanText: "hello world 12",
				id: "カタ_カナ２",
			});
		});
	});

	describe("slugify", () => {
		it("should work", () => {
			expect(Common.slugify("my super nice 12 string だよな!12")).toBe(
				"my-super-nice-12-string-たよな12",
			);
		});
	});
});
