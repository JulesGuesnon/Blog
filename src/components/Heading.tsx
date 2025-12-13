import clsx from "clsx";
import { createElement } from "react";
import { Hash } from "./Icons";

export type Props = {
	children: React.ReactNode;
	className?: string;
	id?: string;
	as: `h${1 | 2 | 3 | 4 | 5 | 6}`;
};

export const Heading = (props: Props) => {
	const heading = createElement(
		props.as,
		{
			id: props.id,
			className: clsx("leading-snug", props.className),
		},
		props.children,
	);

	return (
		<div className="group relative">
			{props.as !== "h1" && (
				<a
					href={`#${props.id}`}
					className="transition-opacity duration-100 opacity-0 group-hover:opacity-100 absolute left-0 top-1/2 -translate-y-1/2 translate-x-[calc(-100%-4px)]"
					title="a"
				>
					<Hash />
				</a>
			)}{" "}
			{heading}
		</div>
	);
};
