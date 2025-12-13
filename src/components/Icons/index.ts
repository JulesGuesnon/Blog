import { className as linkClassName } from "../Link";
import type * as ArrowUp from "./ArrowUp";
import type * as Github from "./Github";
import type * as Hash from "./Hash";

export type Icon = typeof Github.ID | typeof ArrowUp.ID | typeof Hash.ID;

export { Icon as ArrowUp } from "./ArrowUp";
export { Icon as Github } from "./Github";
export { Icon as Hash } from "./Hash";

export const styles = {
	a: `${linkClassName} inline-flex items-center`,
};
