import * as Icons from "./Icons";
import { Link } from "./Link";

export const Header = () => {
	return (
		<nav className="w-full p-8 grid grid-cols-[auto_max-content]">
			<div className="m-auto" />
			<div className="m-auto grid gap-4 grid-flow-col">
				<Link to="/">Home</Link>
				<Link to="/blog">Blog</Link>
				<a
					href="https://github.com/JulesGuesnon"
					target="_blank"
					rel="noreferrer"
					className={Icons.styles.a}
				>
					<Icons.Github className="align-bottom" />
				</a>
			</div>
		</nav>
	);
};
