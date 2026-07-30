<script lang="ts">
	import {url} from '$lib/core/utils/web/path';

	const feed = $derived(url('/feed.xml'));
</script>

<div class="bg-gray-800">
	<div
		class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:px-8 lg:py-16"
	>
		<div class="lg:w-0 lg:flex-1">
			<h2
				class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
				id="rss-headline"
			>
				Follow via RSS:
			</h2>
			<p class="mt-3 max-w-3xl text-lg leading-6 text-gray-300">
				No email, no sign-up, no tracking. Point your feed reader at the feed
				and you'll get my new posts on web3 and ethereum as they land.
			</p>
		</div>
		<div class="mt-8 lg:mt-0 lg:ml-8">
			<div class="sm:flex sm:items-center">
				<div class="rounded-md shadow sm:flex-shrink-0">
					<a
						href={feed}
						class="flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-300 px-5 py-3 text-base font-medium text-black hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
						aria-describedby="rss-headline"
					>
						<svg
							class="mr-2 h-5 w-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								d="M6.503 20.752A3.25 3.25 0 013.252 24 3.25 3.25 0 010 20.752a3.25 3.25 0 013.252-3.248 3.25 3.25 0 013.251 3.248zM0 8.18v4.09c6.475 0 11.729 5.256 11.729 11.73h4.106C15.835 15.245 8.752 8.18 0 8.18zm0-6.525v4.09C9.945 5.745 18.255 14.055 18.255 24h4.09C22.345 11.798 12.202 1.655 0 1.655z"
							/>
						</svg>
						Get the feed
					</a>
				</div>
				<p class="mt-3 text-center text-sm text-gray-400 sm:mt-0 sm:ml-4">
					or copy the link
				</p>
			</div>
		</div>
	</div>
</div>
