<script lang="ts">
	// A generic 2:1 banner for projects that ship no preview image: the project
	// name set on a dark, faintly-gridded background in the site's accent yellow.
	// Rendered inline as SVG so there are zero image files to maintain and it
	// adapts to any project name automatically.
	let {name}: {name: string} = $props();

	// Banner geometry.
	const W = 640;
	const H = 320;
	const PAD = 48; // horizontal breathing room on each side
	const MAX_TEXT = W - PAD * 2;

	// Pick a comfortable size from the name length. In a monospace face each
	// glyph is ~0.6em wide, so estimate the natural width and only clamp with
	// textLength when it would overflow (so short names are NOT stretched).
	const fontSize = $derived(name.length > 22 ? 42 : name.length > 14 ? 52 : 64);
	const naturalWidth = $derived(name.length * fontSize * 0.6);
	const clamp = $derived(naturalWidth > MAX_TEXT);
	const gridId = $derived(
		`grid-${name.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'x'}`,
	);
</script>

<svg
	class="h-full w-full"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="xMidYMid slice"
	role="img"
	aria-label={name}
>
	<defs>
		<pattern id={gridId} width="32" height="32" patternUnits="userSpaceOnUse">
			<path d="M32 0H0V32" fill="none" stroke="#1f2937" stroke-width="1" />
		</pattern>
	</defs>
	<rect width={W} height={H} fill="#0a0a0a" />
	<rect width={W} height={H} fill="url(#{gridId})" />
	<text
		x={W / 2}
		y={H / 2}
		text-anchor="middle"
		dominant-baseline="middle"
		textLength={clamp ? MAX_TEXT : undefined}
		lengthAdjust={clamp ? 'spacingAndGlyphs' : undefined}
		font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
		font-weight="700"
		font-size={fontSize}
		fill="#fde047"
	>
		{name}
	</text>
</svg>
