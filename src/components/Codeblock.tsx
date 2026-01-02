import type { ReactElement } from "react";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";

SyntaxHighlighter.registerLanguage("jsx", tsx);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("html", tsx);
SyntaxHighlighter.registerLanguage("js", ts);
SyntaxHighlighter.registerLanguage("javascript", ts);
SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("ts", ts);

type Props = {
	children: ReactElement<{ className?: string; children: string }>;
};

const LANG_RE = /language-(\w+)/;
const getLanguageFromClassname = (className: string) => {
	const match = LANG_RE.exec(className);

	return !match ? undefined : match[1];
};

const BASE_STYLE = {
	'code[class*="language-"]': {
		color: "var(--syntax-text)",
	},
	'pre[class*="language-"]': {
		color: "var(--syntax-text)",
		background: "var(--syntax-base)",
	},
	':not(pre) > code[class*="language-"]': {
		background: "var(--syntax-base)",
	},
	keyword: {
		color: "var(--syntax-mauve)",
	},
	builtin: {
		color: "var(--syntax-red)",
	},
	"class-name": {
		color: "var(--syntax-yellow)",
	},
	function: {
		color: "var(--syntax-blue)",
	},
	boolean: {
		color: "var(--syntax-peach)",
	},
	number: {
		color: "var(--syntax-peach)",
	},
	string: {
		color: "var(--syntax-green)",
	},
	char: {
		color: "var(--syntax-green)",
	},
	symbol: {
		color: "var(--syntax-yellow)",
	},
	regex: {
		color: "var(--syntax-pink)",
	},
	url: {
		color: "var(--syntax-green)",
	},
	operator: {
		color: "var(--syntax-sky)",
	},
	variable: {
		color: "var(--syntax-text)",
	},
	constant: {
		color: "var(--syntax-peach)",
	},
	property: {
		color: "var(--syntax-blue)",
	},
	punctuation: {
		color: "var(--syntax-overlay2)",
	},
	important: {
		color: "var(--syntax-mauve)",
		fontWeight: "bold",
	},
	comment: {
		color: "var(--syntax-overlay2)",
	},
	tag: {
		color: "var(--syntax-blue)",
	},
	"attr-name": {
		color: "var(--syntax-yellow)",
	},
	"attr-value": {
		color: "var(--syntax-green)",
	},
	namespace: {
		color: "var(--syntax-yellow)",
	},
	prolog: {
		color: "var(--syntax-mauve)",
	},
	doctype: {
		color: "var(--syntax-mauve)",
	},
	cdata: {
		color: "var(--syntax-teal)",
	},
	entity: {
		color: "var(--syntax-red)",
	},
	atrule: {
		color: "var(--syntax-mauve)",
	},
	selector: {
		color: "var(--syntax-blue)",
	},
	deleted: {
		color: "var(--syntax-red)",
	},
	inserted: {
		color: "var(--syntax-green)",
	},
	bold: {
		fontWeight: "bold",
	},
	italic: {
		fontStyle: "italic",
	},
};

export const Codeblock = ({ children }: Props) => {
	const lang = getLanguageFromClassname(children.props?.className || "");

	if (!lang) {
		return <pre>{children}</pre>;
	}

	return (
		<SyntaxHighlighter language={lang} style={BASE_STYLE}>
			{children.props.children}
		</SyntaxHighlighter>
	);
};
