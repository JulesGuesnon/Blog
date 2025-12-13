import type { MDXModule } from "mdx/types";
import { mdxMapper } from "./mapper";

type Props = {
	mdx: MDXModule;
	props?: Record<string, unknown>;
};

export const Page = ({ mdx: Mdx, props }: Props) => {
	return <Mdx.default components={mdxMapper} {...props} />;
};
