<script lang="ts">
	import { onMount } from 'svelte';
	import download from 'downloadjs';
	export let targetId: string;

	const state = {
		connection: undefined
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
		const chunks = [];
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
					console.log(`Received file details: ${JSON.stringify(fileDetails)}`);
				} else {
					chunks.push(data);
					fileDetails.received += data.byteLength;
					console.log(`Received chunk of ${data.byteLength} bytes`);
				}

				if (fileDetails.received === fileDetails.size) {
					// download the chunks with the file name and type
					// merge the chunks of ArrayBuffer
					console.log(`Received all ${fileDetails.size} bytes`);
					const blob = new Blob(chunks);

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
	<p>Receiver</p>
	<p>Target: {targetId}</p>
	<p>File Name: {fileDetails.name}</p>
	<p>File Size: {fileDetails.size}</p>
	<p>File Type: {fileDetails.type}</p>
	<progress max={fileDetails.size} value={fileDetails.received} />
</div>
