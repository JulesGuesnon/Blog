import { FileSystem } from "@effect/platform";
import { PlatformError } from "@effect/platform/Error";
import { Effect, ParseResult, Schema as S } from "effect";
import * as Error from "../errors";

export const Path = S.String.pipe(S.brand("Path"));

export const Folder = S.transformOrFail(
	S.String,
	Path.pipe(S.brand("Folder")),
	{
		strict: true,
		decode: (path, _o, ast) =>
			FileSystem.FileSystem.pipe(
				Effect.andThen((fs) =>
					Effect.gen(function* () {
						const doesExist = yield* fs.exists(path);

						if (!doesExist)
							return yield* Effect.fail(new Error.PathDoesNotExist({ path }));

						const stat = yield* fs.stat(path);

						const isDirectory = stat.type === "Directory";

						if (!isDirectory) {
							return yield* Effect.fail(
								new Error.InvalidPathType({
									path,
									expected: "Directory",
									found: stat.type,
								}),
							);
						}

						return path;
					}),
				),
				Effect.mapError(
					(e) =>
						new ParseResult.Type(
							ast,
							path,
							S.is(PlatformError)(e) ? e.toString() : Error.formatError(e),
						),
				),
			),
		encode: (value) => Effect.succeed(value),
	},
);
