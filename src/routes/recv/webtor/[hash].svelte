<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { formatMagnet } from '$lib/util/convert';

	let hash = $page.params.hash;

	onMount(() => {
		const WebTorrent = globalThis.WebTorrent;

		var client = new WebTorrent();

		client.add(magnet, (torrent) => {
			var interval = setInterval(function () {
				console.log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
			}, 5000)

			torrent.on('done', function () {
				console.log('Progress: 100%')
				clearInterval(interval)
			})
		});
	});
</script>

<div>
<p>WebTorrent Understood: {formatMagnet(hash)}</p>
</div>
