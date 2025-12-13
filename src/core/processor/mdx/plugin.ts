import type { Heading, Root, Text } from "mdast";
import { toString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { extractHeadingId } from "../common";

export const remarkHeadingIds: Plugin<[], Root> = () => {
	return (tree: Root) => {
		visit(tree, "heading", (node: Heading) => {
			const rawText = toString(node);
			const { id, cleanText } = extractHeadingId(rawText);

			// Update text nodes to remove the marker
			node.children = node.children
				.map((child) => {
					if (child.type !== "text") return child;

					const text = child as Text;
					text.value = cleanText;
					return text.value ? text : null;
				})
				.filter(Boolean) as Heading["children"];

			node.data ??= {};
			node.data.hProperties ??= {};
			node.data.hProperties.id = id;
		});
	};
};
