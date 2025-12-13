import {
	DateTime,
	Duration,
	Effect,
	Option,
	ParseResult,
	Schema as S,
} from "effect";
import type { MDXContent } from "mdx/types";
import { Config } from "./config";

export const ContentType = S.Literal("mdx");

export type ContentType = typeof ContentType.Type;

export const Slug = S.Lowercase.pipe(
	S.filter((v) => {
		if (v.includes(" ")) return "A slug cannot contain spaces";

		return true;
	}),
	S.brand("Slug"),
);

export type Slug = typeof Slug.Type;

export const Metadata = S.Struct({
	title: S.String,
	createdAt: S.transformOrFail(S.String, S.DateTimeZonedFromSelf, {
		strict: true,
		decode: (input, _opt, ast) =>
			Effect.gen(function* () {
				const config = yield* Config;

				const defaultTimezone = config.time.timezone;

				const timeZone = DateTime.makeZonedFromString(input).pipe(
					Option.map((v) => v.zone),
					Option.getOrElse(() => defaultTimezone),
				);

				const timeZoneStr = DateTime.zoneToString(timeZone);

				return yield* DateTime.makeZoned(
					input.replace(`[${timeZoneStr}]`, ""),
					{
						adjustForTimeZone: true,
						timeZone,
					},
				).pipe(
					Option.match({
						onNone: () =>
							ParseResult.fail(
								new ParseResult.Type(
									ast,
									input,
									"Failed to convert input to a timed date",
								),
							),
						onSome: (zoned) => ParseResult.succeed(zoned),
					}),
				);
			}),
		encode: (input) => ParseResult.succeed(DateTime.formatIsoZoned(input)),
	}),
	timeToRead: S.Duration,
});

export type Metadata = typeof Metadata.Type;

export const Content = S.Struct({
	slug: Slug,
	metadata: Metadata,
	render: S.Unknown.pipe(
		S.filter((value): value is MDXContent => typeof value === "function", {
			message: () => "Expected a function",
		}),
	),
});

type SerializedMetadata = {
	createdAt: Date;
	timeToRead: number;
	title: string;
};

type SerializedContent = {
	slug: Slug;
	metadata: SerializedMetadata;
	rendered: string;
};

export type Content = typeof Content.Type;

export const serializeMetadata = (metadata: Metadata): SerializedMetadata => {
	const timeToRead = Duration.toMinutes(metadata.timeToRead);

	const createdAt = DateTime.toDate(metadata.createdAt);

	return {
		...metadata,
		createdAt,
		timeToRead,
	};
};

export const serialize = (
	content: Content,
	rendered: string,
): SerializedContent => {
	const { render: _, ...rest } = content;

	return {
		...rest,
		metadata: serializeMetadata(content.metadata),
		rendered,
	};
};
