import { useEffect, useState } from "react";
import * as Icons from "./Icons";

const THRESHOLD = 60;

export const ScrollTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const callback = () => {
			const currentScroll = window.scrollY;

			if (currentScroll < THRESHOLD && isVisible) {
				setIsVisible(false);
				return;
			}

			if (currentScroll > THRESHOLD && !isVisible) {
				setIsVisible(true);
			}
		};
		callback();

		window.addEventListener("scroll", callback);

		return () => {
			window.removeEventListener("scroll", callback);
		};
	}, [isVisible]);

	return (
		<button
			className={`${isVisible ? "opacity-80" : "opacity-0"} fixed right-8 bottom-8 bg-zinc-800 hover:opacity-100 rounded-full z-10 cursor-pointer p-[0.5rem] transition-opacity`}
			type="button"
			onClick={() => {
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: "smooth",
				});
			}}
		>
			<Icons.ArrowUp />
		</button>
	);
};
