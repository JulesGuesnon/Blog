import { FileSystem } from "@effect/platform";
import { Context, Effect, Layer, pipe, Schema as S } from "effect";
import * as Cache from "@/core/cache";
import { CONFIG_PATH } from "./common";
import * as Schema from "./schema";

export const get = pipe(
	FileSystem.FileSystem,
	Effect.andThen((fs) => fs.readFileString(CONFIG_PATH)),
	Effect.andThen(S.decode(Schema.SchemaFromJson, { errors: "all" })),
);

const cachedGet = Cache.all("App/Config/Get", get);

export class Config extends Context.Tag("App/Config")<
	Config,
	Schema.Config
>() {}

export const ConfigLive = Layer.effect(
	Config,
	Effect.gen(function* () {
		const fs = yield* FileSystem.FileSystem;
		const get = yield* cachedGet;

		return yield* get.pipe(Effect.provideService(FileSystem.FileSystem, fs));
	}),
);
