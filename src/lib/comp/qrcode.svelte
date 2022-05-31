<script lang="ts">
	import QRCode from 'qrcode';

	export let id: string;
	let canvas;

	$: if (id && canvas) {
		QRCode.toCanvas(canvas, id);
	}
</script>

<canvas bind:this={canvas} width="256" height="256" />
