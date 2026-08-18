#!/usr/bin/env node
/**
 * Post-build step: for every project with kind: 'embed', copy its built static
 * site into `build/<id>/`, replacing the prerendered placeholder page.
 *
 * This works because the embedded builds use relative asset paths (IPFS-safe),
 * so they resolve correctly when served from a sub-folder.
 *
 * `buildPath` in the manifest is resolved relative to the REPO ROOT (the parent
 * of this `web/` folder), so `../dorfl/website/build` means a sibling checkout
 * of the dorfl repo. In CI, ensure those builds exist first (submodule/clone +
 * build, or artifact download) before running this.
 *
 * A missing build is a warning by default, or a hard error when
 * EMBED_STRICT=1 is set (use that in CI so a missing project fails the deploy).
 */
import {cp, rm, stat, readdir, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(__dirname, '..');
const repoRoot = resolve(webDir, '..');
const buildDir = join(webDir, 'build');
const strict = process.env.EMBED_STRICT === '1';
// Optional route prefix under which project pages live (e.g. 'projects' when the
// [id] route is /projects/<id>). Empty (the default) means /<id> at the root.
const embedBase = (process.env.EMBED_BASE ?? '').replace(/^\/+|\/+$/g, '');
const baseDir = embedBase ? join(buildDir, embedBase) : buildDir;
const baseRel = embedBase ? `build/${embedBase}` : 'build';

async function readEmbedsFromSource() {
	// Read the TS manifest source and extract embed entries without needing a TS
	// loader at build time (keeps the post-build step dependency-free).
	const srcPath = join(webDir, 'src/lib/data/projects.ts');
	const text = await readFile(srcPath, 'utf8');
	const embeds = [];
	// naive block scan for objects containing kind: 'embed'
	const objectRegex = /\{([^{}]*kind:\s*'embed'[^{}]*)\}/g;
	let m;
	while ((m = objectRegex.exec(text))) {
		const body = m[1];
		const id = /id:\s*'([^']+)'/.exec(body)?.[1];
		const buildPath = /buildPath:\s*'([^']+)'/.exec(body)?.[1];
		// default matches resolveFrame() in the manifest: 'docked'
		const frame = /frame:\s*'([^']+)'/.exec(body)?.[1] ?? 'docked';
		if (id && buildPath) embeds.push({id, buildPath, frame});
	}
	return embeds;
}

async function main() {
	if (!existsSync(buildDir)) {
		console.error(
			`[embed] build dir not found: ${buildDir} (run vite build first)`,
		);
		process.exit(1);
	}

	const embeds = await readEmbedsFromSource();
	if (!embeds.length) {
		console.log('[embed] no embed projects declared. nothing to do.');
		return;
	}

	let failures = 0;
	for (const {id, buildPath, frame} of embeds) {
		const src = resolve(repoRoot, buildPath);
		// 'full'            -> the site takes over /<id>/ (replaces placeholder page)
		// 'docked'/'inline' -> the site lives at /<id>/_site/, and /<id>/ keeps the
		//                      hub page (banner) that iframes it.
		const wrapped = frame === 'docked' || frame === 'inline';
		const dest = wrapped ? join(baseDir, id, '_site') : join(baseDir, id);

		if (!existsSync(src)) {
			const msg = `[embed] ${id}: build not found at ${src}`;
			if (strict) {
				console.error(msg + ' (EMBED_STRICT=1)');
				failures++;
			} else {
				console.warn(msg + ': skipping (set EMBED_STRICT=1 to fail)');
			}
			continue;
		}

		const s = await stat(src);
		if (!s.isDirectory()) {
			console.error(`[embed] ${id}: ${src} is not a directory`);
			failures++;
			continue;
		}

		// For 'full', replace the prerendered placeholder folder with the real
		// site. For 'wrapped', keep the placeholder /<id>/index.html (the wrapper)
		// and only (re)create the /<id>/_site/ subfolder.
		await rm(dest, {recursive: true, force: true});
		await cp(src, dest, {recursive: true});
		const count = (await readdir(dest)).length;
		const rel = wrapped ? `${baseRel}/${id}/_site/` : `${baseRel}/${id}/`;
		console.log(
			`[embed] ${id} (${frame}): copied ${buildPath} -> ${rel} (${count} entries)`,
		);
	}

	if (failures) {
		console.error(`[embed] ${failures} project(s) failed.`);
		process.exit(1);
	}
	console.log('[embed] done.');
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
