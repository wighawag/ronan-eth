/**
 * THIS SITE's posts: the one file of the blog a site made from this template
 * modifies (with its posts and its pages). Everything a site varies about its
 * posts is here, and nothing else is: where they are (the two globs), how a
 * file's path becomes its slug, which are published, where a post lives, and
 * what a post's frontmatter holds. The listing and the feed that read it
 * (`./posts.ts`, `./feed.ts`, the `api/posts` and `feed.xml` routes) are the
 * same at every site, so a cascade into them never meets a site's change.
 *
 * Keep the two globs' pattern the same, and keep `slugOf` in step with the
 * post page's import (`routes/blog/[slug]/+page.ts`).
 */
import type {BasePost, PostsSource} from './posts';

export type Post = BasePost & {
	titleImage?: boolean;
	mediumLink?: string;
	video?: string;
	caption?: string;
	captionLabel?: string;
	captionLink?: string;
	/** A post is published unless this says `false`. */
	published?: boolean;
};

export const postsSource: PostsSource<Post> = {
	// The mdsvex modules expose `metadata`; the raw sources are globbed
	// separately so a post with no explicit `description` can still fall back
	// to an excerpt in the feed.
	modules: import.meta.glob('/src/posts/*.md', {eager: true}),
	sources: import.meta.glob('/src/posts/*.md', {
		eager: true,
		query: '?raw',
		import: 'default',
	}) as Record<string, string>,
	slugOf: (path) => path.split('/').at(-1)?.replace(/\.md$/, ''),
	isPublished: (post) => post.published !== false,
	postURL: (slug) => `/blog/${slug}/`,
};
