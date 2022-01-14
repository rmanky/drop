<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	export let id: string;
	let canvas;

	$: if (id && canvas) {
		QRCode.toCanvas(canvas, id);
	}
</script>

<canvas bind:this={canvas} width="200" height="200" />
