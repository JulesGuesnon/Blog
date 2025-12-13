import type { FileSystem } from "@effect/platform";
import type { PlatformError } from "@effect/platform/Error";
import type { NotFoundError } from "@tanstack/react-router";
import { ParseResult } from "effect";
import { TaggedError } from "effect/Data";
import * as Either from "effect/Either";
import type { ParseError } from "effect/ParseResult";
import type * as RawContent from "./raw-content";

export class TanstackError extends TaggedError("TanstackError")<{
	e: NotFoundError;
}> {}

export class PathDoesNotExist extends TaggedError("PathDoesNotExist")<{
	path: string;
}> {}

export class InvalidPathType extends TaggedError("InvalidPathType")<{
	path: string;
	found: FileSystem.File.Type;
	expected: FileSystem.File.Type;
}> {}

export class BaseFolderDoesNotExist extends TaggedError(
	"BaseFolderDoesNotExist",
)<{ path: string }> {}

export class MissingContent extends TaggedError("MissingContent")<{
	slug: string;
}> {}

export class UnknownContentType extends TaggedError("UnknownContentType")<{
	from: string;
}> {}

export class FailedToProcessRawContent extends TaggedError(
	"FailedToProcessRawContent",
)<{
	type: RawContent.Type;
	reason: string;
}> {}

export type Error =
	| MissingContent
	| InvalidPathType
	| PathDoesNotExist
	| UnknownContentType
	| PlatformError
	| FailedToProcessRawContent
	| ParseError;

export type Result<O, E = Error> = Either.Either<O, E>;

export const formatError = (e: Error) => {
	switch (e._tag) {
		case "MissingContent": {
			return `Could not find any content with the slug: ${e.slug}`;
		}
		case "InvalidPathType": {
			return `The provided path "${e.path}" is a ${e.found}, but expected a ${e.expected}`;
		}
		case "PathDoesNotExist": {
			return `The provided path "${e.path}" does not exist`;
		}
		case "UnknownContentType": {
			return `Could not identify content from the following data: ${e.from}`;
		}
		case "SystemError":
		case "BadArgument": {
			return e.toString();
		}
		case "FailedToProcessRawContent": {
			return `Failed to process content of type "${e.type}". Reason:\n${e.reason}`;
		}
		case "ParseError": {
			return ParseResult.TreeFormatter.formatErrorSync(e);
		}
	}
};

export const ok = Either.right;

export const isOk = Either.isRight;

export const err = <I = never>(e: Error) => Either.left(e) as Result<I>;

export const isErr = Either.isLeft;

export type Serialized<O> =
	| {
			success: true;
			data: O;
	  }
	| {
			success: false;
			error: string;
	  };

export const toSerializable = <O, E extends Error>(
	e: Result<O, E>,
): Serialized<O> =>
	Either.map(e, (o) => ({ success: true as const, data: o })).pipe(
		Either.getOrElse((e) => ({
			success: false as const,
			error: formatError(e),
		})),
	);
