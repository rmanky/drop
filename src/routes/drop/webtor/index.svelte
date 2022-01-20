<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from '$lib/comp/qrcode.svelte';
  import { formatMagnet } from '$lib/util/convert';

	let fileSelected;
	let infoHash;

	onMount(() => {
		const WebTorrent = globalThis.WebTorrent;

		var client = new WebTorrent();

		fileSelected = (e) => {
			const file = e.target.files[0];
			client.seed(file, (torrent) => {
    		console.log(torrent)
				infoHash = torrent.infoHash;
  		});
		};
	});
</script>

<input type="file" accept="*" on:change={(e) => fileSelected(e)} />
<p>MagnetURI: {formatMagnet(infoHash)}</p>
<a href={`/recv/webtor/${infoHash}`}>Share Link</a>
<QRCode id={infoHash ?? 'sus'}/>