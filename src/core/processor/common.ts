import { Duration } from "effect";

export const AVG_WPM = 200;

export const getTimeToRead = (content: string) => {
	const wordCount = content.split(" ").length;

	return Duration.minutes(Math.ceil(wordCount / AVG_WPM));
};

export const CUSTOM_ID_RE = /\[\[\s*#([^\]]+?)\s*\]\]/u;

export interface HeadingIdResult {
	id: string;
	cleanText: string;
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.normalize("NFKD")
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.replace(/\s+/gu, "-");
}

export function extractHeadingId(rawText: string): HeadingIdResult {
	const match = rawText.match(CUSTOM_ID_RE);

	if (match) {
		return {
			id: match[1],
			cleanText: rawText.replace(match[0], "").trim(),
		};
	}

	return {
		id: slugify(rawText),
		cleanText: rawText,
	};
}

export const cleanIdSyntax = (str: string) => str.replace(CUSTOM_ID_RE, "");
