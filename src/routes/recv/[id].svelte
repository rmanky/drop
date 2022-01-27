<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import download from 'downloadjs';
	import TransferRate from '$lib/comp/rate.svelte';
	import { formatBytes } from '$lib/util/convert';
	import { title } from '$lib/stores.ts';
  title.set('Receive');

	let targetId = $page.params.id;
	let rate;

	const state = {
		connection: undefined,
		chunks: []
	};

	const fileDetails = {
		name: '',
		size: 0,
		type: '',
		received: 0
	};

	onMount(async () => {
		// download random file
		const Peer = (await import('peerjs')).default;
		const peer = new Peer({ debug: 3 });
		console.log('Created new peer');

		peer.on('open', (selfId) => {
			console.log(`Connected to server with ID ${selfId}`);

			state.connection = peer.connect(targetId);
			state.connection.on('open', () => {
				console.log('Connected to peer');
			});

			state.connection.on('data', (data) => {
				// check if the data is an object or buffer
				if (data.constructor === Object) {
					fileDetails.name = data.name;
					fileDetails.size = data.size;
					fileDetails.type = data.type;
					fileDetails.received = 0;
					state.chunks = [];
					console.log(`Received file details: ${JSON.stringify(fileDetails)}`);
				} else {
					// if chunks is empty, start rate
					if (state.chunks.length === 0) {
						rate.start();
					}
					state.chunks.push(data);
					fileDetails.received += data.byteLength;
					console.log(`Received chunk of ${data.byteLength} bytes`);
				}

				if (fileDetails.received === fileDetails.size) {
					// download the chunks with the file name and type
					// merge the chunks of ArrayBuffer
					console.log(`Received all ${fileDetails.size} bytes`);
					rate.stop();
					const blob = new Blob(state.chunks);

					download(blob, fileDetails.name, fileDetails.type);
				}
			});
		});

		peer.on('error', function (err) {
			console.log(err);
		});
	});
</script>

<div>
	<p>Target: {targetId}</p>
	<p>File Name: {fileDetails.name}</p>
	<p>File Size: {formatBytes(fileDetails.size)}</p>
	<p>File Type: {fileDetails.type}</p>
	<TransferRate bind:this={rate} sent={fileDetails.received} />
	<progress max={fileDetails.size} value={fileDetails.received} />
</div>
