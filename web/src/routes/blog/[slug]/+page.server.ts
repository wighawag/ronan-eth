import {imageDimensionsForUrl} from '$lib/server/imageUrl.js';

export const prerender = true;

// Blog post modules, keyed by their virtual path (same glob the posts API uses).
const posts = import.meta.glob('/src/posts/*.md', {eager: true});

/**
 * Provides the intrinsic dimensions of a post's banner image so the page can
 * reserve space for it (no layout shift) and the loading shimmer has a box to
 * fill. Runs only on the server (prerendered), reading the file from `static/`.
 */
export const load = ({params}) => {
	const key = `/src/posts/${params.slug}.md`;
	const mod = posts[key];
	const meta = mod && typeof mod === 'object' ? (mod as any).metadata : null;
	if (!meta || !meta.image) return {};

	const size = imageDimensionsForUrl(meta.image, 'static');
	if (!size) return {};

	return {imageWidth: size.width, imageHeight: size.height};
};
