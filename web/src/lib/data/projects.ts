/**
 * The single source of truth for every project in the wighawag catalog.
 *
 * Every project resolves under `wighawag.com/<id>`. What `/<id>` DOES is chosen
 * per project by `kind`, but `kind` is OPTIONAL: when omitted, it is resolved
 * automatically from what the project has, in this order:
 *
 *   1. has `url`        -> redirect to the project's own website
 *   2. else has `sourcecode` -> redirect to the source repo
 *   3. else            -> render a hub details page (last-resort fallback)
 *
 * So a project with no site of its own does NOT get a bespoke page by default:
 * its home is its repo, and `/<id>` bounces there. Set `kind` explicitly only
 * to override that default:
 *
 *   - 'page'     -> force a hub-hosted details page at `/<id>` even if the
 *                   project has a url/sourcecode.
 *   - 'redirect' -> force a redirect (to `url`, else `sourcecode`).
 *   - 'embed'    -> copy the project's built static site into `/<id>/` at build
 *                   time (see scripts/embed-projects.mjs). `buildPath` points at
 *                   that project's `build/` output relative to the repo root.
 *
 * `ronan.eth.limo` (the personal site) can consume this same manifest to render
 * its portfolio grid, so the two sites never drift.
 */

export type ProjectKind = 'page' | 'redirect' | 'embed';

/** kind after applying the auto-resolution default (never 'undefined'). */
export type ResolvedKind = 'page' | 'redirect' | 'embed';

/**
 * For kind: 'embed', how the hosted site is presented at `/<id>`:
 *   - 'docked' -> (default) our top banner stays visible and the real site
 *                 fills the full width and remaining viewport height below it,
 *                 with its own scroll. Feels like the site docked under our nav.
 *   - 'inline' -> the real site is embedded in the page flow in an
 *                 auto-resizing iframe (no inner scroll; grows to content).
 *   - 'full'   -> `/<id>/` IS the project's site (full-page takeover, no banner).
 *                 Cards open it in a NEW TAB, since there is no hub header there.
 *
 * For 'docked' and 'inline' the embedded site is served at `/<id>/_site/` when
 * it is COPIED IN at build time (via `buildPath`), or loaded from a live remote
 * `embedUrl` when set (no build-time copy; the iframe points straight at that
 * URL). Defaults to 'docked' when omitted.
 */
export type EmbedFrame = 'docked' | 'inline' | 'full';

export interface Project {
	/** slug: resolves at wighawag.com/<id> */
	id: string;
	/** display name */
	name: string;
	/** one-line headline */
	title: string;
	/** longer description (shown on the card and the page) */
	description: string;
	/** how `/<id>` behaves; omit to auto-resolve (url -> sourcecode -> page) */
	kind?: ProjectKind;
	/** canonical external site, if any (used by redirect + as a card link) */
	url?: string;
	/** source repository */
	sourcecode?: string;
	/** for kind: 'embed', the built site folder (relative to the repo root) to
	 *  COPY into `/<id>/_site/` at build time. Mutually exclusive with `embedUrl`. */
	buildPath?: string;
	/** for kind: 'embed', a LIVE remote URL to iframe directly (no build-time
	 *  copy). Use for a project whose site is already hosted (e.g. GitHub Pages).
	 *  Mutually exclusive with `buildPath`. */
	embedUrl?: string;
	/** for kind: 'embed', full-page takeover or hub-wrapped iframe (default 'full') */
	frame?: EmbedFrame;
	/** optional thumbnail (relative to static/, e.g. /images/portfolio/x.png). When
	 *  omitted the card stays text-only (no forced generic image). */
	image?: string;
	/** optional tags for filtering / grouping */
	tags?: string[];
	/** show prominently at the top of the hub */
	featured?: boolean;
}

