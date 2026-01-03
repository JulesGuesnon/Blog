const replacer = (_: string, value: unknown) => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return (
		Object.keys(value)
			.sort()
			// @ts-expect-error no need to be typed correctly
			// biome-ignore lint/suspicious/noAssignInExpressions: https://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify
			// biome-ignore lint/complexity/noCommaOperator: same than above
			.reduce((obj, key) => ((obj[key] = value[key]), obj), {})
	);
};

export const sortedStringify = (v: unknown) => JSON.stringify(v, replacer);
