import type { RawContent } from "../raw-content";
import * as Mdx from "./mdx";

export { extractHeadingId } from "./common";

export const process = (rawContent: RawContent) => {
	switch (rawContent.type) {
		case "mdx": {
			return Mdx.process(rawContent);
		}
	}
};

export const getMetadata = (rawContent: RawContent) => {
	switch (rawContent.type) {
		case "mdx": {
			return Mdx.getMetadata(rawContent);
		}
	}
};
