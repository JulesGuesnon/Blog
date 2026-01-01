import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { remarkHeadingIds } from "./src/core/processor/mdx/plugin";

const config = defineConfig({
	plugins: [
		devtools(),
		viteTsConfigPaths({
			projects: ["./tsconfig.build.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		mdx({
			remarkPlugins: [remarkGfm, remarkFrontmatter, remarkHeadingIds],
		}),
		nitro({ preset: "bun" }),
	],
	test: {
		globals: true,
		include: ["tests/**/*.spec.ts", "tests/**/*.spec.tsx"],
		coverage: {
			reporter: ["text"],
		},
	},
	nitro: {
		vercel: {
			functions: {
				runtime: "bun1.x",
			},
		},
	},
});

export default config;
