import { Layer, Logger, LogLevel, ManagedRuntime, Scope } from "effect";
import * as Cache from "./cache";

Logger.withMinimumLogLevel(LogLevel.fromLiteral("Debug"));

export const make = () => {
	const scope = Layer.effect(Scope.Scope, Scope.make());

	return ManagedRuntime.make(Cache.make().pipe(Layer.provide(scope)));
};

export const RuntimeLive = make();
