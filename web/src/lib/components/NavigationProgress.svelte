<script lang="ts">
	import {navigating} from '$app/state';

	// `navigating` is never literally `null` in `$app/state`: when idle it is an
	// object whose `to`/`from`/`type` are all `null`. An in-flight page navigation
	// is therefore signalled by `navigating.to` being set.
	// We ignore `leave`/`unload` navigations (leaving the app) since those have
	// `to === null`, and the browser handles their own loading indicator.
	let isNavigating = $derived(!!navigating.to);

	// Avoid flashing the bar on instant navigations: only show it once a
	// navigation has been in flight for a little while.
	const SHOW_DELAY = 150; // ms before the bar appears
	const FINISH_MS = 320; // ms for the complete + fade-out animation

	type Phase = 'idle' | 'loading' | 'finishing';
	let phase = $state<Phase>('idle');
	let showTimer: ReturnType<typeof setTimeout> | undefined;
	let finishTimer: ReturnType<typeof setTimeout> | undefined;

	// The effect only depends on `isNavigating`; the cleanup reads `phase` but
	// cleanup functions are not tracked, so `phase` mutations never re-run this.
	$effect(() => {
		const loading = isNavigating;
		if (loading) {
			showTimer = setTimeout(() => (phase = 'loading'), SHOW_DELAY);
		}
		return () => {
			clearTimeout(showTimer);
			if (loading && phase === 'loading') {
				// Navigation completed while the bar was visible: jump to 100%
				// and fade out, then reset to idle.
				phase = 'finishing';
				finishTimer = setTimeout(() => (phase = 'idle'), FINISH_MS);
			}
		};
	});

	// Tidy up any pending timers if the component is destroyed mid-navigation.
	$effect(() => {
		return () => {
			clearTimeout(showTimer);
			clearTimeout(finishTimer);
		};
	});
</script>

{#if phase !== 'idle'}
	<div class="nav-progress" aria-hidden="true">
		<div class="nav-progress-bar" class:finishing={phase === 'finishing'}></div>
	</div>
{/if}

<style>
	.nav-progress {
		position: fixed;
		inset: 0 0 auto 0;
		height: 2px;
		z-index: 9999;
		pointer-events: none;
		/* faint track so the bar reads as a progress indicator */
		background: rgb(250 204 21 / 0.12);
	}

	.nav-progress-bar {
		height: 100%;
		background: rgb(250 204 21); /* yellow-400, matches site accent */
		box-shadow: 0 0 8px rgb(250 204 21 / 0.55);
		transform-origin: left;
		/* Grow quickly then ease off, never quite reaching 100% while loading. */
		animation: nav-progress-grow 8s cubic-bezier(0.1, 0.55, 0.1, 1) forwards;
		transition:
			width 0.2s ease-out,
			opacity 0.3s ease-out;
	}

	.nav-progress-bar.finishing {
		animation: none;
		width: 100%;
		opacity: 0;
	}

	@keyframes nav-progress-grow {
		0% {
			width: 0%;
		}
		10% {
			width: 35%;
		}
		30% {
			width: 62%;
		}
		55% {
			width: 80%;
		}
		80% {
			width: 90%;
		}
		100% {
			width: 95%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-progress-bar {
			animation: none;
			width: 95%;
		}
		.nav-progress-bar.finishing {
			width: 100%;
		}
	}
</style>