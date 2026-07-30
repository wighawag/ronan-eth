export type Post = {
	title: string;
	slug: string;
	date: string;
	/**
	 * Short summary used as the RSS item description. When absent, the feed
	 * falls back to an excerpt extracted from the post body.
	 */
	description?: string;
	image?: string;
	titleImage?: boolean;
	mediumLink?: string;
	video?: string;
	caption?: string;
	captionLabel?: string;
	captionLink?: string;
	published?: boolean;
};
