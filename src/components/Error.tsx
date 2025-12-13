import type { LinkProps } from "@tanstack/react-router";
import { AsciiAnimation } from "./AsciiAnimation";
import * as Blog from "./Blog";
import { Link } from "./Link";

type Props = {
	title: string;
	description: string;
	asciiArt: string;
	link: {
		text: string;
		to: Exclude<LinkProps["to"], undefined>;
	};
};

export const Error = ({ title, description, asciiArt, link }: Props) => {
	return (
		<Blog.Container className="h-full grid grid-rows-[max-content_max-content_1fr_max-content]">
			<h1>{title}</h1>
			<p>{description}</p>
			<AsciiAnimation text={asciiArt} />
			<Link to={link.to}>{link.text}</Link>
		</Blog.Container>
	);
};
