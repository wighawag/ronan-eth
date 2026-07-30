import {error} from '@sveltejs/kit';
import type {PageLoad} from './$types';

export const load: PageLoad = async ({params, data}) => {
	try {
		const post = await import(`../../../posts/${params.slug}.md`);

		return {
			content: post.default,
			meta: post.metadata,
			// forward server-load data (e.g. the banner image's intrinsic
			// width/height used to reserve space for the loading shimmer)
			...data,
		};
	} catch (e) {
		error(404, `Could not find ${params.slug}`);
	}
};
