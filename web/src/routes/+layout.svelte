<script lang="ts">
	import Notifications from '$lib/core/notifications/Notifications.svelte';
	import VersionAndInstallNotfications from '$lib/core/service-worker/VersionAndInstallNotfications.svelte';
	import {notifications, serviceWorker} from '$lib/core/config';
	import Footer from '$lib/components/Footer.svelte';
	import RssCallToAction from '$lib/components/RssCallToAction.svelte';
	import NavigationProgress from '$lib/components/NavigationProgress.svelte';
	import {page} from '$app/state';
	import '../app.css';
	let {children} = $props();

	// Docked-embed project pages render full-bleed (the embedded site fills the
	// viewport under a thin sub-bar), so we drop the footer + RSS call-to-action
	// for those pages. Signalled via page.data.fullBleed from the [id] load.
	const fullBleed = $derived(Boolean(page.data?.fullBleed));
</script>

<NavigationProgress />

{#if fullBleed}
	<main class="flex min-h-dvh flex-col bg-black text-gray-100">
		{@render children()}
	</main>
{:else}
	<div class="flex min-h-dvh flex-col bg-black text-gray-100">
		<main class="flex-1 bg-black">
			{@render children()}
		</main>
		<RssCallToAction />
		<Footer />
	</div>
{/if}

<Notifications {notifications} />

<VersionAndInstallNotfications {serviceWorker} />
