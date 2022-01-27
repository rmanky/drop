<script lang="ts">
	import 'uno.css';
	import '@unocss/reset/tailwind.css';
	import { title } from '$lib/stores.ts';
</script>

<svelte:head>
	<title>{$title}</title>
</svelte:head>

<header flex="~" justify-center py-4>
	<h1 text-3xl font-bold>{$title}</h1>
</header>

<main>
<slot />
</main>

<style>
:global(body) {
	color: #fafafa;
	background: #0f0f0f;
}
</style>