export const projects: Project[] = [
	// --- examples of every kind you asked for -------------------------------
	{
		id: 'dorfl',
		name: 'dorfl',
		title: 'A file-based work contract and autonomous runner for agents',
		description:
			'Discovers, schedules, claims and runs work across many repos, as a guided human loop or an unattended autonomous runner, on top of a file-based work/ contract and an atomic git-ref claim protocol.',
		url: 'https://wighawag.github.io/dorfl/',
		image: '/images/portfolio/dorfl-preview.png',
		sourcecode: 'https://github.com/wighawag/dorfl',
		featured: true,
		tags: ['tooling', 'agents'],
	},
	{
		id: 'fuzd',
		name: 'FUZD',
		title: 'Delayed, condition-based transaction execution',
		description:
			'A service to schedule the execution of encrypted transactions in the future, revealed only when the time comes.',
		url: 'https://fuzd.dev',
		image: '/images/portfolio/fuzd-preview.png',
		sourcecode: 'https://github.com/wighawag/fuzd',
		tags: ['tooling', 'web3'],
	},

	// --- projects with their own site: link/redirect ------------------------
	{
		id: 'conquest',
		name: 'conquest.eth',
		title: 'A Game of Strategy and Diplomacy Running on the EVM',
		description:
			'An unstoppable game of strategy and diplomacy running on the EVM. It allows players to collaborate through on-chain alliances while remaining sovereign. A first of its kind.',
		url: 'https://conquest.game',
		image: '/images/portfolio/conquest-preview.png',
		featured: true,
		tags: ['game'],
	},
	{
		id: 'stratagems',
		name: 'Stratagems',
		title: 'Stratagems, the infinite board game',
		description:
			'A persistent and permission-less game where a set of colors compete for the control of the board.',
		url: 'https://stratagems.world',
		sourcecode: 'https://github.com/wighawag/stratagems',
		image: '/images/portfolio/stratagems-preview.png',
		featured: true,
		tags: ['game'],
	},
	{
		id: 'ethernal',
		name: 'Ethernal',
		title: 'Multiplayer dungeon generated & owned by the players',
		description:
			'One of the first games fully running on the EVM. It let players explore (and generate) a dungeon to discover monsters and loot.',
		url: 'https://ethernal.world',
		sourcecode: 'https://github.com/0xgen0/ethernal',
		image: '/images/portfolio/ethernal-preview.png',
		featured: true,
		tags: ['game'],
	},
	{
		id: 'bleeps',
		name: 'bleeps.art',
		title: 'The Bleeps DAO and Its Fully Onchain Sounds',
		description:
			'The first composable sounds fully generated on-chain with zero externalities: no backend, no ipfs, no client-code, and a melody minter where some of the proceeds go to the Bleeps DAO and its members.',
		url: 'https://bleeps.art',
		image: '/images/portfolio/bleeps-preview.png',
		sourcecode: 'https://github.com/wighawag/bleeps',
		tags: ['art', 'onchain'],
	},
	{
		id: 'mandalas',
		name: 'mandalas.eth',
		title: 'On-chain Generative Bitmaps With Zero Externalities',
		description:
			'The first on-chain generative art project to make full use of tokenURI to remove all external dependencies. It generates SVG and Bitmap from the smart contract directly.',
		url: 'https://mandalas.eth.limo',
		image: '/images/portfolio/mandalas-preview.png',
		sourcecode: 'https://github.com/wighawag/mandalas',
		tags: ['art', 'onchain'],
	},
	{
		id: 'jolly-roger',
		name: 'Jolly Roger',
		title: 'Template to build decentralised applications',
		description:
			'A template to build production-ready decentralised applications with full support for IPFS. It combines the best tools out there including viem, hardhat and svelte.',
		url: 'https://jolly-roger.eth.limo',
		sourcecode: 'https://github.com/wighawag/jolly-roger',
		image: '/images/portfolio/jolly-roger-preview.png',
		featured: true,
		tags: ['tooling'],
	},
	{
		id: 'etherplay',
		name: 'Etherplay',
		title: 'Game Studio Building Unstoppable Games',
		description:
			'One of the oldest game studios in the blockchain gaming space. It created the first game playable with Metamask back in 2016.',
		url: 'https://etherplay.io',
		image: '/images/portfolio/etherplay-preview.png',
		tags: ['studio'],
	},
	{
		id: 'mystery-market',
		name: 'Mystery Market',
		title: 'A Market For Random NFTs',
		description:
			'The first of its kind. Mystery Market allowed anyone to randomize their NFTs and sell them on a fully decentralised marketplace.',
		url: 'https://mystery.market',
		image: '/images/portfolio/mystery-market-preview.png',
		tags: ['web3'],
	},
	{
		id: 'yooloot',
		name: 'YooLoot',
		title: 'On Chain Card Game For Loot',
		description:
			'A battle game for Loot. Each Loot token represents a set of cards that you have to strategically play to win.',
		// the yooloot.xyz site is down, so point at the source repo instead
		url: 'https://github.com/wighawag/yooloot',
		image: '/images/portfolio/yooloot-preview.png',
		sourcecode: 'https://github.com/wighawag/yooloot',
		tags: ['game'],
	},
	{
		id: 'embed-art',
		name: 'Embed.art',
		title: 'Embed Your Art Anywhere',
		description:
			'Platforms like twitter and facebook use meta tags to display previews when sharing a url. Embed.art gives you an easy way to share your token visuals on such platforms without running your own preview generator.',
		url: 'https://embed.art',
		image: '/images/portfolio/embed-art-preview.png',
		sourcecode: 'https://github.com/wighawag/embed-art',
		tags: ['tooling'],
	},
	{
		id: 'catacombs',
		name: 'Catacombs',
		title: 'A fully decentralised dungeon game',
		description:
			'A fully decentralised dungeon crawler where players enter at their own risk. Built as a fully on-chain, decentralised app and game, with pixel art by VEXED.',
		image: '/images/portfolio/catacombs-preview.png',
		sourcecode: 'https://github.com/wighawag/catacombs',
		tags: ['game', 'onchain'],
	},
	{
		id: 'duel-in-the-dark',
		name: 'Duel In The Dark',
		title: 'A hidden-information duel secured by ZK proofs',
		description:
			"A game where two players outwit each other to bring about their opponent's downfall while staying hidden. It uses Zero Knowledge Proofs to let the game run fairly on an open blockchain.",
		url: 'https://devfolio.co/projects/duel-in-the-dark-32c8',
		image: '/images/portfolio/duel-in-the-dark-preview.png',
		sourcecode: 'https://github.com/wighawag/duel-in-the-dark',
		tags: ['game', 'zk'],
	},
	{
		id: 'blue-coati',
		name: 'Blue Coati',
		title: 'Prediction-market based curation using off-chain betting',
		description:
			'A prediction-market based curation system using off-chain betting. A decentralised discussion platform is implemented as a demo, but is just one of many use cases.',
		url: 'https://showcase.ethglobal.com/hackfs/blue-coati',
		image: '/images/portfolio/blue-coati-preview.png',
		sourcecode: 'https://github.com/lichen-lab-ltd/Blue-Coati',
		tags: ['web3'],
	},

	// --- tools/libraries whose home is their repo: auto-redirect to source ---
	{
		id: 'anonctl',
		name: 'anonctl',
		title: 'Give one Unix account a leak-proof internet connection',
		description:
			'Forces everything a Unix account does (a shell, any tool, an editor, a script) through an anonymizer like Tor, enforced by the Linux kernel, fail-closed: if the anonymizer is down, that account\'s traffic is dropped, never sent in the clear. Ships a verify command that PROVES the account is anonymized instead of asking you to trust it.',
		sourcecode: 'https://github.com/wighawag/anonctl',
		tags: ['tooling', 'privacy', 'cli'],
	},
	{
		id: 'netcage',
		name: 'netcage',
		title: 'Run any containerized tool with its egress forced through a proxy, fail-closed',
		description:
			'Wraps a container image and command so ALL of its TCP and DNS egress is forced through a SOCKS5h proxy by the network layer (not the tool\'s own proxy awareness), fail-closed: if the proxy is unreachable, traffic is dropped, never sent to the host network. Ships a verify leak-test that proves no traffic escapes the proxy.',
		sourcecode: 'https://github.com/wighawag/netcage',
		tags: ['tooling', 'privacy', 'cli'],
	},
	{
		id: 'anonseed',
		name: 'anonseed',
		title: 'Seed a tool config into an anonymized identity',
		description:
			'A Go CLI that seeds the configuration a local-service-using tool needs into an anonymized identity, and declares the one direct-egress IP exception that tool requires (e.g. a LAN/loopback model server), so the tool is ready to run anonymized. It is a config seeder, not an account provisioner or a runtime launcher. Part of the anonctl / netcage family.',
		sourcecode: 'https://github.com/wighawag/anonseed',
		tags: ['tooling', 'privacy', 'cli'],
	},
	{
		id: 'hardhat-deploy',
		name: 'hardhat-deploy',
		title: 'Hardhat plugin for contract deployment and testing',
		description:
			'The hardhat plugin of choice to deploy contracts on the various EVM chains. It boasts a multitude of features, including Hot Contract Replacement and safe retries.',
		sourcecode: 'https://github.com/wighawag/hardhat-deploy',
		image: '/images/portfolio/hardhat-deploy-preview.png',
		featured: true,
		tags: ['tooling'],
	},

	// --- agent & developer tooling (home = repo) ----------------------------
	{
		id: 'webhands',
		name: 'webhands',
		title: 'Let your AI agent drive a real, logged-in browser on your own machine',
		description:
			'A small CLI (and MCP server) that gives an agent hands on a real Chromium browser. It reuses a browser YOU logged into yourself, on your machine and your IP, so the agent can read and act on the web apps you already use, via composable page verbs (goto, snapshot, click, type, eval, script, wait).',
		sourcecode: 'https://github.com/wighawag/webhands',
		tags: ['tooling', 'agents'],
	},
	{
		id: 'distilly',
		name: 'distilly',
		title: 'Distill HTML into clean, token-efficient markdown for agents',
		description:
			'Turns HTML into clean, token-efficient markdown for AI agents. The main entry point is pure and local: you hand it HTML you already have and it returns markdown, with no network I/O by default and adjustable output sizes.',
		sourcecode: 'https://github.com/wighawag/distilly',
		tags: ['tooling', 'agents'],
	},
	{
		id: 'wherever',
		name: 'Wherever',
		title: 'Multi-session remote control for the pi coding agent',
		description:
			'A modern, multi-session remote control platform for the pi coding agent: a standalone server, a web dashboard, and a CLI bridge extension. Manage many pi sessions concurrently across your workspace directories from the browser while your terminal CLI stays synced in real time.',
		image: '/images/portfolio/wherever-preview.png',
		sourcecode: 'https://github.com/wighawag/wherever',
		tags: ['tooling', 'agents'],
	},
	{
		id: 'iamhuman',
		name: 'iamhuman',
		title: 'A modular AI-driven CAPTCHA solver toolkit',
		description:
			'A modular, AI-driven toolkit that solves CAPTCHAs through a shared perceive / plan / act loop with pluggable solver brains and interchangeable front-ends (a browser extension and a Playwright driver). It is also designed to serve as the hands for webhands, letting an agent act on a real browser to get past a challenge.',
		sourcecode: 'https://github.com/wighawag/iamhuman',
		tags: ['tooling', 'agents'],
	},
	{
		id: 'skillfinder',
		name: 'skillfinder',
		title: 'Interactively link AI skills into a target directory via symlinks',
		description:
			'A CLI that recursively discovers AI skills (any directory containing a SKILL.md) under a source root, then lets you interactively toggle which ones are symlinked into a target directory (default ~/.agents/skills), grouped by their folder hierarchy.',
		sourcecode: 'https://github.com/wighawag/find-skills',
		tags: ['tooling', 'cli', 'agents'],
	},

	// --- npm packages: standalone libraries & CLIs (home = npm / repo) -------
	{
		id: 'rocketh',
		name: 'rocketh',
		title: 'A framework-agnostic smart contract deployment system for Ethereum',
		description:
			'A framework-agnostic deployment system for Ethereum-compatible networks: write deploy scripts once and run them anywhere (including in the browser), with deterministic CREATE2 / CREATE3 deployments and no lock-in to a single dev toolchain.',
		url: 'https://www.npmjs.com/package/rocketh',
		image: '/images/portfolio/rocketh-preview.png',
		sourcecode: 'https://github.com/wighawag/rocketh',
		tags: ['library', 'web3'],
	},
	{
		id: 'named-logs',
		name: 'named-logs',
		title: 'A minimal logging facade for libraries',
		description:
			'A tiny, zero-cost logging facade a library can depend on without imposing a logger on its users: the library logs through named-logs, and the host app decides at runtime whether (and how) those logs are shown by plugging in an implementation like named-logs-console.',
		url: 'https://www.npmjs.com/package/named-logs',
		sourcecode: 'https://github.com/wighawag/named-logs',
		tags: ['library'],
	},
	{
		id: 'named-logs-console',
		name: 'named-logs-console',
		title: 'A console implementation of the named-logs facade',
		description:
			'The console-backed implementation of the named-logs facade: it routes every log call to the browser/node console while preserving the original file and line, and supports per-namespace filtering (like debug) and log levels, so an app gets full control over library logging.',
		url: 'https://www.npmjs.com/package/named-logs-console',
		sourcecode: 'https://github.com/wighawag/named-logs-console',
		tags: ['library'],
	},
	{
		id: 'ldenv',
		name: 'ldenv',
		title: 'Load .env files by mode and run a command with them set',
		description:
			'Both a CLI and an importable module: it loads your .env / .env.local (and mode-specific) files and runs a command with that environment set, and can even resolve variable references directly inside the command line itself.',
		url: 'https://www.npmjs.com/package/ldenv',
		tags: ['library', 'cli'],
	},
	{
		id: 'ipfs-gateway-emulator',
		name: 'ipfs-gateway-emulator',
		title: 'A local dev server that emulates IPFS gateway behavior',
		description:
			'A local static server (built on lws / local-web-server) that emulates how an IPFS gateway serves a site: trailing-slash redirects and /ipfs/<hash> URLs, so you can test an IPFS-bound build locally before you pin it and be confident the paths resolve.',
		url: 'https://www.npmjs.com/package/ipfs-gateway-emulator',
		sourcecode: 'https://github.com/wighawag/local-web-server',
		tags: ['library', 'web'],
	},
	{
		id: 'pwag',
		name: 'pwag',
		title: 'Generate an optimized set of favicons and a PWA web manifest',
		description:
			'A CLI that generates an optimized, deliberately small set of favicons and a web manifest from a single input image and a config file, following modern favicon best practice, and can optionally inject the matching PWA meta tags into your HTML.',
		url: 'https://www.npmjs.com/package/pwag',
		sourcecode: 'https://github.com/wighawag/pwag',
		tags: ['library', 'web'],
	},
	{
		id: 'set-defaults',
		name: 'set-defaults',
		title: 'Copy checked-in default files to their real, git-ignored names',
		description:
			'A small helper that copies committed default files (e.g. a `foo.default.json`) to their actual, usually git-ignored, filename (`foo.json`), so a fresh checkout gets working local config in one step.',
		url: 'https://www.npmjs.com/package/set-defaults',
		tags: ['library'],
	},
	{
		id: 'as-soon',
		name: 'as-soon',
		title: 'Watch files and run a command as soon as they change',
		description:
			'A lightweight file watcher that runs a command as soon as watched files or directories change, with debounced execution, support for watching files that do not exist yet, and automatic re-subscription when a watched directory is deleted and recreated. Handy for rebuild/test/restart dev loops.',
		url: 'https://www.npmjs.com/package/as-soon',
		sourcecode: 'https://github.com/wighawag/as-soon',
		tags: ['library', 'cli'],
	},
	{
		id: 'forge-exec',
		name: 'forge-exec',
		title: 'Run external programs from Forge over a 2-way channel',
		description:
			'Lets a Foundry (forge) script execute an external program and talk to it over an open two-way communication channel, so a Solidity test or deploy script can drive and exchange data with tooling outside the EVM.',
		url: 'https://www.npmjs.com/package/forge-exec',
		sourcecode: 'https://github.com/wighawag/forge-exec',
		tags: ['library', 'web3'],
	},
	{
		id: 'solidity-kit',
		name: 'solidity-kit',
		title: 'Base Solidity contracts and utilities',
		description:
			'A set of reusable base Solidity contracts and utilities: ERC20 (with ERC2612 permit), ERC721 (with ERC4494 and on-chain tokenURI helpers), ERC165 and ERC173 building blocks, plus utilities like Multicall and a Guardian, ready to build production token contracts on.',
		url: 'https://www.npmjs.com/package/solidity-kit',
		tags: ['library', 'web3'],
	},
	{
		id: 'solidity-proxy',
		name: 'solidity-proxy',
		title: 'Upgradeable proxy contracts, including an immutable router',
		description:
			'A collection of Solidity proxy patterns for upgradeable contracts: ERC1967 storage, ERC173 ownership, a Diamond (multi-facet) implementation, and an immutable router that dispatches calls to fixed implementations without a mutable storage slot.',
		url: 'https://www.npmjs.com/package/solidity-proxy',
		tags: ['library', 'web3'],
	},
	{
		id: 'remote-sql',
		name: 'remote-sql',
		title: 'A unified TypeScript interface for batch-based remote SQL',
		description:
			'A type-safe TypeScript interface that abstracts remote SQL databases which only support batch transactions, with prepared statements and parameter binding and ready-made backends for Cloudflare D1 and LibSQL behind one common API.',
		url: 'https://www.npmjs.com/package/remote-sql',
		sourcecode: 'https://github.com/wighawag/remote-sql',
		tags: ['library'],
	},
	{
		id: 'remote-procedure-call',
		name: 'remote-procedure-call',
		title: 'Type-safe JSON-RPC clients with optional rate-limiting',
		description:
			'A TypeScript library for building JSON-RPC clients with full type safety (pass a method map and every call is typed), plus error handling and optional rate-limiting, offered as both a curried and a proxied API.',
		url: 'https://www.npmjs.com/package/remote-procedure-call',
		tags: ['library'],
	},
	{
		id: 'synqable',
		name: 'synqable',
		title: 'Build syncable, local-first stores with CRDT conflict resolution',
		description:
			'A TypeScript library for building local-first stores: data lives locally and syncs to a server when available, with last-writer-wins CRDT merges, multi-account switching, a type-safe schema, and pluggable storage. Works as a Svelte store out of the box.',
		url: 'https://www.npmjs.com/package/synqable',
		tags: ['library'],
	},
	{
		id: 'purgatory',
		name: 'purgatory',
		title: 'A local mempool proxy to intercept and hold Ethereum transactions',
		description:
			'An RPC proxy that sits between your app and an Ethereum node: it intercepts `eth_sendRawTransaction`, holds transactions in a local mempool, and gives you full control (including gas-price filtering) over when and how they are forwarded upstream. Ideal for debugging and testing mempool behavior.',
		url: 'https://www.npmjs.com/package/purgatory',
		tags: ['library', 'web3'],
	},
	{
		id: 'radiate',
		name: 'radiate',
		title: 'A minimal, type-safe event emitter for TypeScript',
		description:
			'A tiny, tree-shakeable, zero-dependency event emitter for TypeScript with fully typed event maps and listeners and a simple `on` / `off` / `once` / `emit` API. The event-emission core behind observator.',
		url: 'https://www.npmjs.com/package/radiate',
		sourcecode: 'https://github.com/wighawag/radiate',
		tags: ['library'],
	},
	{
		id: 'etherkit-tx-observer',
		name: '@etherkit/tx-observer',
		title: 'Track Ethereum transactions through their lifecycle, reactively',
		description:
			'A lightweight TypeScript library that tracks Ethereum transactions across their whole lifecycle (pending, mined, confirmed, dropped) and emits reactive updates as their status changes. It is the tx-observer package of the etherkit collection, replacing the standalone ethereum-tx-observer.',
		url: 'https://www.npmjs.com/package/@etherkit/tx-observer',
		sourcecode: 'https://github.com/wighawag/etherkit',
		tags: ['library', 'web3'],
	},
	{
		id: 'webveil',
		name: 'webveil',
		title: 'Anonymous-capable, self-hosted, account-free web search and fetch for agents',
		description: 'Anonymous-capable, self-hosted, account-free web search and fetch for agents. CLI + MCP (built on incur), pi-agnostic. Swappable backend and egress (direct, http proxy, socks5/Tor).',
		url: 'https://www.npmjs.com/package/webveil',
		sourcecode: 'https://github.com/wighawag/webveil',
		tags: ['tooling'],
	},
	{
		id: 'eip-1193',
		name: 'eip-1193',
		title: 'TypeScript types for the EIP-1193 Ethereum provider',
		description:
			'A dependency-free set of TypeScript type definitions for the EIP-1193 Ethereum provider interface (the request/event contract every wallet and dapp speaks), so your code can talk to any injected provider with full type safety.',
		url: 'https://www.npmjs.com/package/eip-1193',
		tags: ['library', 'web3'],
	},
	{
		id: 'ethereum-indexer',
		name: 'ethereum-indexer',
		title: 'A lightweight, modular Ethereum event indexer that runs anywhere',
		description:
			'A lightweight, modular Ethereum event indexer that runs anywhere JavaScript does (browser, node, or workers). You supply a processor that folds contract events into state and a store to persist it, and it handles the fetch/reorg/replay loop, so an app can index directly on the client with no backend.',
		url: 'https://www.npmjs.com/package/ethereum-indexer',
		image: '/images/portfolio/ethereum-indexer-preview.png',
		tags: ['library', 'web3'],
	},
	{
		id: 'missiv',
		name: 'missiv',
		title: 'A messaging system for Ethereum accounts',
		description:
			'Lets Ethereum accounts send each other encrypted messages, stored by a backend (Bun or Cloudflare Workers) and retrieved by clients, with real-time delivery over WebSockets. When a recipient has no public key on record yet, the sender can reach them with a clear-text introduction to make first contact.',
		url: 'https://www.npmjs.com/package/missiv',
		sourcecode: 'https://github.com/wighawag/missiv',
		tags: ['library', 'web3'],
	},
	{
		id: 'observator',
		name: 'observator',
		title: 'A type-safe observable store that emits JSON Patch on each change',
		description:
			'A type-safe observable store that emits an event for each top-level field change, with the callback receiving a JSON Patch (RFC 6902) array. Supports fine-grained keyed and value-based subscriptions and id-based array tracking. Built on patch-recorder and radiate.',
		url: 'https://www.npmjs.com/package/observator',
		sourcecode: 'https://github.com/wighawag/observator',
		tags: ['library'],
	},
	{
		id: 'patch-recorder',
		name: 'patch-recorder',
		title: 'Record JSON Patch from mutations via a proxy',
		description:
			'Wraps objects, arrays, Maps and Sets in a proxy and records every mutation as a JSON Patch (RFC 6902) array as it happens. It mutates in place (original reference kept, no copying), so you get accurate, immediate patches with zero memory overhead and full type safety. The mutation-recording core behind observator.',
		url: 'https://www.npmjs.com/package/patch-recorder',
		sourcecode: 'https://github.com/wighawag/patch-recorder',
		tags: ['library'],
	},
	{
		id: 'unisig',
		name: 'unisig',
		title: 'Universal signals: a facade over any signal library',
		description:
			'A framework-agnostic, zero-dependency facade over any signal library\'s reactive primitives (reactive, signal, effect), with pluggable adapters for Svelte 5 and Solid.js so libraries can stay reactivity-agnostic.',
		sourcecode: 'https://github.com/wighawag/unisig',
		tags: ['library'],
	},
	{
		id: 'schema-for',
		name: 'schema-for',
		title: 'Pin a Zod schema to your canonical TypeScript types by exact identity',
		description:
			'A tiny, zero-dependency Zod 4 helper that forces, at compile time, a schema\'s input and output types to be EXACTLY your hand-written canonical types (not just assignable), so it catches extra keys and narrowed values the usual annotation lets through. Transform-aware and zero runtime cost.',
		sourcecode: 'https://github.com/wighawag/schema-for',
		tags: ['library'],
	},
	{
		id: 'picopilot',
		name: 'picopilot',
		title: 'An agent-first toolchain for PICO-8 game development',
		description:
			'An agent-first toolchain that makes PICO-8 game development easy with an LLM, built on the incur CLI framework: text-based tools for sprites, SFX/music, running, playtesting and exporting a cart, all designed to be driven by a coding agent.',
		url: 'https://www.npmjs.com/package/picopilot',
		image: '/images/portfolio/picopilot-preview.png',
		sourcecode: 'https://github.com/wighawag/picopilot',
		tags: ['tooling'],
	},
	{
		id: 'werust',
		name: 'werust',
		title: 'A from-scratch web browser in Rust for a post-trusted-server web',
		description:
			'A from-scratch, general-purpose web browser written in Rust for a "post-trusted-server" web: native ipfs:// resolution, a native Ethereum (EIP-1193) provider with ENS-name resolution, privacy-protecting and local-first, while staying fully compatible with the normal server web. Ships headless resolve/version subcommands so an ENS-to-CID resolution can be scripted over ssh.',
		sourcecode: 'https://github.com/wighawag/werust',
		tags: ['tooling', 'web3'],
	},

	// --- web3 libraries & tooling (home = npm / repo) --------------------
	{
		id: 'clones-with-immutable-args',
		name: 'clones-with-immutable-args',
		title: 'Deploy parametrized clone contracts with immutable arguments',
		description:
			'Creates clone contracts whose immutable arguments are stored in the code region of the proxy and appended to the delegatecall calldata on every call, so the implementation reads them straight from calldata. Cheaper to deploy and to run than EIP-1167 (no storage writes/loads), since the parameters live in code, not storage.',
		url: 'https://www.npmjs.com/package/clones-with-immutable-args',
		sourcecode: 'https://github.com/wighawag/clones-with-immutable-args',
		tags: ['library', 'web3'],
	},
	{
		id: 'ethereum-contracts-test-suite',
		name: 'ethereum-contracts-test-suite',
		title: 'A test suite for Ethereum contracts',
		description:
			'A reusable test suite for Ethereum smart contracts, providing assertions and helpers to exercise contract behavior across scenarios so a project can ship a thorough, shared test harness rather than rewriting one each time.',
		url: 'https://www.npmjs.com/package/ethereum-contracts-test-suite',
		sourcecode: 'https://github.com/wighawag/ethereum-contracts-test-suite',
		tags: ['library', 'web3'],
	},
	{
		id: 'embedded-eth-node',
		name: 'embedded-eth-node',
		title: 'A slim, in-browser EIP-1193 Ethereum node',
		description:
			'A slim, execution-only in-browser EIP-1193 Ethereum node built on @ethereumjs/vm. It sits between bare EVM.runCall (too low-level: no blocks/receipts/logs) and a full in-browser node (heavy): it runs real transactions with a minimal mock block/receipt/log layer, exposing a standard provider so an app or test can use a real EVM without a backend.',
		url: 'https://www.npmjs.com/package/embedded-eth-node',
		sourcecode: 'https://github.com/wighawag/embedded-eth-node',
		tags: ['library', 'web3'],
	},
	{
		id: 'revm-wasm',
		name: 'revm-wasm',
		title: 'revm compiled to WebAssembly, with a typed JS API',
		description:
			'An unofficial binding that compiles revm (bluealloy, MIT) to WebAssembly with a typed JavaScript API, so you can run a real EVM in a browser (or any JS runtime) with no Rust toolchain. The EVM is revm\'s; this package is the build config, host interface and decoder.',
		url: 'https://www.npmjs.com/package/revm-wasm',
		sourcecode: 'https://github.com/wighawag/revm-wasm',
		tags: ['library', 'web3'],
	},
	{
		id: 'tools-ethereum',
		name: 'tools-ethereum',
		title: 'An Ethereum CLI and MCP server',
		description:
			'A comprehensive Ethereum toolkit usable as a CLI (ecli) or as an MCP server for AI assistants, covering reading chain data, sending transactions and interacting with smart contracts. One binary, two interfaces: the same operations from the terminal or from an agent.',
		url: 'https://www.npmjs.com/package/tools-ethereum',
		sourcecode: 'https://github.com/wighawag/mcp-ethereum',
		tags: ['tooling', 'web3', 'agents'],
	},
	{
		id: 'ezx',
		name: 'ezx',
		title: 'An enhanced zx with markdown preprocessing for shell scripts',
		description:
			'An enhanced version of zx that fixes markdown parsing annoyances (indentation, code fences) so you can write shell scripts as markdown, plus quality-of-life features that smooth over the common rough edges when scripting with zx.',
		url: 'https://www.npmjs.com/package/ezx',
		sourcecode: 'https://github.com/wighawag/ezx',
		tags: ['tooling', 'cli'],
	},
	{
		id: 'faucet-server',
		name: 'faucet-server',
		title: 'A configurable EVM faucet server',
		description:
			'A configurable EVM faucet server that dispenses testnet/devnet tokens with optional Prosopo captcha protection. Supports multiple chains and runs on Cloudflare Workers or Node.js.',
		url: 'https://www.npmjs.com/package/faucet-server',
		sourcecode: 'https://github.com/wighawag/faucet',
		tags: ['tooling', 'web3'],
	},
	{
		id: 'template-ethereum-contracts',
		name: 'template-ethereum-contracts',
		title: 'A production-ready Ethereum smart contract dev template',
		description:
			'A production-ready template for developing EVM smart contracts with Hardhat v3 and hardhat-deploy v2 plus the rocketh deployment system. It pairs a flexible, script-based deploy system with sensible defaults so a new contract project starts ready to build, test and deploy.',
		url: 'https://www.npmjs.com/package/template-ethereum-contracts',
		sourcecode: 'https://github.com/wighawag/template-ethereum-contracts',
		tags: ['tooling', 'web3'],
	},
	{
		id: 'etherplay-connect',
		name: '@etherplay/connect',
		title: 'Wallet connection with session accounts and social login',
		description:
			'A modern wallet connection library with seamless authentication via session accounts. It supports both social login (email, OAuth, mnemonic) and traditional Web3 wallet connections, and keeps session accounts that persist across device and browser sessions.',
		url: 'https://www.npmjs.com/package/@etherplay/connect',
		sourcecode: 'https://github.com/wighawag/etherplay-connect',
		tags: ['library', 'web3'],
	},
	{
		id: 'push-notification-service-server',
		name: 'push-notification-service-server',
		title: 'A self-hostable Web Push notification server',
		description:
			'A self-hostable push notification server that delivers Web Push notifications to subscribed browsers, so an app can send real-time updates without depending on a third-party push service.',
		url: 'https://www.npmjs.com/package/push-notification-service-server',
		tags: ['library', 'web'],
	},
	{
		id: 'use-stores',
		name: 'use-stores',
		title: 'Generate React hooks from Svelte-like stores',
		description:
			'A small, zero-dependency utility (only a peer dep on React) that turns any observable following the Svelte store contract into a React hook, so a shared store can be consumed in both Svelte and React apps.',
		url: 'https://www.npmjs.com/package/use-stores',
		sourcecode: 'https://github.com/wighawag/use-stores',
		tags: ['library'],
	},
	{
		id: 'expand-vars',
		name: 'expand-vars',
		title: 'Expand env vars in a command line, then run it, cross-platform',
		description:
			'Expands environment variables in a command line, then runs it, identically on every platform. It fixes the npm-scripts footgun where $npm_package_name is expanded by sh on Unix but passed through literally by cmd.exe on Windows, so a script that works on one OS breaks on the other.',
		url: 'https://www.npmjs.com/package/expand-vars',
		sourcecode: 'https://github.com/wighawag/expand-vars',
		tags: ['library', 'cli'],
	},
	{
		id: 'change-name',
		name: 'change-name',
		title: 'Replace a name across a folder: files, dirs and contents',
		description:
			'A CLI that recursively renames files and directories and replaces a name inside text file contents, so a rename or rebrand propagates everywhere in a project in one pass.',
		url: 'https://www.npmjs.com/package/change-name',
		sourcecode: 'https://github.com/wighawag/change-name',
		tags: ['tooling', 'cli'],
	},
	{
		id: 'pinnace',
		name: 'pinnace',
		title: 'Self-host a static site on IPFS across your own nodes',
		description:
			'Self-host a static website on IPFS across one or more self-owned Kubo nodes, without a paid pinning service. pinnace provisions the nodes, deploys your site as a content-addressed archive pinned on every node with the same CID, manages mutable ipns:// names with key-derived per-site keys and publisher/replica failover, keeps gateway caches warm, and emits CI steps. It is both a CLI and a TypeScript library.',
		url: 'https://www.npmjs.com/package/pinnace',
		image: '/images/portfolio/pinnace-preview.png',
		sourcecode: 'https://github.com/wighawag/pinnace',
		tags: ['tooling', 'web3'],
	},
];

export function bySlug(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}

/**
 * Resolve the effective kind for a project, applying the default when `kind`
 * is omitted: url -> redirect, else sourcecode -> redirect, else page.
 */
export function resolveKind(p: Project): ResolvedKind {
	if (p.kind) return p.kind;
	if (p.url || p.sourcecode) return 'redirect';
	return 'page';
}

/** The URL a redirect for this project should send visitors to (url first). */
export function redirectTarget(p: Project): string | undefined {
	return p.url ?? p.sourcecode;
}

/** Effective embed frame for a project (default 'docked'). */
export function resolveFrame(p: Project): EmbedFrame {
	return p.frame ?? 'docked';
}

/**
 * The iframe src for an embed project: the live `embedUrl` when set, else the
 * build-time-copied site at `./_site/` (relative to the `/<id>/` page).
 */
export function embedSrc(p: Project): string {
	return p.embedUrl ?? './_site/';
}

/** True when this embed is a live remote URL rather than a copied-in build. */
export function isRemoteEmbed(p: Project): boolean {
	return Boolean(p.embedUrl);
}

export const embeddedProjects = projects.filter((p) => resolveKind(p) === 'embed');
