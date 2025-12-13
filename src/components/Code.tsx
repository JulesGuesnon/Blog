type Props = {
	className?: string;
	children: React.ReactElement;
} & { [k: string]: unknown };

export const Code = ({ className, children, ...props }: Props) => {
	const isInline = !className?.startsWith("language-");

	if (isInline) {
		return (
			<code className="inline-code" {...props}>
				{children}
			</code>
		);
	}

	return (
		<code className={className} {...props}>
			{children}
		</code>
	);
};
