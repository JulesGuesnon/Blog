import clsx from "clsx";
import { className } from "./Link";

export const Footer = () => {
	return (
		<footer className="w-full p-8 text-zinc-400 dark:text-zinc-600">
			<div className="max-w-prose mx-auto space-x-4">
				<a
					href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
					target="_blank"
					rel="noreferrer"
					className={clsx(className, "block md:inline")}
				>
					CC BY-NC-SA 4.0
				</a>
				<span>2025-{new Date().getFullYear()} © Jules Guesnon</span>
			</div>
		</footer>
	);
};
