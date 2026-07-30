<script lang="ts">
	import {formatDate} from '$lib/utils';
	import Head from '$lib/Head.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import '$lib/components/blog/prism-theme.css';

	let {data} = $props();

	const meta = $derived(data.meta);
	const showTitleImage = $derived(
		typeof meta.titleImage === 'undefined' || meta.titleImage,
	);
</script>

<Head type="article" title={meta.title} image={meta.image} />

<Breadcrumbs
	path={[
		{name: 'Home', path: '../../'},
		{name: 'Blog', path: '../'},
		{name: meta.title, path: './'},
	]}
/>

<div class="bg-gray-900">
	<div class="relative overflow-hidden bg-gray-900 py-16">
		<div class="relative px-4 sm:px-6 lg:px-8">
			<div
				class="mx-auto prose max-w-3xl text-lg prose-invert"
				style="color:rgba(255, 255, 245, 0.76);"
			>
				<h1
					class="mx-auto block max-w-3xl text-xl font-black tracking-wide uppercase"
				>
					{meta.title}
				</h1>
				<p class="mt-8 text-xl leading-8 text-gray-300">
					{formatDate(meta.date, 'long')}
				</p>
			</div>

			<div
				class="mx-auto prose prose-lg mt-6 max-w-3xl prose-invert prose-a:text-yellow-300 prose-img:rounded-lg"
				style="color:rgba(255, 255, 245, 0.76);"
			>
				{#if showTitleImage}
					{#if meta.video}
						<video src={meta.video} autoplay controls class="max-w-prose">
							<track default kind="captions" srclang="en" />
						</video>
					{:else if meta.image}
						<img src={meta.image} class="max-w-prose" alt="Banner" />
						{#if meta.caption}
							<p class="-mt-6 text-sm">
								{meta.captionLabel ? meta.captionLabel + ': ' : ''}<a
									href={meta.captionLink}>{meta.caption}</a
								>
							</p>
						{/if}
					{/if}
				{/if}

				<data.content />

				{#if meta.mediumLink}
					<p style="font-style: italic;">
						This post can also be found on medium
						<a href={meta.mediumLink} target="_blank" rel="noreferrer">here</a>
						where you can follow me.
					</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 pb-8 text-center">
			<div class="mt-8 flex justify-center">
				<div class="inline-flex rounded-md shadow">
					<a
						href="../"
						class="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-300 px-5 py-3 text-base font-medium text-black hover:bg-yellow-400"
					>
						More Blog Posts
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
