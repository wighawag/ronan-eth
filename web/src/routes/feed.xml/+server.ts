import {statSync} from 'node:fs';
import {join} from 'node:path';
import type {Post} from '$lib/types';
import {name, description, canonicalURL} from '../../web-config.json';

export const prerender = true;

const host = canonicalURL.endsWith('/')
	? canonicalURL.slice(0, -1)
	: canonicalURL;

/**
 * Everything interpolated into the feed goes through this. A single `&` or `<`
 * in a post title is enough to produce a feed no reader will parse.
 */
function escapeXML(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// The mdsvex modules expose `metadata`; the raw sources are globbed separately
// so a post with no explicit `description` can still fall back to an excerpt.
const modules = import.meta.glob('/src/posts/*.md', {eager: true});
const sources = import.meta.glob('/src/posts/*.md', {
	eager: true,
	query: '?raw',
	import: 'default',
}) as Record<string, string>;

const MAX_EXCERPT_LENGTH = 320;

/**
 * Best-effort prose summary of a markdown body: the first real paragraph,
 * stripped of markup. Only used when a post declares no `description`.
 */
function excerptFrom(source: string) {
	const body = source
		// frontmatter
		.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
		// html comments (some posts park alternative intros in them)
		.replace(/<!--[\s\S]*?-->/g, '')
		// fenced code
		.replace(/```[\s\S]*?```/g, '')
		// vitepress container markers, keeping the prose inside
		.replace(/^:::.*$/gm, '');

	for (const block of body.split(/\r?\n\s*\r?\n/)) {
		const paragraph = block
			.split(/\r?\n/)
			// headings, images, block quotes, list items and raw html lines are
			// structure rather than the summary we want
			.filter((line) => !/^\s*(#|!\[|>|[-*+]\s|\d+\.\s|<)/.test(line))
			.join(' ')
			.trim();

		if (!paragraph) continue;

		const text = paragraph
			// images before links, so the leftover `!` does not survive
			.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
			.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
			.replace(/<[^>]+>/g, '')
			.replace(/[*_`]/g, '')
			.replace(/\s+/g, ' ')
			.trim();

		if (!text) continue;

		if (text.length <= MAX_EXCERPT_LENGTH) return text;
		const cut = text.slice(0, MAX_EXCERPT_LENGTH);
		const lastSpace = cut.lastIndexOf(' ');
		return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
	}

	return '';
}

const MIME_TYPES: Record<string, string> = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.svg': 'image/svg+xml',
};

/**
 * RSS requires a byte `length` on an enclosure, so an image only makes it into
 * the feed if we can stat it in `static/`. Animated gifs are swapped for their
 * png sibling when one exists (mirroring the blog index), since the gifs here
 * run to megabytes and a feed reader would download every one of them.
 */
function enclosureFor(image: string | undefined) {
	if (!image || !image.startsWith('/')) return undefined;

	const candidates = image.endsWith('.gif')
		? [`${image.slice(0, -4)}.png`, image]
		: [image];

	for (const candidate of candidates) {
		const extension = candidate.slice(candidate.lastIndexOf('.')).toLowerCase();
		const type = MIME_TYPES[extension];
		if (!type) continue;
		try {
			const {size} = statSync(join(process.cwd(), 'static', candidate));
			if (size > 0) return {url: `${host}${candidate}`, length: size, type};
		} catch {
			// not on disk; try the next candidate
		}
	}

	return undefined;
}

function getPosts() {
	const posts: Post[] = [];

	for (const path in modules) {
		const file = modules[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = {...metadata, slug} satisfies Post;
			if (post.published !== false) {
				posts.push({
					...post,
					description:
						post.description?.trim() ||
						excerptFrom(sources[path] ?? '') ||
						post.title,
				});
			}
		}
	}

	return posts.sort(
		(first, second) =>
			new Date(second.date).getTime() - new Date(first.date).getTime(),
	);
}

const render = (posts: Post[]) => {
	// Deliberately the newest post date rather than the build time: the site is
	// published to IPFS, and a timestamp here would change the content hash on
	// every rebuild even when nothing was written.
	const lastBuildDate = posts.length
		? new Date(posts[0].date).toUTCString()
		: new Date(0).toUTCString();

	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXML(name)}</title>
<description>${escapeXML(description)}</description>
<link>${host}</link>
<language>en</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml"/>
${posts
	.map((post) => {
		const link = `${host}/blog/${post.slug}/`;
		const enclosure = enclosureFor(post.image);
		return `<item>
<guid isPermaLink="true">${link}</guid>
<title>${escapeXML(post.title)}</title>
<link>${link}</link>
<description>${escapeXML(post.description ?? post.title)}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>${
			enclosure
				? `\n<enclosure url="${escapeXML(enclosure.url)}" length="${enclosure.length}" type="${enclosure.type}"/>`
				: ''
		}
</item>`;
	})
	.join('\n')}
</channel>
</rss>
`;
};

export const GET = async () => {
	const body = render(getPosts());
	return new Response(body, {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml',
		},
	});
};
