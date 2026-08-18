/**
 * ronan.eth portfolio, driven by the project manifest in `projects.ts`.
 *
 * ronan.eth OWNS this manifest. It started as a copy of the one in the
 * wighawag-com repo, but the two no longer need to stay byte-identical: edit
 * `projects.ts` here directly (add projects, images, tags, embeds, ...).
 */
import {projects, resolveKind, type Project} from './projects';

/**
 * The hand-picked lead of the grid, in this exact order. Everything else
 * follows automatically (image-having projects first, then the rest).
 */
const leadOrder = [
	'conquest',
	'stratagems',
	'ethernal',
	'jolly-roger',
	'hardhat-deploy',
	'dorfl',
];

function bySlugRaw(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}

// The lead projects (in the given order), then all remaining projects with the
// image-having ones first. One flat, ordered list: no featured/rest grouping.
const lead = leadOrder
	.map((id) => bySlugRaw(id))
	.filter((p): p is Project => Boolean(p));
const leadIds = new Set(leadOrder);

/** Only visible projects are shown on the grid. Hidden ones (visible: false)
 * still exist in the manifest and get a /projects/<id>/ page, but are not
 * displayed on the portfolio page. */
const visible = projects.filter((p) => p.visible !== false);

/** No-image projects to pin at the FRONT of the no-image bucket (right after
 * the last image card), in this order. */
const noImageLead = ['clones-with-immutable-args'];
const noImageLeadIds = new Set(noImageLead);

const remainingAll = visible.filter((p) => !leadIds.has(p.id));
const remainingImage = remainingAll.filter((p) => p.image);
const remainingNoImage = remainingAll.filter(
	(p) => !p.image && !noImageLeadIds.has(p.id),
);
const noImageLeadProjects = noImageLead
	.map((id) => bySlugRaw(id))
	.filter((p): p is Project => Boolean(p));

// Image-having projects first, then the pinned no-image lead, then the rest.
const remaining = [
	...remainingImage,
	...noImageLeadProjects,
	...remainingNoImage,
];

/**
 * A synthetic tile, pinned LAST, that links to the full GitHub profile. It is
 * NOT a catalog project (not in the manifest), so it gets no /projects/<id>
 * page: as a redirect-kind entry the card just links straight to GitHub.
 */
const githubTile: Project = {
	id: 'github-profile',
	name: 'Github repositories',
	title: 'Always working on new stuff',
	description:
		'This is only a selection. Browse every repository, including the experiments and works in progress, on GitHub.',
	url: 'https://github.com/wighawag',
	image: '/images/portfolio/wighawag-preview.png',
};

/** Every project, ordered: hand-picked lead, image-first remainder, GitHub tile last. */
export const portfolio: Project[] = [...lead, ...remaining, githubTile];

export function bySlug(id: string): Project | undefined {
	return bySlugRaw(id);
}

export {projects, resolveKind};
export type {Project};
