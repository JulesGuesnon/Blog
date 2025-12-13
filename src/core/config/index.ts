import type * as Schema from "./schema.ts";
import * as Service from "./service.ts";

export {
	deserialize,
	type FsSource,
	Schema,
	SchemaFromJson,
	type Serialized,
	type Source,
	serialize,
} from "./schema.ts";
export { ConfigLive } from "./service";

export type Config = Schema.Config;

export const Config = Service.Config;
