import { Slug } from "@/core/content";
import * as Index from "@/core/processor/index";

const { mdxProcessMock } = vi.hoisted(() => ({ mdxProcessMock: vi.fn() }));

vi.mock("../../../src/core/processor/mdx/index", async (importActual) => {
	const mod =
		await importActual<
			typeof import("../../../src/core/processor/mdx/index")
		>();
	return {
		...mod,
		process: mdxProcessMock,
	};
});

describe("Core > Processor > Index", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("process", () => {
		it("should call the correct function", () => {
			Index.process({ type: "mdx", data: "", slug: Slug.make("a") });

			expect(mdxProcessMock).toHaveBeenCalledOnce();
		});
	});
});
