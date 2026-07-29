<script lang="ts">
	import Notifications from '$lib/core/notifications/Notifications.svelte';
	import VersionAndInstallNotfications from '$lib/core/service-worker/VersionAndInstallNotfications.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MailingList from '$lib/components/MailingList.svelte';
	import '../app.css';
	let {children} = $props();
</script>

<div class="flex min-h-dvh flex-col bg-black text-gray-100">
	<main class="flex-1 bg-black">
		{@render children()}
	</main>
	<MailingList />
	<Footer />
</div>

<Notifications />

<VersionAndInstallNotfications src="" alt="" />
