import type {Post} from '$lib/types';
import {name, description, canonicalURL} from '../../web-config.json';

export const prerender = true;

const host = canonicalURL.endsWith('/')
	? canonicalURL.slice(0, -1)
	: canonicalURL;

async function getPosts() {
	let posts: Post[] = [];

	const paths = import.meta.glob('/src/posts/*.md', {eager: true});

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = {...metadata, slug} satisfies Post;
			if (post.published !== false) {
				posts.push(post);
			}
		}
	}

	posts = posts.sort(
		(first, second) =>
			new Date(second.date).getTime() - new Date(first.date).getTime(),
	);

	return posts;
}

const render = (posts: Post[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${name}</title>
<description>${description}</description>
<link>${host}</link>
<atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml"/>
${posts
	.map(
		(post) => `<item>
<guid isPermaLink="true">${host}/blog/${post.slug}/</guid>
<title>${post.title}</title>
<link>${host}/blog/${post.slug}/</link>
<description>${post.title}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`,
	)
	.join('')}
</channel>
</rss>
`;

export const GET = async () => {
	const posts = await getPosts();
	const body = render(posts);
	return new Response(body, {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml',
		},
	});
};
