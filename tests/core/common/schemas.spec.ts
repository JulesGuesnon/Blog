import { Effect, Exit, Schema } from "effect";
import * as Schemas from "@/core/common/schemas";
import * as Fixture from "../../_fixtures/index.fixture";

describe("Core > Common > Schemas", () => {
	describe("Folder", () => {
		it("should correctly validate the folder", async () => {
			const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({
				files: new Map([[`${Fixture.Config.BASE_FOLDER}/hello`, ""]]),
			});

			const exit = await Effect.runPromiseExit(
				Schema.decode(Schemas.Folder)(Fixture.Config.BASE_FOLDER).pipe(
					provideFs,
				),
			);

			expect(Exit.isSuccess(exit)).toBeTruthy();

			if (Exit.isFailure(exit)) {
				throw new Error("Unreachable");
			}

			expect(exit.value).toEqual(Fixture.Config.BASE_FOLDER);

			expect(fsMocks.exists).toHaveBeenCalledOnce();
			expect(fsMocks.stat).toHaveBeenCalledOnce();
		});

		it("should fail - folder doesn't exist", async () => {
			const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({});

			const exit = await Effect.runPromiseExit(
				Schema.decode(Schemas.Folder)(Fixture.Config.BASE_FOLDER).pipe(
					provideFs,
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
			).toBe(`(string <-> string & Brand<"Path"> & Brand<"Folder">)
└─ Transformation process failure
   └─ The provided path "folder" does not exist`);

			expect(fsMocks.exists).toHaveBeenCalledOnce();
			expect(fsMocks.stat).toHaveBeenCalledTimes(0);
		});
	});
});
