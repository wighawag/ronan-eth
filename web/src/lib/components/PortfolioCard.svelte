<script lang="ts">
	import {onMount} from 'svelte';
	import {
		type Project,
		resolveKind,
		resolveFrame,
		redirectTarget,
	} from '$lib/data/projects';
	import GenericPreview from './GenericPreview.svelte';

	let {project}: {project: Project & {image?: string}} = $props();

	const kind = $derived(resolveKind(project));
	const fullEmbed = $derived(
		kind === 'embed' && resolveFrame(project) === 'full',
	);

	const href = $derived(
		kind === 'redirect'
			? (redirectTarget(project) ?? `../projects/${project.id}/`)
			: `../projects/${project.id}/`,
	);
	const external = $derived(kind === 'redirect' || fullEmbed);

	// The stretched overlay anchor makes the card navigate without JavaScript.
	// Once JS is active we disable its pointer events so clicks/drags reach the
	// plain text beneath (which is freely selectable) and the card's own click
	// handler takes over navigation. In SSR / no-JS it stays interactive.
	let overlayInteractive = $state(true);
	onMount(() => {
		overlayInteractive = false;
	});

	function navigate() {
		if (external) {
			window.open(href, '_blank', 'noreferrer');
		} else {
			window.location.href = href;
		}
	}

	// Click the card to navigate, but NOT when the user just selected text or
	// clicked the source link. This keeps the text selectable while the whole
	// card stays clickable (only with JS; without JS the overlay navigates).
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
	tabindex={overlayInteractive ? -1 : 0}
	onclick={onClick}
	onkeydown={onKeydown}
>
	<!-- Stretched card link: a real anchor covering the whole card so it
	     navigates natively (no JS) to the project's external site or hub page.
	     The source link below sits above this on z-10 so it still works on its
	     own. With JS the overlay's pointer events are disabled so the text
	     beneath stays selectable and the card click handler handles navigation. -->
	<a
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noreferrer' : undefined}
		aria-label={project.name}
		class="absolute inset-0 z-0"
		tabindex={overlayInteractive ? 0 : -1}
		style:pointer-events={overlayInteractive ? 'auto' : 'none'}
	></a>

	<div class="h-48 shrink-0 overflow-hidden">
		{#if project.image}
			<img
				class="h-full w-full object-cover"
				src={project.image}
				alt={project.name}
				loading="lazy"
				draggable="false"
			/>
		{:else}
			<GenericPreview name={project.name} />
		{/if}
	</div>

	<div class="flex flex-1 flex-col justify-between bg-black p-6">
		<div class="flex-1 select-text">
			<p class="text-xl font-medium wrap-break-word text-yellow-300">
				{project.name}
			</p>
			<div class="mt-2 block">
				<p class="text-xl font-semibold wrap-break-word text-gray-100">
					{project.title}
				</p>
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
