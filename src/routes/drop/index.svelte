<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from '$lib/comp/qrcode.svelte';
	import TransferRate from '$lib/comp/rate.svelte';
	import { formatBytes } from '$lib/util/convert';

	const chunkSizeOptions = [1024 * 10, 1024 * 100, 1024 * 1024, 1024 * 1024 * 5, 1024 * 1024 * 25];

	let rate;

	const state = {
		windowLocation: '',
		selfPeerId: '',
		connection: undefined,
		chunkSize: chunkSizeOptions[Math.floor(chunkSizeOptions.length / 2)]
	};

	const fileDetails = {
		name: '',
		size: 0,
		type: '',
		sent: 0
	};

	onMount(async () => {
		state.windowLocation = window.location.host;

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

			// conn.on('data', (data) => {
			// 	console.log(`Received data: ${data}`);
			// 	state.messageLog = [...state.messageLog, data];
			// });
		});
	});

	const fileSelected = (e: Event) => {
		let offset = 0;
		// set chunk size to 10MB
		const chunkSize = state.chunkSize;
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
			} else {
				rate.stop();
			}
		});

		const readSlice = (o) => {
			console.log(`Reading slice ${o}`);
			const slice = file.slice(o, o + chunkSize);
			fileReader.readAsArrayBuffer(slice);
		};

		rate.start();
		console.log(state);
		readSlice(0);
	};
</script>

<svelte:head>
	<title>Drop</title>
</svelte:head>

<div flex="~" flex-col items-center gap-8>
	<div flex="~" flex-col items-center gap-2 bg-blue-600 px-4 pt-4 pb-2 rounded-xl>
		{#if state.selfPeerId}
			<QRCode id={`${state.windowLocation}/recv/${state.selfPeerId}`} />
		{:else}
			<div bg-white w-180px h-180px />
		{/if}
		<p>Or, share <a href={`recv/${state.selfPeerId}`} underline="~">this link</a></p>
	</div>

	<div flex="~" flex-col items-center gap-2>
		<input disabled={!state.connection} type="file" accept="*" on:change={(e) => fileSelected(e)} />
		<progress w-full h-6 value={fileDetails.sent} max={fileDetails.size} />
	</div>

	<div flex="~" flex-col bg-dark-400 p-4 rounded-xl>
		<p>Status: {state.connection ? 'Connnected' : 'Disconnected'}</p>
		<!-- chunk size selector -->
		<div>
			<label for="chunkSize">Chunk Size:</label>
			<select bg-dark-600 text-light-200 id="chunkSize" bind:value={state.chunkSize}>
				{#each chunkSizeOptions as chunkSize}
					<option value={chunkSize}>{formatBytes(chunkSize)}</option>
				{/each}
			</select>
		</div>
		<TransferRate bind:this={rate} sent={fileDetails.sent} />
	</div>
	<a bg-blue-600 p-2 rounded text-4 href="/">Back Home</a>
</div>
