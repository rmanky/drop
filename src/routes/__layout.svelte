<script lang="ts">
	import 'uno.css';
	import '@unocss/reset/tailwind.css';
</script>

<main>
	<slot />
</main>

<style>
	:global(body) {
		color: #fafafa;
		background: #0f0f0f;
		padding: 24px;
	}

	:global(html, body, main) {
		height: 100%
	}
</style>
