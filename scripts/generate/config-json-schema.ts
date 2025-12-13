import { FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect, JSONSchema } from "effect";
import { Config } from "../../src/core";

const PATH = "./config.schema.json";

const ConfigJsonSchema = JSONSchema.make(Config.Schema);

const program = FileSystem.FileSystem.pipe(
	Effect.andThen((fs) =>
		fs.writeFileString(PATH, JSON.stringify(ConfigJsonSchema, null, 2)),
	),
);

BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)));
