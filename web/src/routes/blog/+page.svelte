<script lang="ts">
	import {formatDate} from '$lib/utils';
	import Head from '$lib/Head.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let {data} = $props();

	function gifToPng(imagePath: string) {
		return imagePath.slice(0, imagePath.length - 4) + '.png';
	}
</script>

<Head title="Blog" description="Various writing on web3 and ethereum." />

<Breadcrumbs
	path={[
		{name: 'Home', path: '../'},
		{name: 'Blog', path: './'},
	]}
/>

<div class="relative bg-gray-950 px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-12 lg:pb-28">
	<div class="absolute inset-0">
		<div class="h-1/3 bg-black sm:h-2/3"></div>
	</div>
	<div class="relative mx-auto max-w-7xl">
		<div class="text-center">
			<h2
				class="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl"
			>
				My Personal Blog
			</h2>
			<p class="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
				Various writing on web3 and ethereum.
			</p>
		</div>
		<div class="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
			{#each data.posts as post}
				<a
					href={post.slug}
					class="group flex flex-col overflow-hidden rounded-lg shadow-lg"
				>
					{#if post.image}
						<div class="flex-shrink-0">
							{#if post.image.endsWith('.gif')}
								<picture>
									<source srcset={gifToPng(post.image)} type="image/png" />
									<img
										class="h-48 w-full object-cover"
										src={post.image}
										alt={post.title}
									/>
								</picture>
							{:else}
								<img
									class="h-48 w-full object-cover"
									src={post.image}
									alt={post.title}
								/>
							{/if}
						</div>
					{/if}
					<div class="flex flex-1 flex-col justify-between bg-gray-900 p-6">
						<div class="flex-1">
							<p
								class="text-xl font-semibold text-gray-100 group-hover:text-yellow-300"
							>
								{post.title}
							</p>
							<p class="mt-3 text-base text-gray-500">
								{formatDate(post.date)}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
