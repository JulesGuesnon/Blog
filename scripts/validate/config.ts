import { FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Console, Effect, Either, ParseResult, Schema as S } from "effect";
import { Config } from "../../src/core";

const PATH = "./config.json";

const program = FileSystem.FileSystem.pipe(
	Effect.andThen((fs) => fs.readFileString(PATH)),
	Effect.andThen(
		S.decode(Config.SchemaFromJson, {
			onExcessProperty: "error",
			errors: "all",
		}),
	),
	Effect.map((v) => Either.right(v)),
	Effect.catchAll((e) => {
		if (e._tag !== "ParseError")
			return Effect.succeed(Either.left(e.toString()));

		return ParseResult.TreeFormatter.formatError(e).pipe(
			Effect.andThen(Either.left),
		);
	}),
	Effect.andThen((e) => {
		return Either.match(e, {
			onLeft: Console.error,
			onRight: (_) => Console.log("Configuration is valid ✅"),
		});
	}),
);

BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)));
