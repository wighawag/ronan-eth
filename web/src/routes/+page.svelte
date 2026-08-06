<script lang="ts">
	import Head from '$lib/Head.svelte';
	import {route} from '$lib/core/config';
</script>

<Head home={true} />

<div class="bg-black">
	<!-- Header -->
	<div class="relative bg-gray-200 pb-32">
		<div class="absolute inset-0">
			<img
				class="h-full w-full object-cover"
				src="/images/header-background.jpeg"
				alt=""
			/>
			<div
				class="absolute inset-0 bg-gray-800 mix-blend-multiply"
				aria-hidden="true"
			></div>
		</div>
		<div
			class="relative mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 sm:pb-32 lg:px-8"
		>
			<div class="flex items-start space-x-5">
				<div class="flex-shrink-0">
					<div class="relative">
						<img
							class="h-16 w-16 rounded-full"
							src="/maskable_icon_512x512.png"
							alt="Ronan Sandford"
						/>
						<span
							class="absolute inset-0 rounded-full shadow-inner"
							aria-hidden="true"
						></span>
					</div>
				</div>
				<div class="pt-1.5">
					<h1 class="text-3xl font-bold text-gray-100">Ronan Sandford</h1>
					<p class="text-base font-medium text-gray-400">
						Game Developer, Web3 Architect and Creative Tinkerer.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Overlapping cards -->
	<section
		class="relative z-10 mx-auto -mt-32 max-w-7xl px-4 pb-8 sm:px-6 lg:px-8"
	>
		<div class="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
			<div class="flex flex-col rounded-2xl bg-black shadow-xl">
				<div class="relative flex-1 px-6 pt-16 pb-8 md:px-8">
					<div
						class="absolute top-0 inline-block -translate-y-1/2 rounded-xl shadow-lg"
					>
						<img
							class="h-16 w-16"
							src="/images/portfolio/conquest-icon.png"
							alt="game developer"
						/>
					</div>
					<h3 class="text-xl font-medium text-gray-100">Game Developer</h3>
					<p class="mt-4 text-base text-gray-400">
						Professional Game Developer since 2010. Founder of
						<a class="text-yellow-300 underline" href="https://etherplay.io"
							>Etherplay</a
						>, building Autonomous Worlds:
						<a class="text-yellow-300 underline" href="https://conquest.game"
							>Conquest.eth</a
						>
						and
						<a class="text-yellow-300 underline" href="https://stratagems.world"
							>Stratagems</a
						>
					</p>
				</div>
			</div>

			<div class="flex flex-col rounded-2xl bg-black shadow-xl">
				<div class="relative flex-1 px-6 pt-16 pb-8 md:px-8">
					<div
						class="absolute top-0 inline-block -translate-y-1/2 rounded-xl shadow-lg"
					>
						<img
							class="h-16 w-16"
							src="/images/portfolio/hardhat-deploy-icon.png"
							alt="web3 architect"
						/>
					</div>
					<h3 class="text-xl font-medium text-gray-100">Web3 Architect</h3>
					<p class="mt-4 text-base text-gray-400">
						Participating in Web3 Standards like
						<a
							class="text-yellow-300 underline"
							href="https://eips.ethereum.org/EIPS/eip-1155">EIP-1155</a
						>
						while also building tools for the web3 /
						<a
							class="text-yellow-300 underline"
							href="https://ethereum.org"
							target="_blank"
							rel="noreferrer">ethereum</a
						>
						ecosystem, including
						<a
							class="text-yellow-300 underline"
							href="https://github.com/wighawag/hardhat-deploy"
							>hardhat-deploy</a
						>
						and
						<a
							class="text-yellow-300 underline"
							href="https://jolly-roger.eth.limo">jolly-roger</a
						>
					</p>
				</div>
			</div>

			<div class="flex flex-col rounded-2xl bg-black shadow-xl">
				<div class="relative flex-1 px-6 pt-16 pb-8 md:px-8">
					<div
						class="absolute top-0 inline-block -translate-y-1/2 rounded-xl shadow-lg"
					>
						<img
							class="h-16 w-16"
							src="/images/portfolio/mandalas-icon.png"
							alt="tinkerer"
						/>
					</div>
					<h3 class="text-xl font-medium text-gray-100">Creative Tinkerer</h3>
					<p class="mt-4 text-base text-gray-400">
						I like to tinker with technology in general and have been delving
						into generative art and fully on-chain NFTs with
						<a
							class="text-yellow-300 underline"
							href="https://mandalas.eth.limo">Mandalas</a
						>
						and
						<a class="text-yellow-300 underline" href="https://bleeps.art"
							>Bleeps</a
						>
					</p>
				</div>
			</div>
		</div>
	</section>
</div>

<div class="bg-black">
	<div
		class="mx-auto max-w-7xl px-4 pt-4 pb-12 text-center sm:px-6 lg:px-8 lg:pb-16"
	>
		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a
				href={route('blog/')}
				class="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-300 px-4 py-3 text-base font-medium text-black hover:bg-yellow-500 sm:px-16"
			>
				Read My Blog
			</a>
			<a
				href={route('portfolio/')}
				class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-4 py-3 text-base font-medium text-yellow-300 hover:bg-gray-700 sm:px-16"
			>
				Check My Portfolio
			</a>
		</div>
	</div>
</div>
