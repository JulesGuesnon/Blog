import { type LinkProps, Link as TanstackLink } from "@tanstack/react-router";

type Props = LinkProps & { className?: string; overrideClassName?: string };

export const className =
	"text-zinc-800 opacity-60 hover:opacity-100 dark:text-zinc-100 transition-opacity";

export const Link = (props: Props) => {
	const { overrideClassName, ...rest } = props;
	return (
		<TanstackLink
			{...rest}
			className={`${overrideClassName ?? className} ${props.className ?? ""}`}
		/>
	);
};
