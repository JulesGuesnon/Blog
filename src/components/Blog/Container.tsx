import { clsx } from "clsx";

type Props = {
	children: React.ReactNode;
	className?: string;
};

export const Container = ({ children, className }: Props) => (
	<main
		className={clsx(
			"prose dark:prose-invert prose-zinc m-auto md:pt-16",
			className,
		)}
	>
		{children}
	</main>
);
