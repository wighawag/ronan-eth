<script lang="ts">
	import {onMount} from 'svelte';
	import Head from '$lib/Head.svelte';
	import {
		resolveKind,
		resolveFrame,
		redirectTarget,
		embedSrc,
		isRemoteEmbed,
	} from '$lib/data/projects';
	import type {PageData} from './$types';

	let {data}: {data: PageData} = $props();
	const project = $derived(data.project);

	const kind = $derived(resolveKind(project));
	const target = $derived(redirectTarget(project));
	const frame = $derived(kind === 'embed' ? resolveFrame(project) : undefined);
	const docked = $derived(frame === 'docked');
	const inline = $derived(frame === 'inline');
	// The iframe source: a live remote URL when set, else the copied ./_site/.
	const src = $derived(kind === 'embed' ? embedSrc(project) : '');
	const remote = $derived(kind === 'embed' && isRemoteEmbed(project));

	let iframeEl = $state<HTMLIFrameElement | null>(null);
	let frameHeight = $state(800);

	onMount(() => {
		// Redirect projects bounce to their canonical target (url first, else repo).
		if (kind === 'redirect' && target) {
			window.location.replace(target);
			return;
		}
		// Only 'inline' embeds auto-size to content; 'docked' fills the viewport.
		// A remote (cross-origin) embed can't be measured, so skip auto-sizing.
		if (!inline || remote) return;

		let ro: ResizeObserver | undefined;
		const measure = () => {
			try {
				const doc = iframeEl?.contentDocument;
				if (!doc?.documentElement) return;
				frameHeight = doc.documentElement.scrollHeight;
			} catch {
				// cross-origin (shouldn't happen for ./_site/): keep fallback height
			}
		};
		const onLoad = () => {
			measure();
			const doc = iframeEl?.contentDocument;
			if (doc?.documentElement && 'ResizeObserver' in window) {
				ro = new ResizeObserver(measure);
				ro.observe(doc.documentElement);
			}
		};
		iframeEl?.addEventListener('load', onLoad);
		return () => {
			ro?.disconnect();
			iframeEl?.removeEventListener('load', onLoad);
		};
	});
</script>

<Head title={`${project.name} · Ronan Sandford`} description={project.title} />

<svelte:head>
	{#if kind === 'redirect' && target}
		<meta http-equiv="refresh" content={`0; url=${target}`} />
		<link rel="canonical" href={target} />
	{/if}
</svelte:head>

{#if docked}
	<!-- Full-bleed: a thin sub-bar, then the site fills the remaining height with
	     its own scroll. The layout drops its footer/RSS for this page. -->
	<div class="flex min-h-dvh flex-col bg-black">
		<div
			class="flex items-center gap-3 border-b border-gray-800 px-4 py-2 text-sm text-gray-400 sm:px-6"
		>
			<a href="../../portfolio/" class="hover:text-gray-200">&larr; Portfolio</a>
			<span class="font-medium text-gray-100">{project.name}</span>
			<span class="hidden sm:inline">· {project.title}</span>
			<div class="ml-auto flex gap-3">
				<a
					class="text-yellow-300 hover:underline"
					href={src}
					target="_blank"
					rel="noreferrer">open full ↗</a
				>
				{#if project.sourcecode}
					<a
						class="hover:text-gray-200"
						href={project.sourcecode}
						target="_blank"
						rel="noreferrer">source</a
					>
				{/if}
			</div>
		</div>
		<iframe
			{src}
			title={`${project.name} embedded site`}
			class="min-h-0 w-full flex-1 border-0"
		></iframe>
	</div>
{:else if inline}
	<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
		<div
			class="mb-6 flex items-center gap-3 border-b border-gray-800 pb-3"
		>
			<a href="../../portfolio/" class="text-sm text-gray-400 hover:text-gray-200"
				>&larr; Portfolio</a
			>
			<span class="font-semibold text-gray-100">{project.name}</span>
			<span class="hidden text-sm text-gray-400 sm:inline">· {project.title}</span>
			<div class="ml-auto flex gap-3 text-sm">
				<a
					class="text-yellow-300 hover:underline"
					href={src}
					target="_blank"
					rel="noreferrer">open full ↗</a
				>
				{#if project.sourcecode}
					<a
						class="text-gray-400 hover:text-gray-200"
						href={project.sourcecode}
						target="_blank"
						rel="noreferrer">source</a
					>
				{/if}
			</div>
		</div>
		<iframe
			bind:this={iframeEl}
			{src}
			title={`${project.name} embedded site`}
			class="w-full border-0"
			style={`height:${frameHeight}px`}
			loading="lazy"
		></iframe>
	</div>
{:else}
	<div class="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
		<a href="../../portfolio/" class="text-sm text-gray-400 hover:text-gray-200"
			>&larr; Portfolio</a
		>

		<header class="mt-6 flex items-start justify-between gap-3">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-gray-100">
					{project.name}
				</h1>
				<p class="mt-2 text-lg text-gray-400">{project.title}</p>
			</div>
			{#if project.tags?.length}
				<div class="flex flex-wrap justify-end gap-1.5">
					{#each project.tags as tag (tag)}
						<span
							class="rounded-full border border-gray-700 px-2 py-0.5 text-xs text-gray-400"
							>{tag}</span
						>
					{/each}
				</div>
			{/if}
		</header>

		<hr class="my-6 border-gray-800" />

		{#if kind === 'redirect' && target}
			<p class="text-gray-400">
				Redirecting to
				<a class="text-yellow-300 underline" href={target}>{target}</a>…
			</p>
			<div class="mt-6">
				<a
					href={target}
					class="inline-flex items-center justify-center rounded-md bg-yellow-300 px-4 py-2 font-medium text-black hover:bg-yellow-500"
					>Go to {project.name}</a
				>
			</div>
		{:else}
			<p class="text-base leading-relaxed text-gray-200">
				{project.description}
			</p>

			<div class="mt-8 flex flex-wrap gap-3">
				{#if project.url}
					<a
						href={project.url}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center justify-center rounded-md bg-yellow-300 px-4 py-2 font-medium text-black hover:bg-yellow-500"
						>Visit site</a
					>
				{/if}
				{#if project.sourcecode}
					<a
						href={project.sourcecode}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center justify-center rounded-md border border-gray-700 px-4 py-2 font-medium text-yellow-300 hover:bg-gray-800"
						>Source code</a
					>
				{/if}
			</div>
		{/if}
	</div>
{/if}
