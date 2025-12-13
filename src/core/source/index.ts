import { Effect, pipe } from "effect";
import * as Config from "../config/index.ts";
import { Source } from "./context";
import { makeFsSource } from "./fs";

export { Source } from "./context";

export const fromConfig = (v: Config.Source) => {
	switch (v.type) {
		case "fs": {
			return makeFsSource(v);
		}
	}
};

export const getDefault = pipe(
	Config.Config,
	Effect.andThen((config) =>
		Effect.gen(function* () {
			return yield* Source;
		}).pipe(Effect.provide(fromConfig(config.source))),
	),
);

export const getFromConfig = (config: Config.Config) =>
	pipe(Source, Effect.provide(fromConfig(config.source)));
