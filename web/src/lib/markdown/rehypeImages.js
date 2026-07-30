import path from 'node:path';
import {imageDimensionsForUrl} from '../server/imageUrl.js';

/**
 * rehype plugin for mdsvex: enhance every `<img>` that comes out of markdown
 * with:
 *  - intrinsic `width` / `height` (read from the file under `static/`), so the
 *    browser reserves the right amount of space — this both prevents layout
 *    shift and gives our loading shimmer a box to fill;
 *  - `loading="lazy"` and `decoding="async"`, so off-screen post images don't
 *    block the initial load / main thread.
 *
 * External URLs, data: URIs, anchors, etc. are left untouched.
 *
 * The original `src` is preserved (it already resolves correctly relative to
 * the page), so this only *adds* attributes.
 */
export function rehypeImages() {
	return (
		/** @type {any} */ tree,
		/** @type {{path?: string, history?: string[]}} */ file,
	) => {
		const mdPath = file.path || (file.history && file.history[0]);

		let staticDir;
		// mdsvex doesn't expose the markdown file path on the VFile here, so we
		// resolve image URLs against a dummy origin at the posts' route depth
		// (`/blog/<slug>/`). Every post image uses `../../images/...`, which from
		// that depth resolves to `/images/...` — exactly where `static/` is
		// served at the site root. (The origin is just to make `new URL` valid.)
		const slug = mdPath ? path.basename(mdPath).replace(/\.md$/i, '') : 'post';
		const baseUrl = `http://rehype.local/blog/${slug}/`;
		if (mdPath) {
			// <root>/src/posts/<slug>.md  →  <root>
			const postsDir = path.dirname(mdPath); // <root>/src/posts
			const srcDir = path.dirname(postsDir); // <root>/src
			const root = path.dirname(srcDir); // <root>
			staticDir = path.join(root, 'static');
		} else {
			staticDir = path.join(process.cwd(), 'static');
		}

		walk(tree, (node) => {
			if (
				node.type !== 'element' ||
				node.tagName !== 'img' ||
				!node.properties
			) {
				return;
			}
			enhanceImg(node.properties, baseUrl, staticDir);
		});
	};
}

/**
 * @param {{type?: string, children?: any[]}} node
 * @param {(node: any) => void} fn
 */
function walk(node, fn) {
	fn(node);
	if (node && node.children) {
		for (const child of node.children) walk(child, fn);
	}
}

/**
 * @param {Record<string, any>} props
 * @param {string} baseUrl
 * @param {string} staticDir
 */
function enhanceImg(props, baseUrl, staticDir) {
	const src = props.src;
	if (!src || typeof src !== 'string') return;
	if (/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(src)) return;

	let urlPath;
	try {
		urlPath = new URL(src, baseUrl).pathname;
	} catch {
		return;
	}

	const size = imageDimensionsForUrl(urlPath, staticDir);
	if (size) {
		props.width = size.width;
		props.height = size.height;
	}
	// default to the loading state in the rendered HTML so the shimmer shows on
	// first paint (before JS runs) — JS only clears it once the image loads
	if (!props['data-load']) props['data-load'] = 'loading';
	// only set these if the markdown didn't already specify them
	if (!props.loading) props.loading = 'lazy';
	if (!props.decoding) props.decoding = 'async';
}
