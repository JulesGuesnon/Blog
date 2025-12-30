import type { Root } from "mdast";
import * as Plugin from "@/core/processor/mdx/plugin";

describe("Core > Processor > Mdx > Plugin", () => {
	describe("remarkHeadingIds", () => {
		it("should work - no syntax", () => {
			const tree: Root = {
				type: "root",
				children: [
					{
						type: "heading",
						depth: 1,
						children: [
							{
								type: "text",
								value: "Hello ",
							},
							{
								type: "emphasis",
								children: [
									{
										type: "text",
										value: "world",
									},
								],
							},
						],
					},
				],
			};

			Plugin.remarkHeadingIds()(tree);

			expect(tree).toEqual({
				type: "root",
				children: [
					{
						type: "heading",
						depth: 1,
						data: {
							hProperties: {
								id: "hello-world",
							},
						},
						children: [
							{
								type: "text",
								value: "Hello ",
							},
							{
								type: "emphasis",
								children: [
									{
										type: "text",
										value: "world",
									},
								],
							},
						],
					},
				],
			});
		});

		it("should work - custom syntax", () => {
			const tree: Root = {
				type: "root",
				children: [
					{
						type: "heading",
						depth: 1,
						children: [
							{
								type: "text",
								value: "Hello ",
							},
							{
								type: "emphasis",
								children: [
									{
										type: "text",
										value: "world [[ #id ]]",
									},
								],
							},
						],
					},
				],
			};

			Plugin.remarkHeadingIds()(tree);

			expect(tree).toEqual({
				type: "root",
				children: [
					{
						type: "heading",
						depth: 1,
						data: {
							hProperties: {
								id: "id",
							},
						},
						children: [
							{
								type: "text",
								value: "Hello ",
							},
							{
								type: "emphasis",
								children: [
									{
										type: "text",
										value: "world ",
									},
								],
							},
						],
					},
				],
			});
		});
	});
});
