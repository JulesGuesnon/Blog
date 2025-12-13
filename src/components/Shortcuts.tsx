import { useEffect, useRef } from "react";

type Key = {
	key: string;
	shift: boolean;
};

type Sequence = "scrollTop" | "scrollBottom" | "scrollUp" | "scrollDown";

type Identifier = {
	sequence: Sequence;
	checker: (keys: Array<Key>) => boolean;
};

const isScrollBottom = (keys: Array<Key>) => {
	const lastKey = keys[keys.length - 1];

	return lastKey.shift && lastKey.key === "G";
};

const isScrollTop = (keys: Array<Key>) => {
	if (keys.length < 2) return false;

	const lastKey1 = keys[keys.length - 1];
	const lastKey2 = keys[keys.length - 2];

	const hasShift = lastKey1.shift || lastKey2.shift;

	if (hasShift) return false;

	return lastKey1.key === "g" && lastKey2.key === "g";
};

const isScrollUp = (keys: Array<Key>) => {
	const lastKey = keys[keys.length - 1];

	return lastKey.key === "k" && !lastKey.shift;
};

const isScrollDown = (keys: Array<Key>) => {
	const lastKey = keys[keys.length - 1];

	return lastKey.key === "j" && !lastKey.shift;
};

const IDENTIFIERS: Array<Identifier> = [
	{
		sequence: "scrollTop",
		checker: isScrollTop,
	},
	{
		sequence: "scrollBottom",
		checker: isScrollBottom,
	},
	{
		sequence: "scrollUp",
		checker: isScrollUp,
	},
	{
		sequence: "scrollDown",
		checker: isScrollDown,
	},
];

const findSequence = (keys: Array<Key>): Sequence | undefined => {
	for (const identifier of IDENTIFIERS) {
		if (!identifier.checker(keys)) continue;

		return identifier.sequence;
	}
};

const sequenceExecutor = (sequence: Sequence) => {
	switch (sequence) {
		case "scrollTop": {
			window.scrollTo(0, 0);
			break;
		}
		case "scrollBottom": {
			window.scrollTo(0, document.body.scrollHeight);
			break;
		}
		case "scrollDown": {
			window.scrollTo(0, window.scrollY + 20);
			break;
		}
		case "scrollUp": {
			window.scrollTo(0, window.scrollY - 20);
			break;
		}
	}
};

export const Shortcuts = () => {
	const sequenceRef = useRef<Array<Key>>([]);

	useEffect(() => {
		const callback = (e: KeyboardEvent) => {
			sequenceRef.current.push({ key: e.key, shift: e.shiftKey });
			const maybeSequence = findSequence(sequenceRef.current);

			if (maybeSequence) sequenceExecutor(maybeSequence);
		};

		window.addEventListener("keydown", callback);

		return () => {
			window.removeEventListener("keydown", callback);
		};
	}, []);
	return null;
};
