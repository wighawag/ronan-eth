export type Categories = 'release' | 'updates';

export type Post = {
	title: string;
	slug: string;
	description: string;
	date: string;
	categories: Categories[];
	published: boolean;
	/**
	 * Optional path under `static/` (e.g. `/images/blog/post.png`). When set and
	 * present on disk it is attached to the RSS item as an <enclosure>.
	 */
	image?: string;
};
