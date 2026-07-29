<script lang="ts">
	interface Props {
		path?: {name: string; path: string}[];
	}

	let {path = []}: Props = $props();
</script>

{#if path.length > 1}
	<nav class="flex border-b border-gray-800 bg-black" aria-label="Breadcrumb">
		<ol
			class="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8"
		>
			{#each path as elem, i}
				{#if i == 0}
					<li class="flex">
						<div class="flex items-center">
							<a href={elem.path} class="text-gray-600 hover:text-gray-500">
								<svg
									class="h-5 w-5 flex-shrink-0"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
									/>
								</svg>
								<span class="sr-only">{elem.name}</span>
							</a>
						</div>
					</li>
				{:else}
					<li class="flex">
						<div class="flex items-center">
							<svg
								class="h-full w-6 flex-shrink-0 text-gray-800"
								viewBox="0 0 24 44"
								preserveAspectRatio="none"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
							</svg>
							<a
								href={elem.path}
								class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-300"
								aria-current={i === path.length - 1 ? 'page' : undefined}
								>{elem.name}</a
							>
						</div>
					</li>
				{/if}
			{/each}
		</ol>
	</nav>
{/if}
