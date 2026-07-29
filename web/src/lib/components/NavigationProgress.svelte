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

	// SvelteKit can't tell us about cross-origin navigations (they are not SPA
	// navigations), so for external same-tab link clicks we show an
	// indeterminate indicator and rely on the browser unloading this document.
	// If the click does NOT actually unload the page (e.g. the server returns a
	// download, or something prevented default), this safety timeout hides the
	// indicator so it never spins forever.
	const EXTERNAL_SAFETY_MS = 10_000;

	type Phase = 'idle' | 'loading' | 'finishing';
	let phase = $state<Phase>('idle');
	// true when the current indicator was triggered by an external link click
	// (no completion event will arrive — the document unloads instead).
	let external = $state(false);

	let showTimer: ReturnType<typeof setTimeout> | undefined;
	let finishTimer: ReturnType<typeof setTimeout> | undefined;
	let safetyTimer: ReturnType<typeof setTimeout> | undefined;

	// --- Internal (SvelteKit) navigation -------------------------------------
	// The effect only depends on `isNavigating`; the cleanup reads `phase` but
	// cleanup functions are not tracked, so `phase` mutations never re-run this.
	$effect(() => {
		const loading = isNavigating;
		if (loading) {
			// An in-app navigation started: cancel any pending external safety
			// reset and take over the indicator.
			clearTimeout(safetyTimer);
			external = false;
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

	// --- External (cross-origin) same-tab navigation -------------------------
	// Detect clicks on <a> that will navigate this tab away from the app.
	function isExternalSameTabLink(
		a: HTMLAnchorElement,
		event: MouseEvent
	): boolean {
		if (event.defaultPrevented) return false;
		// only plain left-clicks (no new-tab modifiers)
		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return false;
		}
		const href = a.getAttribute('href');
		if (!href) return false;
		// skip non-http(s) schemes
		if (/^(mailto:|tel:|sms:|javascript:|data:|#)/i.test(href)) return false;
		// skip downloads
		if (a.hasAttribute('download')) return false;
		// skip explicit new-tab / new-window targets
		const target = a.getAttribute('target');
		if (target && target.toLowerCase() !== '_self') return false;
		// only cross-origin links are "external"; same-origin goes via SvelteKit
		let url: URL;
		try {
			url = new URL(href, location.href);
		} catch {
			return false;
		}
		return url.origin !== location.origin;
	}

	function onclick(event: MouseEvent) {
		const anchor = event
			.composedPath()
			.find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
		if (!anchor) return;
		if (!isExternalSameTabLink(anchor, event)) return;

		// External, same-tab navigation: show indeterminate indicator. The
		// browser will unload this document; CSS keeps the bar/spinner painted
		// until the new page replaces us.
		clearTimeout(showTimer);
		clearTimeout(finishTimer);
		external = true;
		phase = 'loading';
		safetyTimer = setTimeout(() => {
			// Still alive after a while — the click didn't unload the page
			// (download / prevented / etc.). Reset so we don't spin forever.
			phase = 'idle';
			external = false;
		}, EXTERNAL_SAFETY_MS);
	}

	// Tidy up any pending timers if the component is destroyed mid-navigation.
	$effect(() => {
		return () => {
			clearTimeout(showTimer);
			clearTimeout(finishTimer);
			clearTimeout(safetyTimer);
		};
	});
</script>

<svelte:window onclick={onclick} />

{#if phase !== 'idle'}
	<div class="nav-progress" aria-hidden="true">
		<div
			class="nav-progress-bar"
			class:finishing={phase === 'finishing'}
			class:indeterminate={external}
		></div>
	</div>

	<div
		class="nav-spinner"
		class:finishing={phase === 'finishing'}
		aria-hidden="true"
	>
		<svg viewBox="0 0 24 24" class="nav-spinner-svg">
			<circle class="track" cx="12" cy="12" r="9" />
			<circle class="arc" cx="12" cy="12" r="9" />
		</svg>
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

	/* External navigations have no real progress signal: use an indeterminate
	   shuttle animation instead of the grow curve. */
	.nav-progress-bar.indeterminate {
		animation: nav-progress-shuttle 1.1s ease-in-out infinite;
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

	@keyframes nav-progress-shuttle {
		0% {
			width: 0%;
			transform: translateX(0%);
		}
		50% {
			width: 40%;
			transform: translateX(150%);
		}
		100% {
			width: 0%;
			transform: translateX(300%);
		}
	}

	/* --- Spinner ------------------------------------------------------------- */
	.nav-spinner {
		position: fixed;
		top: 14px;
		right: 16px;
		z-index: 9999;
		width: 22px;
		height: 22px;
		pointer-events: none;
		opacity: 1;
		transition: opacity 0.3s ease-out;
	}

	.nav-spinner.finishing {
		opacity: 0;
	}

	.nav-spinner-svg {
		width: 100%;
		height: 100%;
		animation: nav-spin 0.7s linear infinite;
	}

	.nav-spinner-svg .track {
		fill: none;
		stroke: rgb(250 204 21 / 0.18);
		stroke-width: 3;
	}

	/* circumference = 2 * π * 9 ≈ 56.5; dasharray ~74% arc */
	.nav-spinner-svg .arc {
		fill: none;
		stroke: rgb(250 204 21);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-dasharray: 42 14;
	}

	@keyframes nav-spin {
		to {
			transform: rotate(360deg);
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
		.nav-progress-bar.indeterminate {
			width: 50%;
		}
		.nav-spinner-svg {
			animation-duration: 1.6s;
		}
	}
</style>