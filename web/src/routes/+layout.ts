import {dev} from '$app/environment';
import {get} from 'svelte/store';
import {onDocumentLoaded} from '$lib/core/utils/web/hooks.js';
import {serviceWorker} from '$lib/core/config';

export const prerender = true;
export const trailingSlash = 'always';
export const ssr = true;

// The service worker only matters for production (offline cache, update
// notifications). In dev it is served as an ES module that Firefox fails to
// evaluate, throwing on register, so we skip registration during development.
if (!dev) {
	onDocumentLoaded(serviceWorker.register);
}

(globalThis as any).get = get;