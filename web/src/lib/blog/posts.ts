/**
 * The posts of a blog: which ones are listed, in what order, and what each
 * says about itself. Shared by every site made from this template and the same
 * at each of them: what a site varies (where its posts are, how a path becomes
 * a slug, which are published, where a post lives) is its `./source.ts`, which
 * hands it over as a `PostsSource`.
 *
 * Plain values in, plain values out, so it is tested in node
 * (`test/lib/blog/posts.test.ts`) without Vite's globs.
 */

/** What every post has, whatever site lists it. A site's `Post` extends it. */
export type BasePost = {
	title: string;
	slug: string;
	date: string;
	/** A short summary. When absent, the feed falls back to an excerpt. */
	description?: string;
	/**
	 * Optional path under `static/` (e.g. `/images/blog/post.png`). When set and
	 * present on disk it is attached to the RSS item as an <enclosure>.
	 */
	image?: string;
};

/** Where a site's posts are and how they read: what its `source.ts` provides. */
export type PostsSource<P extends BasePost> = {
	/** The mdsvex modules by path (an eager `import.meta.glob`). */
	modules: Record<string, unknown>;
	/** The same files' raw Markdown by path, for the excerpt. */
	sources: Record<string, string>;
	/** The slug of the post at `path`, or `undefined` for a file that is none. */
	slugOf(path: string): string | undefined;
	/** Whether a post is listed (and in the feed). */
	isPublished(post: P): boolean;
	/** The site path of a post (`/blog/<slug>/`), which the feed puts on its host. */
	postURL(slug: string): string;
};

type Entry<P> = {path: string; post: P};

function publishedEntries<P extends BasePost>(
	source: PostsSource<P>,
): Entry<P>[] {
	const entries: Entry<P>[] = [];
	for (const path in source.modules) {
		const file = source.modules[path];
		const slug = source.slugOf(path);
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<P, 'slug'>;
			const post = {...metadata, slug} as P;
			if (source.isPublished(post)) entries.push({path, post});
		}
	}
	return entries.sort(
		(first, second) =>
			new Date(second.post.date).getTime() -
			new Date(first.post.date).getTime(),
	);
}

/** Every published post, newest first, as its frontmatter says. */
export function listPosts<P extends BasePost>(source: PostsSource<P>): P[] {
	return publishedEntries(source).map(({post}) => post);
}

/**
 * The same posts, each with a description: its own, else an excerpt of its
 * body, else its title. What the feed lists.
 */
export function feedPosts<P extends BasePost>(source: PostsSource<P>): P[] {
	return publishedEntries(source).map(({path, post}) => ({
		...post,
		description:
			post.description?.trim() ||
			excerptFrom(source.sources[path] ?? '') ||
			post.title,
	}));
}

const MAX_EXCERPT_LENGTH = 320;

/**
 * Best-effort prose summary of a markdown body: the first real paragraph,
 * stripped of markup. Only used when a post declares no `description`.
 */
export function excerptFrom(source: string): string {
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
