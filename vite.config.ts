import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

//import { nitro } from "nitro/vite";

const config = defineConfig({
	plugins: [
		devtools(),
		//nitro(),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		mdx({
			remarkPlugins: [remarkGfm, remarkFrontmatter],
		}),
	],
});

export default config;
