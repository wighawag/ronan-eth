import {describe, it, expect} from 'vitest';
import {enclosureFor, escapeXML, hostOf, renderFeed} from '$lib/blog/feed';

const HOST = 'https://example.com';

describe('hostOf', () => {
	it('drops one trailing slash', () => {
		expect(hostOf('https://example.com/')).toBe(HOST);
		expect(hostOf(HOST)).toBe(HOST);
	});
});

describe('escapeXML', () => {
	it('escapes the five XML characters', () => {
		expect(escapeXML(`a & b < c > d " e ' f`)).toBe(
			'a &amp; b &lt; c &gt; d &quot; e &apos; f',
		);
	});
});

describe('enclosureFor', () => {
	const sizes: Record<string, number> = {
		'/images/post.png': 1200,
		'/images/anim.gif': 900000,
		'/images/anim.png': 3000,
		'/images/only.gif': 5000,
		'/images/empty.png': 0,
	};
	const sizeOf = (path: string) => sizes[path];

	it('attaches an image under static with its size and type', () => {
		expect(enclosureFor('/images/post.png', {host: HOST, sizeOf})).toEqual({
			url: `${HOST}/images/post.png`,
			length: 1200,
			type: 'image/png',
		});
	});

	it('prefers the png sibling of a gif, else the gif', () => {
		expect(enclosureFor('/images/anim.gif', {host: HOST, sizeOf})?.url).toBe(
			`${HOST}/images/anim.png`,
		);
		expect(enclosureFor('/images/only.gif', {host: HOST, sizeOf})).toEqual({
			url: `${HOST}/images/only.gif`,
			length: 5000,
			type: 'image/gif',
		});
	});

	it('attaches nothing it cannot measure or type', () => {
		expect(enclosureFor(undefined, {host: HOST, sizeOf})).toBeUndefined();
		expect(
			enclosureFor('images/post.png', {host: HOST, sizeOf}),
		).toBeUndefined();
		expect(
			enclosureFor('/images/missing.png', {host: HOST, sizeOf}),
		).toBeUndefined();
		expect(
			enclosureFor('/images/empty.png', {host: HOST, sizeOf}),
		).toBeUndefined();
		expect(
			enclosureFor('/images/post.bmp', {host: HOST, sizeOf}),
		).toBeUndefined();
	});
});

describe('renderFeed', () => {
	const channel = {name: 'A & B', description: 'News <here>', host: HOST};
	const options = {
		postURL: (slug: string) => `/blog/${slug}/`,
		sizeOf: (path: string) => (path === '/a.png' ? 10 : undefined),
	};

	it('renders one item per post, escaped, linked by the source URL', () => {
		const xml = renderFeed(
			channel,
			[
				{
					title: 'New & shiny',
					slug: 'new',
					date: '2024-1-2',
					description: 'Desc',
					image: '/a.png',
				},
				{title: 'Old', slug: 'old', date: '2023-4-14'},
			],
			options,
		);
		expect(xml).toContain('<title>A &amp; B</title>');
		expect(xml).toContain('<description>News &lt;here&gt;</description>');
		expect(xml).toContain(
			`<guid isPermaLink="true">${HOST}/blog/new/</guid>\n<title>New &amp; shiny</title>`,
		);
		expect(xml).toContain('<description>Desc</description>');
		expect(xml).toContain(
			`<enclosure url="${HOST}/a.png" length="10" type="image/png"/>`,
		);
		expect(xml).toContain(`<link>${HOST}/blog/old/</link>`);
		expect(xml).toContain('<description>Old</description>');
		expect(xml.match(/<item>/g)).toHaveLength(2);
	});

	it('dates the channel by its newest post, not by the build', () => {
		const xml = renderFeed(
			channel,
			[{title: 'New', slug: 'new', date: '2024-01-02T00:00:00Z'}],
			options,
		);
		expect(xml).toContain(
			`<lastBuildDate>${new Date('2024-01-02T00:00:00Z').toUTCString()}</lastBuildDate>`,
		);
		expect(renderFeed(channel, [], options)).toContain(
			`<lastBuildDate>${new Date(0).toUTCString()}</lastBuildDate>`,
		);
	});
});
