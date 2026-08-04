<script lang="ts">
	import Head from '$lib/Head.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import LinkCard from '$lib/components/LinkCard.svelte';
	import {list} from '$lib/data/links';

	const title = 'Links';
	const description = 'Where to find me online';
</script>

<Head {title} {description} />

<Breadcrumbs
	path={[
		{name: 'Home', path: '../'},
		{name: 'Links', path: './'},
	]}
/>

<div
	class="relative bg-gray-950 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28"
>
	<div class="absolute inset-0">
		<div class="h-1/3 bg-gray-900 sm:h-2/3"></div>
	</div>
	<div class="relative mx-auto max-w-7xl">
		<div class="text-center">
			<h2
				class="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl"
			>
				Where to find me
			</h2>
		</div>
		<div class="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
			{#each list as elem (elem.id)}
				<LinkCard {...elem} />
			{/each}
		</div>
	</div>
</div>
