import { Effect, Exit } from "effect";
import { CONFIG_PATH } from "@/core/config/common";
import { serialize } from "@/core/config/schema";
import * as Service from "@/core/config/service";
import * as Runtime from "@/core/runtime";
import * as Fixture from "../../_fixtures/index.fixture";

describe("Core > Config > Service", () => {
	it("should correctly get the config", async () => {
		const config = Fixture.Config.make();
		const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({
			files: new Map([
				[CONFIG_PATH, JSON.stringify(serialize(config))],
				// So that FS can find an existing folder
				[`${Fixture.Config.BASE_FOLDER}/hello`, ""],
			]),
		});

		const exit = await Runtime.make().runPromiseExit(
			Effect.gen(function* () {
				// Testing cache behaviour
				yield* Service.Config;
				yield* Service.Config;

				return yield* Service.Config;
			}).pipe(Effect.provide(Service.ConfigLive), provideFs),
		);

		expect(Exit.isSuccess(exit)).toBeTruthy();

		if (Exit.isFailure(exit)) {
			throw new Error("Unreachable");
		}

		expect(exit.value).toEqual(config);

		expect(fsMocks.readFileString).toHaveBeenCalledOnce();
		expect(fsMocks.exists).toHaveBeenCalledOnce();
		expect(fsMocks.stat).toHaveBeenCalledOnce();
	});

	it("should fail to get the config - file does not exists", async () => {
		const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({});

		const exit = await Runtime.make().runPromiseExit(
			Service.get.pipe(Effect.provide(Service.ConfigLive), provideFs),
		);

		expect(Exit.isFailure(exit)).toBeTruthy();

		if (Exit.isSuccess(exit)) {
			throw new Error("Unreachable");
		}

		if (exit.cause._tag !== "Fail") {
			throw new Error("Unreachable");
		}

		expect(exit.cause.error).toMatchObject({
			reason: "NotFound",
			module: "FileSystem",
			method: "readFileString(./config.json)",
			_tag: "SystemError",
		});

		expect(fsMocks.readFileString).toHaveBeenCalledTimes(1);
		expect(fsMocks.exists).toHaveBeenCalledTimes(0);
		expect(fsMocks.stat).toHaveBeenCalledTimes(0);
	});

	it("should fail to get the config - schema validation", async () => {
		const { provide: provideFs, mocks: fsMocks } = Fixture.Fs.make({
			files: new Map([
				[CONFIG_PATH, JSON.stringify({ hello: "world" })],
				// So that FS can find an existing folder
				[`${Fixture.Config.BASE_FOLDER}/hello`, ""],
			]),
		});

		const exit = await Runtime.make().runPromiseExit(
			Service.get.pipe(Effect.provide(Service.ConfigLive), provideFs),
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
		).toBe(`(parseJson <-> { readonly $schema: string & Brand<"Path">; readonly source: { readonly type: "fs"; readonly baseFolder: (string <-> string & Brand<"Path"> & Brand<"Folder">) }; readonly time: { readonly timezone: TimeZone } })
└─ Type side transformation failure
   └─ { readonly $schema: string & Brand<"Path">; readonly source: { readonly type: "fs"; readonly baseFolder: (string <-> string & Brand<"Path"> & Brand<"Folder">) }; readonly time: { readonly timezone: TimeZone } }
      ├─ ["$schema"]
      │  └─ is missing
      ├─ ["source"]
      │  └─ is missing
      └─ ["time"]
         └─ is missing`);

		expect(fsMocks.readFileString).toHaveBeenCalledTimes(1);
		expect(fsMocks.exists).toHaveBeenCalledTimes(0);
		expect(fsMocks.stat).toHaveBeenCalledTimes(0);
	});
});
