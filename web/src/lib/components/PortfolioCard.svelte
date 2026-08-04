<script lang="ts">
	import {
		type Project,
		resolveKind,
		resolveFrame,
		redirectTarget,
	} from '$lib/data/projects';
	import GenericPreview from './GenericPreview.svelte';

	let {project}: {project: Project & {image?: string}} = $props();

	const kind = $derived(resolveKind(project));
	const fullEmbed = $derived(kind === 'embed' && resolveFrame(project) === 'full');

	const href = $derived(
		kind === 'redirect'
			? (redirectTarget(project) ?? `../projects/${project.id}/`)
			: `../projects/${project.id}/`,
	);
	const external = $derived(kind === 'redirect' || fullEmbed);

	function navigate() {
		if (external) {
			window.open(href, '_blank', 'noreferrer');
		} else {
			window.location.href = href;
		}
	}

	// Click the card to navigate, but NOT when the user is selecting text or
	// clicked the source link. This keeps text selectable while the whole card
	// stays clickable.
	function onClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('a')) return;
		const sel = window.getSelection();
		if (sel && sel.toString().length > 0) return;
		navigate();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			navigate();
		}
	}
</script>

<div
	class="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg bg-gray-950 shadow-sm shadow-slate-400 transition-shadow hover:shadow-md hover:shadow-yellow-300/40"
	role="link"
	tabindex="0"
	onclick={onClick}
	onkeydown={onKeydown}
>
	<div class="h-48 flex-shrink-0 overflow-hidden">
		{#if project.image}
			<img
				class="h-48 w-full object-cover"
				src={project.image}
				alt={project.name}
				loading="lazy"
			/>
		{:else}
			<GenericPreview name={project.name} />
		{/if}
	</div>

	<div class="flex flex-1 flex-col justify-between bg-black p-6">
		<div class="flex-1 select-text">
			<p class="text-xl font-medium text-yellow-300">{project.name}</p>
			<div class="mt-2 block">
				<p class="text-xl font-semibold text-gray-100">{project.title}</p>
				<p class="mt-3 text-base text-gray-300">{project.description}</p>
			</div>
		</div>
		{#if project.sourcecode}
			<div class="mt-4">
				<a
					href={project.sourcecode}
					target="_blank"
					rel="noreferrer"
					class="relative z-10 text-sm text-gray-500 underline hover:text-gray-300"
				>
					source
				</a>
			</div>
		{/if}
	</div>
</div>