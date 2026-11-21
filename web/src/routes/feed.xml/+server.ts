import {statSync} from 'node:fs';
import {join} from 'node:path';
import {hostOf, renderFeed} from '$lib/blog/feed';
import {feedPosts} from '$lib/blog/posts';
import {postsSource} from '$lib/blog/source';
import {name, description, canonicalURL} from '../../web-config.json';

export const prerender = true;

/** The size of a file under `static/`, read when the feed is prerendered. */
function sizeOf(path: string) {
	try {
		return statSync(join(process.cwd(), 'static', path)).size;
	} catch {
		return undefined;
	}
}

export const GET = () => {
	const body = renderFeed(
		{name, description, host: hostOf(canonicalURL)},
		feedPosts(postsSource),
		{postURL: postsSource.postURL, sizeOf},
	);
	return new Response(body, {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml',
		},
	});
};
