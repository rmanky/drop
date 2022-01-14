<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from '$lib/qrcode.svelte';

	let messageLog = [];
	let windowLocation = '';
	let selfPeerId = '';

	onMount(async () => {
		windowLocation = window.location.href;

		const Peer = (await import('peerjs')).default;
		const peer = new Peer({ debug: 3 });
		console.log('Created new peer');

		peer.on('open', (id) => {
			console.log(`Connected to server with ID ${id}`);
			selfPeerId = id;
		});

		peer.on('error', function (err) {
			console.log(err);
		});

		peer.on('connection', (conn) => {
			console.log(`Received connection from ${conn.peer}`);

			conn.on('data', (data) => {
				console.log(`Received data: ${data}`);
				messageLog = [...messageLog, data];
			});
		});
	});
</script>

<main>
	<h1>Drop</h1>

	<p>Your ID: {selfPeerId}</p>
	<a href={`recv/${selfPeerId}`}>Share Link</a>

	<QRCode id={`${windowLocation}recv/${selfPeerId}`} />

	<p>{messageLog}</p>

	<p>
		Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.
	</p>

	<p>
		Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for the officially supported
		framework, also powered by Vite!
	</p>
</main>
