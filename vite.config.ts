import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { remarkHeadingIds } from "./src/core/processor/mdx/plugin";

//import { nitro } from "nitro/vite";

const config = defineConfig({
	plugins: [
		devtools(),
		//nitro(),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.build.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		mdx({
			remarkPlugins: [remarkGfm, remarkFrontmatter, remarkHeadingIds],
		}),
	],
	test: {
		globals: true,
		include: ["tests/**/*.spec.ts", "tests/**/*.spec.tsx"],
		coverage: {
			reporter: ["text"],
		},
	},
});

export default config;
