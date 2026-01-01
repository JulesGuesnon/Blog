import { Effect, pipe } from "effect";
import * as Config from "../config";
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
	Effect.andThen((config) => getFromConfig(config)),
);

export const getFromConfig = (config: Config.Config) =>
	pipe(Source, Effect.provide(fromConfig(config.source)));
