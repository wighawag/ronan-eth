import {json} from '@sveltejs/kit';
import {listPosts} from '$lib/blog/posts';
import {postsSource} from '$lib/blog/source';

export const prerender = true;

export function GET() {
	return json(listPosts(postsSource));
}
