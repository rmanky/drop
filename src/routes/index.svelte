<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from '$lib/qrcode.svelte';

	const state = {
		messageLog: [],
		windowLocation: '',
		selfPeerId: '',
		connection: undefined
	};

	onMount(async () => {
		state.windowLocation = window.location.href;

		const Peer = (await import('peerjs')).default;
		const peer = new Peer({ debug: 3 });
		console.log('Created new peer');

		peer.on('open', (id) => {
			console.log(`Connected to server with ID ${id}`);
			state.selfPeerId = id;
		});

		peer.on('error', function (err) {
			console.log(err);
		});

		peer.on('connection', (conn) => {
			console.log(`Received connection from ${conn.peer}`);
			state.connection = conn;

			conn.on('data', (data) => {
				console.log(`Received data: ${data}`);
				state.messageLog = [...state.messageLog, data];
			});
		});
	});

	const fileSelected = (e: Event) => {
		const file = (e.target as HTMLInputElement).files[0];
		if (!file) {
			return;
		}

		file.arrayBuffer().then((buffer) => {
			state.connection.send({
				buffer,
				name: file.name,
				type: file.type
			});
		});
	};
</script>

<main>
	<h1>Drop</h1>

	<p>Your ID: {state.selfPeerId}</p>
	<a href={`recv/${state.selfPeerId}`}>Share Link</a>
	<p>Status: {state.connection ? 'Connnected' : 'Disconnected'}</p>

	<QRCode id={`${state.windowLocation}recv/${state.selfPeerId}`} />

	{#if state.connection}
		<input type="file" accept="*" on:change={(e) => fileSelected(e)} />
	{/if}

	<p>
		Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.
	</p>

	<p>
		Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for the officially supported
		framework, also powered by Vite!
	</p>
</main>
