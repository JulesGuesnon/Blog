type Input = {
	title: string;
	description: string;
};
const makeTwitter = ({ title, description }: Input) => [
	{ name: "twitter:card", content: "summary" },
	{ name: "twitter:title", content: title },
	{ name: "twitter:description", content: description },
];

const makeOg = ({ title, description }: Input) => [
	{ property: "og:title", content: title },
	{ property: "og:description", content: description },
	{ property: "og:type", content: "article" },
];

const makeDescription = ({ description }: Pick<Input, "description">) => [
	{ name: "description", content: description },
];

export const make = (input: Input) => [
	...makeDescription(input),
	...makeOg(input),
	...makeTwitter(input),
];
