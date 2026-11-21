import {describe, it, expect} from 'vitest';
import {
	excerptFrom,
	feedPosts,
	listPosts,
	type BasePost,
	type PostsSource,
} from '$lib/blog/posts';

type TestPost = BasePost & {published?: boolean};

/** A source as a site's `source.ts` builds it, from plain values. */
function sourceOf(
	files: Record<string, {metadata?: Omit<TestPost, 'slug'>; raw?: string}>,
	overrides: Partial<PostsSource<TestPost>> = {},
): PostsSource<TestPost> {
	const modules: Record<string, unknown> = {};
	const sources: Record<string, string> = {};
	for (const [path, file] of Object.entries(files)) {
		modules[path] = file.metadata ? {metadata: file.metadata} : {};
		if (file.raw !== undefined) sources[path] = file.raw;
	}
	return {
		modules,
		sources,
		slugOf: (path) => path.split('/').at(-1)?.replace(/\.md$/, ''),
		isPublished: (post) => post.published !== false,
		postURL: (slug) => `/blog/${slug}/`,
		...overrides,
	};
}

describe('listPosts', () => {
	it('lists every published post, newest first, with its slug', () => {
		const posts = listPosts(
			sourceOf({
				'/src/posts/old.md': {metadata: {title: 'Old', date: '2023-4-14'}},
				'/src/posts/new.md': {metadata: {title: 'New', date: '2024-1-2'}},
			}),
		);
		expect(posts.map((post) => [post.slug, post.title])).toEqual([
			['new', 'New'],
			['old', 'Old'],
		]);
	});

	it('leaves out what the source says is not published', () => {
		const posts = listPosts(
			sourceOf({
				'/src/posts/a.md': {metadata: {title: 'A', date: '2024-1-1'}},
				'/src/posts/b.md': {
					metadata: {title: 'B', date: '2024-1-2', published: false},
				},
			}),
		);
		expect(posts.map((post) => post.slug)).toEqual(['a']);
	});

	it('reads the slug and the publish rule from the source', () => {
		const posts = listPosts(
			sourceOf(
				{
					'/src/posts/first/index.md': {
						metadata: {title: 'First', date: '2024-1-1'},
					},
					'/src/posts/draft/index.md': {
						metadata: {title: 'Draft', date: '2024-1-2', published: true},
					},
				},
				{
					slugOf: (path) => path.split('/').at(-2),
					isPublished: (post) => post.slug !== 'draft',
				},
			),
		);
		expect(posts.map((post) => post.slug)).toEqual(['first']);
	});

	it('skips a module with no metadata or no slug', () => {
		const posts = listPosts(
			sourceOf(
				{
					'/src/posts/bare.md': {},
					'/src/posts/kept.md': {metadata: {title: 'Kept', date: '2024-1-1'}},
				},
				{slugOf: (path) => (path.includes('kept') ? 'kept' : undefined)},
			),
		);
		expect(posts.map((post) => post.slug)).toEqual(['kept']);
	});

	it('keeps the description as written, even when there is none', () => {
		const [post] = listPosts(
			sourceOf({
				'/src/posts/a.md': {
					metadata: {title: 'A', date: '2024-1-1'},
					raw: 'A body.',
				},
			}),
		);
		expect(post.description).toBeUndefined();
	});
});

describe('feedPosts', () => {
	it('falls back to an excerpt of the body, then to the title', () => {
		const posts = feedPosts(
			sourceOf({
				'/src/posts/written.md': {
					metadata: {title: 'Written', date: '2024-1-3', description: ' Mine '},
					raw: 'Ignored.',
				},
				'/src/posts/excerpt.md': {
					metadata: {title: 'Excerpt', date: '2024-1-2'},
					raw: '---\ntitle: Excerpt\n---\n\n# Heading\n\nThe *first* paragraph.\n',
				},
				'/src/posts/empty.md': {
					metadata: {title: 'Empty', date: '2024-1-1'},
					raw: '---\ntitle: Empty\n---\n',
				},
			}),
		);
		expect(posts.map((post) => post.description)).toEqual([
			'Mine',
			'The first paragraph.',
			'Empty',
		]);
	});
});

describe('excerptFrom', () => {
	it('takes the first paragraph of prose, without markup', () => {
		const markdown = [
			'---',
			'title: T',
			'---',
			'',
			'<!-- an intro parked here -->',
			'',
			'## A heading',
			'',
			'![an image](/a.png)',
			'',
			'```ts',
			'const code = 1;',
			'```',
			'',
			'::: tip',
			'See [the docs](https://example.com) and `code` with **bold**.',
			':::',
		].join('\n');
		expect(excerptFrom(markdown)).toBe('See the docs and code with bold.');
	});

	it('cuts a long paragraph at a word, with an ellipsis', () => {
		const excerpt = excerptFrom(`${'word '.repeat(100)}end`);
		expect(excerpt.length).toBeLessThanOrEqual(321);
		expect(excerpt.endsWith('word…')).toBe(true);
	});

	it('is empty when there is no prose', () => {
		expect(excerptFrom('---\ntitle: T\n---\n\n# Only a heading\n')).toBe('');
	});
});
