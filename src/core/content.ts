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

		if (v.includes("../") || v.includes("./"))
			return "Are you trying to attack me?";

		return true;
	}),
	S.brand("Slug"),
);

export type Slug = typeof Slug.Type;

export const CreatedAt = S.transformOrFail(S.String, S.DateTimeZonedFromSelf, {
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

			return yield* DateTime.makeZoned(input.replace(`[${timeZoneStr}]`, ""), {
				adjustForTimeZone: true,
				timeZone,
			}).pipe(
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
});

export const Metadata = S.Struct({
	title: S.String,
	description: S.String,
	createdAt: CreatedAt,
	timeToRead: S.Duration,
	status: S.Union(
		S.Literal("unpublished"),
		S.Literal("published"),
		S.Literal("hidden"),
	).pipe(
		S.optionalWith({
			default: () => "unpublished",
		}),
	),
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

export type SerializedMetadata = {
	createdAt: Date;
	timeToRead: number;
	title: string;
};

export type SerializedContent = {
	slug: Slug;
	metadata: SerializedMetadata;
};

export type Content = typeof Content.Type;

export const serializeMetadata = (metadata: Metadata): SerializedMetadata => {
	const timeToRead = Duration.toMinutes(metadata.timeToRead);

	const createdAt = DateTime.toDateUtc(metadata.createdAt);

	return {
		...metadata,
		createdAt,
		timeToRead,
	};
};

export const serialize = (content: Content): SerializedContent => {
	const { render: _, ...rest } = content;

	return {
		...rest,
		metadata: serializeMetadata(content.metadata),
	};
};
