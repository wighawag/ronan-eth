import path from 'node:path';
import {imageSizeFromFile} from './imageSize.js';

/**
 * Resolve a site URL (e.g. `/images/blog/foo.png`) to its file under `static/`
 * and return the intrinsic image dimensions, if readable.
 *
 * `staticDir` is the absolute path to the project's `static/` directory; we
 * fall back to `<cwd>/static` if the primary path doesn't exist (covers
 * different preprocessor working directories).
 *
 * @param {string | undefined | null} urlPath
 * @param {string} staticDir
 * @returns {{width: number, height: number} | null}
 */
export function imageDimensionsForUrl(urlPath, staticDir) {
	if (!urlPath || typeof urlPath !== 'string') return null;
	// only map absolute, same-origin site URLs (skip `//cdn`, `https://`, `data:`, `#`, etc.)
	if (!urlPath.startsWith('/') || urlPath.startsWith('//')) return null;

	const primary = path.join(staticDir, urlPath);
	let size = imageSizeFromFile(primary);
	if (!size) {
		size = imageSizeFromFile(path.join(process.cwd(), 'static', urlPath));
	}
	return size;
}
