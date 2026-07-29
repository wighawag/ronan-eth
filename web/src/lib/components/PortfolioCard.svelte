<script lang="ts">
	interface Props {
		id: string;
		url: string;
		title: string;
		description?: string;
		name: string;
		image?: string;
		sourcecode?: string;
	}

	let {id, url, title, description, name, image}: Props = $props();

	let src = $derived(image || `/images/portfolio/${id}-preview.png`);
	let external = $derived(url.startsWith('http'));
</script>

<div
	class="flex flex-col overflow-hidden rounded-lg bg-gray-950 shadow-sm shadow-slate-400"
>
	<div class="flex-shrink-0">
		<a href={url} target={external ? '_blank' : undefined} rel="noreferrer">
			<img class="h-48 w-full object-cover" {src} alt={name} />
		</a>
	</div>
	<div class="flex flex-1 flex-col justify-between bg-black p-6">
		<div class="flex-1">
			<p class="text-xl font-medium text-yellow-300">
				<a
					href={url}
					target={external ? '_blank' : undefined}
					rel="noreferrer"
					class="underline">{name}</a
				>
			</p>
			<div class="mt-2 block">
				<p class="text-xl font-semibold text-gray-100">{title}</p>
				{#if description}
					<p class="mt-3 text-base text-gray-300">{description}</p>
				{/if}
			</div>
		</div>
	</div>
</div>
