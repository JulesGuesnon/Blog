import { FileSystem } from "@effect/platform";
import { Data, Effect, Layer } from "effect";
import type * as Config from "@/core/config";
import * as Error from "@/core/errors";
import * as Cache from "@/core/cache";
import * as RawContent from "@/core/raw-content";
import { Path } from "@/utils";
import { Slug } from "../content";
import { Source } from "./context";

const listFiles = (fs: FileSystem.FileSystem, basePath: string) =>
	fs.readDirectory(basePath, { recursive: true });

const scopedReadFile = (
	fs: FileSystem.FileSystem,
	basePath: string,
	path: string,
) => fs.readFileString(`${basePath}/${path}`);

type CommonInput = { baseFolder: string };

const cachedGet = Cache.each(
	"App/Source/Fs/Get",
	({ baseFolder, slug }: { slug: Slug } & CommonInput) =>
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem;

			yield* Effect.logDebug(`[Source][Fs] Get ${slug}`);

			const allFiles = yield* listFiles(fs, baseFolder).pipe(
				Effect.mapError((_e) => new Error.MissingContent({ slug })),
			);

			const filePath = allFiles.find((p) => Path.basename(p).startsWith(slug));

			if (!filePath) {
				return yield* Effect.fail(new Error.MissingContent({ slug }));
			}

			const type = yield* RawContent.typeFromPath(filePath);

			const data = yield* scopedReadFile(fs, baseFolder, filePath);

			return { type, data, slug };
		}),
);

const cachedAll = Cache.each(
	"App/Source/Fs/All",
	({ baseFolder }: CommonInput) =>
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem;

			const allFiles = yield* listFiles(fs, baseFolder).pipe(
				Effect.mapError((_e) => new Error.MissingContent({ slug: "a" })),
			);

			const [errors, successes] = yield* Effect.partition(allFiles, (path) =>
				Effect.gen(function* () {
					const type = yield* RawContent.typeFromPath(path);

					const data = yield* scopedReadFile(fs, baseFolder, path);

					const slug = Slug.make(Path.basename(path, Path.extname(path)));

					return { type, data, slug };
				}),
			);

			if (errors.length > 0) {
				const errorsStr = errors.map(Error.formatError).join("\n");

				yield* Effect.logError(
					`[Source][Fs] Multiple errors occured in all:\n${errorsStr}`,
				);
			}

			return successes;
		}),
);

export const makeFsSource = ({ baseFolder }: Config.FsSource) =>
	Layer.effect(
		Source,
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem;

			const get = yield* cachedGet;
			const all = yield* cachedAll;

			return {
				get: (slug) =>
					get(Data.struct({ baseFolder, slug })).pipe(
						Effect.provideService(FileSystem.FileSystem, fs),
					),
				all: () =>
					all(Data.struct({ baseFolder })).pipe(
						Effect.provideService(FileSystem.FileSystem, fs),
					),
			};
		}),
	);
