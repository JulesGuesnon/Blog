import type { Props } from "./_common";

export const ID = "arrow-up";

export const Icon = (props: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1.2rem"
		height="1.2rem"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={props.className}
	>
		<title>Arrow up</title>
		<line x1="12" y1="19" x2="12" y2="5"></line>
		<polyline points="5 12 12 5 19 12"></polyline>
	</svg>
);
