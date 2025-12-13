import clsx from "clsx";

type Props = {
	text: string;
};
const EMPTY_ARRAY = new Array(2).fill(undefined);

export const AsciiAnimation = ({ text }: Props) => {
	return (
		<div className="marquee">
			<div className="marquee-track-container">
				{EMPTY_ARRAY.map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Never changing
						key={i}
						className="marquee-track"
					>
						<pre
							className={clsx(
								"font-mono text-xl leading-none m-0 pt-1 pb-1 -translate-y-12 bg-bg-light dark:bg-bg-dark",
							)}
						>
							<a
								href="https://patorjk.com/software/taag/#p=display&f=ANSI+Shadow&t=Hello&x=none&v=4&h=4&w=80&we=false"
								target="_blank"
								rel="noreferrer"
								className="decoration-transparent"
							>
								{text}
							</a>
						</pre>
					</div>
				))}
			</div>
		</div>
	);
};
