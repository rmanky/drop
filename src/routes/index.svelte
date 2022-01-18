<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from '$lib/qrcode.svelte';

	const state = {
		messageLog: [],
		windowLocation: '',
		selfPeerId: '',
		connection: undefined
	};

	const fileDetails = {
		name: '',
		size: 0,
		type: '',
		sent: 0
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
		let offset = 0;
		const chunkSize = 16384;
		const fileReader = new FileReader();
		const file = (e.target as HTMLInputElement).files[0];
		if (!file) {
			return;
		}

		fileDetails.name = file.name;
		fileDetails.size = file.size;
		fileDetails.type = file.type;
		fileDetails.sent = 0;

		// send information about the file
		state.connection.send({
			name: file.name,
			size: file.size,
			type: file.type
		});

		fileReader.addEventListener('load', (e) => {
			const chunk: ArrayBuffer = (e.target as FileReader).result as ArrayBuffer;
			state.connection.send(chunk);
			offset += chunk.byteLength;
			fileDetails.sent += chunk.byteLength;
			if (offset < file.size) {
				readSlice(offset);
			}
		});

		const readSlice = (o) => {
			console.log(`Reading slice ${o}`);
			const slice = file.slice(o, o + chunkSize);
			fileReader.readAsArrayBuffer(slice);
		};

		readSlice(0);
	};
</script>

<main>
	<h1 text="4xl" font="bold" p="6" align="center" bg="red-500">Drop</h1>

	<p>Your ID: {state.selfPeerId}</p>
	<a href={`recv/${state.selfPeerId}`}>Share Link</a>
	<p>Status: {state.connection ? 'Connnected' : 'Disconnected'}</p>

	<QRCode id={`${state.windowLocation}recv/${state.selfPeerId}`} />

	{#if state.connection}
		<input type="file" accept="*" on:change={(e) => fileSelected(e)} />
		<progress value={fileDetails.sent} max={fileDetails.size} />
	{/if}

	<p>
		Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.
	</p>

	<p>
		Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for the officially supported
		framework, also powered by Vite!
	</p>
</main>
