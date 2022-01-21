<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from '$lib/comp/qrcode.svelte';
	import { formatMagnet } from '$lib/util/convert';

	let fileSelected;
	let selfPeerId;
	let client;
	let windowLocation;
	let torrent;

	onMount(async () => {
		// const Peer = (await import('peerjs')).default;
		const peer = new globalThis.Peer({ debug: 3 });

		const WebTorrent = globalThis.WebTorrent;
		client = new WebTorrent();

		console.log('Created new peer');
		windowLocation = window.location.host;

		peer.on('open', (id) => {
			console.log(`Connected to server with ID ${id}`);
			selfPeerId = id;
		});

		peer.on('error', function (err) {
			console.log(err);
		});

		peer.on('connection', (connection) => {
			console.log(`Received connection from ${connection.peer}`);

			connection.on('data', (data) => {
				if (data === 'send nudes') {
					connection.send({ magnet: torrent.magnetURI });
				}
			});
		});

		fileSelected = (e: Event) => {
			const file = (e.target as HTMLInputElement).files[0];
			client.seed(file, (_torrent) => {
				torrent = _torrent;
				console.log(torrent);
			});
		};

		setInterval(() => (client = client), 1000);
	});
</script>

<template>
	<a href={`/recv/webtor/${selfPeerId}`}>Share Link</a>
	<QRCode id={`${windowLocation}/recv/webtor/${selfPeerId}`} />
	<input type="file" accept="*" on:change={(e) => fileSelected(e)} />
	{#if client}
		<p>{torrent}</p>
		<p>{client.progress}</p>
		<p>{client.uploadSpeed}</p>
		<p>{client.downloadSpeed}</p>
	{/if}
</template>
