/**
 * The RSS feed of a blog, rendered from its posts. Shared by every site made
 * from this template: the route (`routes/feed.xml/+server.ts`) passes the
 * site's name, its posts (`feedPosts` of `./posts.ts`), where a post lives
 * (its `source.ts`' `postURL`) and how to measure a file under `static/`, so
 * this file reads no disk and no config and is tested in node
 * (`test/lib/blog/feed.test.ts`).
 */
import type {BasePost} from './posts';

/** The site's canonical URL without its trailing slash. */
export function hostOf(canonicalURL: string): string {
	return canonicalURL.endsWith('/') ? canonicalURL.slice(0, -1) : canonicalURL;
}

/**
 * Everything interpolated into the feed goes through this. A single `&` or `<`
 * in a post title is enough to produce a feed no reader will parse.
 */
export function escapeXML(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

const MIME_TYPES: Record<string, string> = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.svg': 'image/svg+xml',
};

export type Enclosure = {url: string; length: number; type: string};

/** The byte size of a file under `static/`, or `undefined` when it is not there. */
export type SizeOf = (path: string) => number | undefined;

/**
 * RSS requires a byte `length` on an enclosure, so an image only makes it into
 * the feed if its size under `static/` is known. Animated gifs are swapped for
 * their png sibling when one exists, since gifs tend to run to megabytes and a
 * feed reader would download every one of them.
 */
export function enclosureFor(
	image: string | undefined,
	{host, sizeOf}: {host: string; sizeOf: SizeOf},
): Enclosure | undefined {
	if (!image || !image.startsWith('/')) return undefined;

	const candidates = image.endsWith('.gif')
		? [`${image.slice(0, -4)}.png`, image]
		: [image];

	for (const candidate of candidates) {
		const extension = candidate.slice(candidate.lastIndexOf('.')).toLowerCase();
		const type = MIME_TYPES[extension];
		if (!type) continue;
		const size = sizeOf(candidate);
		if (size && size > 0)
			return {url: `${host}${candidate}`, length: size, type};
	}

	return undefined;
}

export type FeedChannel = {name: string; description: string; host: string};

export function renderFeed<P extends BasePost>(
	channel: FeedChannel,
	posts: P[],
	{postURL, sizeOf}: {postURL: (slug: string) => string; sizeOf: SizeOf},
): string {
	const {host} = channel;
	// Deliberately the newest post date rather than the build time: a static
	// site published to IPFS would otherwise get a new content hash on every
	// rebuild even when nothing was written.
	const lastBuildDate = posts.length
		? new Date(posts[0].date).toUTCString()
		: new Date(0).toUTCString();

	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXML(channel.name)}</title>
<description>${escapeXML(channel.description)}</description>
<link>${host}</link>
<language>en</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml"/>
${posts
	.map((post) => {
		const link = `${host}${postURL(post.slug)}`;
		const enclosure = enclosureFor(post.image, {host, sizeOf});
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
}
