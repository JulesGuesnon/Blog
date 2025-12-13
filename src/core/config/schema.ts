import { type Brand, DateTime, Option, Schema as S } from "effect";
import { Folder, Path } from "../common/schemas";

const SourceType = S.Literal("fs");

export const FsSource = S.Struct({
	type: SourceType,
	baseFolder: Folder,
});

export type FsSource = typeof FsSource.Type;

const Source = S.Union(FsSource);

export type Source = typeof Source.Type;

const Time = S.Struct({
	timezone: S.TimeZone,
});

export const Schema = S.Struct({
	$schema: Path,
	source: Source,
	time: Time,
});

export type Config = typeof Schema.Type;

export type Serialized = typeof Schema.Encoded;

export const SchemaFromJson = S.parseJson(Schema);

export const serialize = (config: Config): Serialized => ({
	...config,
	time: {
		...config.time,
		timezone: DateTime.zoneToString(config.time.timezone),
	},
});

export const deserialize = (config: Serialized): Config => {
	return {
		...config,
		$schema: config.$schema as string & Brand.Brand<"Path">,
		source: {
			type: config.source.type,
			baseFolder: config.source.baseFolder as string &
				Brand.Brand<"Path"> &
				Brand.Brand<"Folder">,
		},
		time: {
			...config,
			timezone: Option.getOrThrow(
				DateTime.zoneFromString(config.time.timezone),
			),
		},
	};
};
