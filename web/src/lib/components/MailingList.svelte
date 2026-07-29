<script lang="ts">
	type SubscriptionState = {
		type: 'Idle' | 'Success' | 'Error';
		message: string;
	};

	let subscription = $state<SubscriptionState>({type: 'Idle', message: ''});

	function acknowledge() {
		subscription = {type: 'Idle', message: ''};
	}

	async function subscribeToMailingList(e: MouseEvent) {
		e.preventDefault();
		const form = document.getElementById('subscribeForm') as HTMLFormElement;
		if (!form) {
			throw new Error(`form does not exist with id "subscribeForm"`);
		}
		const formData = new FormData(form);
		const data = new URLSearchParams([...(formData as any)]);
		try {
			const result = await fetch(form.action, {
				method: form.method,
				body: data,
			});
			const json = await result.json();
			if (json.error) {
				throw new Error(json.error);
			}
			subscription = {
				type: 'Success',
				message:
					json.message ||
					'Noted, you should receive an email to confirm your subscription.',
			};
		} catch (e: any) {
			subscription = {type: 'Error', message: e.message || '' + e};
		} finally {
			setTimeout(() => acknowledge(), 5000);
		}
	}
</script>

<div class="bg-gray-800">
	<div
		class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:px-8 lg:py-16"
	>
		<div class="lg:w-0 lg:flex-1">
			<h2
				class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
				id="newsletter-headline"
			>
				Subscribe to my mailing list:
			</h2>
			<p class="mt-3 max-w-3xl text-lg leading-6 text-gray-300">
				And you'll get updates on my new posts regarding web3 and ethereum.
			</p>
		</div>
		<div class="mt-8 lg:mt-0 lg:ml-8">
			<form
				class="sm:flex"
				id="subscribeForm"
				action="https://newsletter.metavers.me"
				method="POST"
			>
				<label for="email" class="sr-only">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					class="w-full rounded-md border border-transparent px-5 py-3 placeholder-gray-500 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 sm:max-w-xs"
					placeholder="Enter your email"
				/>

				<input
					type="hidden"
					name="main_list"
					value="ronan-blog@newsletter.metavers.me"
				/>
				<div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
					<button
						type="submit"
						class="flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-300 px-5 py-3 text-base font-medium text-black hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
						onclick={subscribeToMailingList}
					>
						Notify me
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

{#if subscription.type !== 'Idle'}
	<div
		aria-live="assertive"
		class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
	>
		<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
			<div
				class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
			>
				<div class="p-4">
					<div class="flex items-start">
						<div class="flex-shrink-0">
							{#if subscription.type === 'Error'}
								<svg
									class="h-6 w-6 text-red-400"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<svg
									class="h-6 w-6 text-green-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							{/if}
						</div>
						<div class="ml-3 w-0 flex-1 pt-0.5">
							<p class="text-sm font-medium text-gray-900">
								{subscription.message}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
