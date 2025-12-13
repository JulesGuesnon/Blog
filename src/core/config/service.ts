import { FileSystem } from "@effect/platform";
import { Context, Effect, Layer, pipe, Schema as S } from "effect";
import { CONFIG_PATH } from "./common";
import * as Schema from "./schema";

export const get = Effect.runSync(
	Effect.cached(
		pipe(
			FileSystem.FileSystem,
			Effect.andThen((fs) => fs.readFileString(CONFIG_PATH)),
			Effect.andThen(S.decode(Schema.SchemaFromJson)),
		),
	),
);

export class Config extends Context.Tag("Config")<Config, Schema.Config>() {}

export const ConfigLive = Layer.effect(
	Config,
	Effect.gen(function* () {
		const fs = yield* FileSystem.FileSystem;

		return yield* get.pipe(Effect.provideService(FileSystem.FileSystem, fs));
	}),
);
