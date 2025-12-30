import { FileSystem } from "@effect/platform";
import { SystemError } from "@effect/platform/Error";
import { Size } from "@effect/platform/FileSystem";
import { Effect, Option } from "effect";

export const make = ({
	files = new Map(),
}: {
	files?: Map<string, string>;
} = {}) => {
	const readFileString = vi.fn();
	const readDirectory = vi.fn();
	const exists = vi.fn();
	const stat = vi.fn();

	const impl = FileSystem.layerNoop({
		readDirectory: (path, options) => {
			readDirectory(path, options);

			return Effect.succeed(
				[...files.keys()]
					.filter((p) => p.startsWith(path))
					.map((p) => p.replace(`${path}${path.endsWith("/") ? "" : "/"}`, "")),
			);
		},
		readFileString: (path, encoding) => {
			readFileString(path, encoding);

			const file = files.get(path);

			if (file) return Effect.succeed(file);

			return Effect.fail(
				new SystemError({
					reason: "NotFound",
					module: "FileSystem",
					method: `readFileString(${path})`,
				}),
			);
		},
		exists: (path) => {
			exists(path);

			for (const p of files.keys()) {
				if (p === path || p.startsWith(path)) return Effect.succeed(true);
			}

			return Effect.succeed(false);
		},
		stat: (path) => {
			stat(path);

			const common = {
				mtime: Option.none(),
				atime: Option.none(),
				birthtime: Option.none(),
				dev: 0,
				ino: Option.none(),
				mode: 0,
				nlink: Option.none(),
				uid: Option.none(),
				gid: Option.none(),
				rdev: Option.none(),
				size: Size(1),
				blksize: Option.none(),
				blocks: Option.none(),
			};

			for (const p of files.keys()) {
				if (p === path)
					return Effect.succeed({
						...common,
						type: "File",
					});
			}

			for (const p of files.keys()) {
				if (p.startsWith(path))
					return Effect.succeed({
						...common,
						type: "Directory",
					});
			}

			return Effect.fail(
				new SystemError({
					reason: "NotFound",
					module: "FileSystem",
					method: `stat(${path})`,
				}),
			);
		},
	});

	return {
		provide: Effect.provide(impl),
		mocks: {
			readFileString,
			readDirectory,
			exists,
			stat,
		},
	};
};
