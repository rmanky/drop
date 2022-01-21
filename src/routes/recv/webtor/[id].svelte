<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { formatMagnet } from '$lib/util/convert';

	let id = $page.params.id;
	let magnet = '';
	let files = [];

	onMount(async () => {
		// Create Peer
		const peer = new globalThis.Peer();

		// setup WebTorrent and create client
		const WebTorrent = globalThis.WebTorrent;
		const client = new WebTorrent();

		console.log('Created new peer');

		peer.on('open', (selfId) => {
			console.log(`Connected to server with ID ${selfId}`);

			const connection = peer.connect(id);
			connection.on('open', () => {
				console.log('Connected to peer');
				connection.send('send nudes');
			});

			connection.on('data', (data) => {
				console.log(data);
				if (data.magnet) {
					magnet = data.magnet;
					console.log('Received magnet:', magnet);

					// Download torrent via magnet
					client.add(magnet, (torrent) => {
						torrent.files.forEach((file) => {
							file.getBlobURL((_, url) => {
								files = [
									...files,
									{
										name: file.name,
										url: url
									}
								];
							});
						});

						var interval = setInterval(function () {
							console.log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%');
						}, 5000);

						torrent.on('done', function () {
							console.log('Progress: 100%');
							clearInterval(interval);
						});
					});
				}
			});
		});
	});
</script>

<div>
	<p>{magnet}</p>
	<p>{files}</p>
	{#each files as file}
		<a href={file.url} download={file.name}>{file.name}</a>
	{/each}
</div>
