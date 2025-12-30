import type { Heading, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import { cleanIdSyntax, extractHeadingId } from "../common";

const cleanNodes = (nodes: Heading["children"]): Heading["children"] =>
	nodes.map((node) => {
		if ("children" in node) {
			node.children = cleanNodes(node.children);
		}

		if ("value" in node) {
			node.value = cleanIdSyntax(node.value);
		}

		return node;
	}) as Heading["children"];

export const remarkHeadingIds = () => {
	return (tree: Root) => {
		visit(tree, "heading", (node: Heading) => {
			const rawText = toString(node);
			const { id } = extractHeadingId(rawText);

			node.children = cleanNodes(node.children) as Heading["children"];

			node.data ??= {};
			node.data.hProperties ??= {};
			node.data.hProperties.id = id;
		});
	};
};
