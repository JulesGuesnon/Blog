// https://github.com/nodejs/node/blob/05d6b9b5dfba8984a5c600d5e568520aa83ca23c/lib/path.js#L1551C3-L1601C5
export const extname = (path: string) => {
	let startDot = -1;
	let startPart = 0;
	let end = -1;
	let matchedSlash = true;
	// Track the state of characters (if any) we see before our first dot and
	// after any path separator we find
	let preDotState = 0;
	for (let i = path.length - 1; i >= 0; --i) {
		const char = path[i];
		if (char === "/") {
			// If we reached a path separator that was not part of a set of path
			// separators at the end of the string, stop now
			if (!matchedSlash) {
				startPart = i + 1;
				break;
			}
			continue;
		}
		if (end === -1) {
			// We saw the first non-path separator, mark this as the end of our
			// extension
			matchedSlash = false;
			end = i + 1;
		}
		if (char === ".") {
			// If this is our first dot, mark it as the start of our extension
			if (startDot === -1) startDot = i;
			else if (preDotState !== 1) preDotState = 1;
		} else if (startDot !== -1) {
			// We saw a non-dot and non-path separator before our dot, so we should
			// have a good chance at having a non-empty extension
			preDotState = -1;
		}
	}

	if (
		startDot === -1 ||
		end === -1 ||
		// We saw a non-dot character immediately before the dot
		preDotState === 0 ||
		// The (right-most) trimmed path component is exactly '..'
		(preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
	) {
		return "";
	}

	return path.slice(startDot, end);
};

const CHAR_FORWARD_SLASH = "/".charCodeAt(0);

// https://github.com/nodejs/node/blob/05d6b9b5dfba8984a5c600d5e568520aa83ca23c/lib/path.js#L1472
export const basename = (path: string, suffix?: string) => {
	let start = 0;
	let end = -1;
	let matchedSlash = true;

	if (
		suffix !== undefined &&
		suffix.length > 0 &&
		suffix.length <= path.length
	) {
		if (suffix === path) return "";
		let extIdx = suffix.length - 1;
		let firstNonSlashEnd = -1;
		for (let i = path.length - 1; i >= 0; --i) {
			const code = path.charCodeAt(i);

			if (code === CHAR_FORWARD_SLASH) {
				// If we reached a path separator that was not part of a set of path
				// separators at the end of the string, stop now
				if (!matchedSlash) {
					start = i + 1;
					break;
				}
			} else {
				if (firstNonSlashEnd === -1) {
					// We saw the first non-path separator, remember this index in case
					// we need it if the extension ends up not matching
					matchedSlash = false;
					firstNonSlashEnd = i + 1;
				}
				if (extIdx >= 0) {
					// Try to match the explicit extension
					if (code === suffix.charCodeAt(extIdx)) {
						if (--extIdx === -1) {
							// We matched the extension, so mark this as the end of our path
							// component
							end = i;
						}
					} else {
						// Extension does not match, so our result is the entire path
						// component
						extIdx = -1;
						end = firstNonSlashEnd;
					}
				}
			}
		}

		if (start === end) end = firstNonSlashEnd;
		else if (end === -1) end = path.length;
		return path.slice(start, end);
	}
	for (let i = path.length - 1; i >= 0; --i) {
		if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
			// If we reached a path separator that was not part of a set of path
			// separators at the end of the string, stop now
			if (!matchedSlash) {
				start = i + 1;
				break;
			}
		} else if (end === -1) {
			// We saw the first non-path separator, mark this as the end of our
			// path component
			matchedSlash = false;
			end = i + 1;
		}
	}

	if (end === -1) return "";
	return path.slice(start, end);
};
