import { DateTime, Effect, Option } from "effect";
import type { Brand } from "effect/Brand";
import { Path } from "@/core/common/schemas";
import * as Config from "@/core/config";

export const TIMEZONE = "Asia/Tokyo";

export const BASE_FOLDER = "folder" as string & Brand<"Path"> & Brand<"Folder">;
export const make = (override: Partial<Config.Config> = {}): Config.Config => ({
	$schema: Path.make("./path"),
	time: {
		timezone: DateTime.zoneFromString(TIMEZONE).pipe(Option.getOrThrow),
	},
	source: {
		type: "fs",
		baseFolder: BASE_FOLDER,
	},
	...override,
});

export const provide = (override: Partial<Config.Config> = {}) =>
	Effect.provideService(Config.Config, make(override));
