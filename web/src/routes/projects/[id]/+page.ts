import {error} from '@sveltejs/kit';
import {projects, resolveKind, resolveFrame} from '$lib/data/projects';
import {bySlug} from '$lib/data/portfolio';
import type {EntryGenerator, PageLoad} from './$types';

// Prerender one page per project id. For 'embed' projects the generated HTML is
// later OVERWRITTEN by the copied project build (see scripts/embed-projects.mjs),
// so we still emit a placeholder here to keep prerendering total.
export const prerender = true;

// Emit `/projects/<id>/index.html` (directory form) so every project resolves
// the same way a static/IPFS host expects, and matches the folder layout an
// embedded project build already uses.
export const trailingSlash = 'always';

export const entries: EntryGenerator = () => {
	return projects.map((p) => ({id: p.id}));
};

export const load: PageLoad = ({params}) => {
	const project = bySlug(params.id);
	if (!project) {
		throw error(404, 'Unknown project');
	}
	// A docked embed renders full-bleed (no site chrome/footer), so the layout
	// drops its footer/RSS call-to-action for this page.
	const fullBleed =
		resolveKind(project) === 'embed' && resolveFrame(project) === 'docked';
	return {project, fullBleed};
};
