import { Code } from "../Code";
import { Codeblock } from "../Codeblock";
import { Heading, type Props as HeadingProps } from "../Heading";

export const mdxMapper = {
	pre: Codeblock,
	code: Code,
	h1: (props: Omit<HeadingProps, "as">) => <Heading as="h1" {...props} />,
	h2: (props: Omit<HeadingProps, "as">) => <Heading as="h2" {...props} />,
	h3: (props: Omit<HeadingProps, "as">) => <Heading as="h3" {...props} />,
	h4: (props: Omit<HeadingProps, "as">) => <Heading as="h4" {...props} />,
	h5: (props: Omit<HeadingProps, "as">) => <Heading as="h5" {...props} />,
	h6: (props: Omit<HeadingProps, "as">) => <Heading as="h6" {...props} />,
};
